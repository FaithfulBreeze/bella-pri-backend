import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MailerService } from '../mailer/mailer.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, MailerService],
})
export class PaymentsModule {}
