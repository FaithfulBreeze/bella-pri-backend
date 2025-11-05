import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MailerService } from '../mailer/mailer.service';
import { PurchasesService } from '../purchases/purchases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '../purchases/entities/purchase.entity';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/entities/product.entity';
import { AssetsService } from '../assets/assets.service';
import { CategoriesService } from '../categories/categories.service';
import { Asset } from '../assets/entities/asset.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, Product, Asset, Category])],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    MailerService,
    PurchasesService,
    ProductsService,
    AssetsService,
    CategoriesService,
  ],
})
export class PaymentsModule {}
