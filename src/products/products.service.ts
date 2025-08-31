import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Product } from './entities/product.entity';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly assetsService: AssetsService,
  ) {}


  private async addAssetsToProduct(productId: number, assetIds: number[]) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { assets: true },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');

    const assets = await Promise.all(
      assetIds.map(id => this.assetsService.findOne(id)),
    );

    product.assets.push(...assets);
    return this.productRepository.save(product);
  }

  private buildQuery(
    name?: string,
    categoryIds?: number[],
    orderByPrice: 'ASC' | 'DESC' = 'ASC',
  ) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.assets', 'assets')
      .leftJoinAndSelect('product.categories', 'categories');

    if (name) {
      query.where('product.name LIKE :name', { name: `%${name.toLowerCase()}%` });
    }

    if (categoryIds && categoryIds.length > 0) {
      query.andWhere('categories.id IN (:...categoryIds)', { categoryIds });
    }

    query.orderBy('product.price', orderByPrice);

    return query;
  }


  async create({ assetIds = [], ...createProductDto }: CreateProductDto) {
    const existing = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });
    if (existing) throw new ConflictException('Você já possui um item com esse nome.');

    const product = this.productRepository.create(createProductDto);

    if (assetIds.length > 0) {
      const assets = await Promise.all(assetIds.map(id => this.assetsService.findOne(id)));
      product.assets = assets;
    }

    return this.productRepository.save(product);
  }

  async findAll(
    take?: number,
    skip?: number,
    categoryIds?: number[],
    orderByPrice: 'ASC' | 'DESC' = 'ASC',
  ) {
    const query = this.buildQuery(undefined, categoryIds, orderByPrice);
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
    const query = this.buildQuery(name, categoryIds, orderByPrice);
    query.take(take).skip(skip);

    const [products, count] = await query.getManyAndCount();
    return { products, count };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.name) {
      const existing = await this.productRepository.findOne({
        where: { name: updateProductDto.name },
      });
      if (existing && existing.id !== id)
        throw new ConflictException('Você já possui um item com esse nome.');
    }

    if (updateProductDto.assetIds && updateProductDto.assetIds.length > 0) {
      return this.addAssetsToProduct(id, updateProductDto.assetIds);
    }

    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');

    await this.productRepository.remove(product);
    return { message: 'Produto removido com sucesso' };
  }
}
