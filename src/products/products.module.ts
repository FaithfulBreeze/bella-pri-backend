import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { AssetsService } from 'src/assets/assets.service';
import { Asset } from 'src/assets/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Asset])],
  controllers: [ProductsController],
  providers: [ProductsService, AssetsService],
})
export class ProductsModule {}
