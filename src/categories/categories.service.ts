import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private readonly categoriesRepository: Repository<Category>) {}
    async create(createCategoryDto: CreateCategoryDto) {
      const foundCategory = await this.categoriesRepository.findOne({
        where: {
          label: createCategoryDto.label,
        },
      });
  
      if (foundCategory)
        throw new ConflictException('Você já possui uma categoria com esse nome.');
  
      const createdCategory = this.categoriesRepository.create(createCategoryDto);
      const savedCategory = await this.categoriesRepository.save(createdCategory);
      return savedCategory;
    }
  
    async findAll(take?: number, skip?: number) {
      const [categories, count] = await this.categoriesRepository.findAndCount({
        skip: skip,
        take: take,
      });
  
      return {
        categories,
        count,
      };
    }
  
    async findOne(id: number) {
      const foundCategory = await this.categoriesRepository.findOne({
        where: {
          id,
        },
      });
  
      if (!foundCategory) throw new NotFoundException('Categoria não encontrada');
  
      return foundCategory;
    }
  
    async findOneByName(label: string, take?: number, skip?: number) {
      const [categories, count] = await this.categoriesRepository.findAndCount({
        where: { label: ILike(`%${label}%`) },
        take,
        skip
      });
  
      return {
        categories,
        count,
      };
    }
  
    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
      return await this.categoriesRepository.update(id, updateCategoryDto);
    }
  
    async remove(id: number) {
      const foundCategory = await this.categoriesRepository.findOne({
        where: {
          id,
        },
      });
  
      if (!foundCategory) throw new NotFoundException('Categoria não encontrada');
  
      return this.categoriesRepository.remove(foundCategory);
    }
}
