import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { AssetsService } from '../assets/assets.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly assetsService: AssetsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private buildQuery({
    name,
    categoryIds,
    orderByPrice = 'ASC',
    highlighted
  }: {
    name?: string;
    categoryIds?: number[];
    orderByPrice?: 'ASC' | 'DESC';
    highlighted?: boolean
  }) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.assets', 'assets')
      .leftJoinAndSelect('product.categories', 'categories');

    if (name) {
      query.where('LOWER(product.name) ILIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    if (categoryIds && categoryIds.length > 0) {
      query.andWhere('categories.id IN (:...categoryIds)', { categoryIds });
    }

    if(highlighted) {
      query.andWhere('highlighted = true')
    }

    query.orderBy('product.price', orderByPrice);

    return query;
  }

  async create({
    assetIds = [],
    categoryIds = [],
    ...createProductDto
  }: CreateProductDto) {
    const existing = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });
    if (existing)
      throw new ConflictException('Você já possui um item com esse nome.');

    const product = this.productRepository.create(createProductDto);

    if (assetIds.length > 0) {
      const uniqueIds = [...new Set(assetIds)];
      const assets = await Promise.all(
        uniqueIds.map((id) => this.assetsService.findOne(id)),
      );
      product.assets = assets;
    }

    if (categoryIds.length > 0) {
      const uniqueIds = [...new Set(categoryIds)];
      const categories = await Promise.all(
        uniqueIds.map((id) => this.categoriesService.findOne(id)),
      );
      product.categories = categories;
    }

    return this.productRepository.save(product);
  }

  async findAll(
    take?: number,
    skip?: number,
    categoryIds?: number[],
    orderByPrice: 'ASC' | 'DESC' = 'ASC',
  ) {
    const query = this.buildQuery({ categoryIds, orderByPrice });
    query.take(take).skip(skip);

    const [products, count] = await query.getManyAndCount();
    return { products, count };
  }

  async findAllHighlighted(take?: number, skip?: number) {
    const query = this.buildQuery({ highlighted: true });
    query.take(take).skip(skip);

    const [products, count] = await query.getManyAndCount();
    return { products, count };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { assets: true, categories: true },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async findOneByName(
    name: string,
    take?: number,
    skip?: number,
    categoryIds?: number[],
    orderByPrice: 'ASC' | 'DESC' = 'ASC',
  ) {
    const query = this.buildQuery({name, categoryIds, orderByPrice});
    query.take(take).skip(skip);

    const [products, count] = await query.getManyAndCount();
    return { products, count };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.name) {
      const existing = await this.productRepository.findOne({
        where: { name: updateProductDto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Você já possui um item com esse nome.');
      }
    }

    const product = await this.productRepository.findOne({
      where: { id },
      relations: { assets: true, categories: true },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');

    if (updateProductDto.assetIds) {
      const uniqueIds = [...new Set(updateProductDto.assetIds)];
      const assets = await Promise.all(
        uniqueIds.map((id) => this.assetsService.findOne(id)),
      );
      product.assets = assets;
    }

    if (updateProductDto.categoryIds) {
      const uniqueIds = [...new Set(updateProductDto.categoryIds)];
      const categories = await Promise.all(
        uniqueIds.map((id) => this.categoriesService.findOne(id)),
      );
      product.categories = categories;
    }

    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    await this.productRepository.remove(product);
    return { message: 'Produto removido com sucesso' };
  }
}
