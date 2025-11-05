import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MailerService } from '../mailer/mailer.service';
import { PurchasesService } from '../purchases/purchases.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from '../purchases/entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase])],
  controllers: [PaymentsController],
  providers: [PaymentsService, MailerService, PurchasesService],
})
export class PaymentsModule {}
