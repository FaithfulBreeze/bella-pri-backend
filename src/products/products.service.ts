import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { AssetsService } from 'src/assets/assets.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly assetsService: AssetsService,
  ) {}
  async create({ assetId, ...createProductDto }: CreateProductDto) {
    const foundProduct = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
      },
    });

    if (foundProduct)
      throw new ConflictException('Você já possui um item com esse nome.');

    const createdProduct = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(createdProduct);
    if (assetId) {
      const foundAsset = await this.assetsService.findOne(assetId);

      if (!foundAsset)
        throw new NotFoundException('O asset informado não foi encontrado');

      const foundProduct = await this.productRepository.findOne({
        where: {
          id: savedProduct.id,
        },
        relations: {
          assets: true,
        },
      });

      if (!foundProduct) throw new NotFoundException('Produto não encontrado');

      foundProduct.assets.push(foundAsset);

      return await this.productRepository.save(foundProduct);
    }
    return savedProduct;
  }

  async findAll(take?: number, skip?: number) {
    const [products, count] = await this.productRepository.findAndCount({
      skip: skip,
      take: take,
    });

    return {
      products,
      count,
    };
  }

  async findOne(id: number) {
    const foundProduct = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: {
        assets: true,
      },
    });

    if (!foundProduct) throw new NotFoundException('Produto não encontrado');

    return foundProduct;
  }

  async findOneByName(name: string, take?: number, skip?: number) {
    const [products, count] = await this.productRepository.findAndCount({
      where: { name: Like(`%${name}%`) },
      take,
      skip
    });

    return {
      products,
      count,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (updateProductDto.name) {
      const foundProduct = await this.productRepository.findOne({
        where: {
          name: updateProductDto.name,
        },
        relations: {
          assets: true,
        },
      });

      if (foundProduct)
        throw new ConflictException('Você já possui um item com esse nome.');
    }

    if (updateProductDto.assetId) {
      const foundAsset = await this.assetsService.findOne(
        updateProductDto.assetId,
      );

      if (!foundAsset)
        throw new NotFoundException('O asset informado não foi encontrado');

      const foundProduct = await this.productRepository.findOne({
        where: {
          id,
        },
        relations: {
          assets: true,
        },
      });

      if (!foundProduct) throw new NotFoundException('Produto não encontrado');

      foundProduct.assets.push(foundAsset);

      return await this.productRepository.save(foundProduct);
    }

    return await this.productRepository.update(id, updateProductDto);
  }

  async remove(id: number) {
    const foundProduct = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundProduct) throw new NotFoundException('Produto não encontrado');

    return this.productRepository.remove(foundProduct);
  }
}
