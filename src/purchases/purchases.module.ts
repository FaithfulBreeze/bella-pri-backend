import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './entities/purchase.entity';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/entities/product.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Category } from '../categories/entities/category.entity';
import { AssetsService } from '../assets/assets.service';
import { CategoriesService } from '../categories/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, Product, Asset, Category])],
  controllers: [PurchasesController],
  providers: [PurchasesService, ProductsService, AssetsService, CategoriesService],
})
export class PurchasesModule {}
