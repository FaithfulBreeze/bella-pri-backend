import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { AssetsModule } from './assets/assets.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TiktokVideosModule } from './tiktok-videos/tiktok-videos.module';
import { PaymentsModule } from './payments/payments.module';
import { MailerService } from './mailer/mailer.service';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      autoLoadEntities: true,
      url: process.env.POSTGRES_DATABASE_URL,
      entities: [`${process.cwd()}/**/*.entity.js`],
      ssl: { rejectUnauthorized: false },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    AssetsModule,
    CategoriesModule,
    AuthModule,
    TiktokVideosModule,
    PaymentsModule,
    PurchasesModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailerService],
})
export class AppModule {}
