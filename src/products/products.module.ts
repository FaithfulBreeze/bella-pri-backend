import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AssetsService } from '../assets/assets.service';
import { Asset } from '../assets/entities/asset.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Asset, Category])],
  controllers: [ProductsController],
  providers: [ProductsService, AssetsService, CategoriesService],
})
export class ProductsModule {}
