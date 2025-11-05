import { Controller, Post, Body, Headers, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentPreferenceDto } from './dto/create-payment-preference.dto';
import { WebhookDto } from './dto/webhook.dto';
import { type Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() createPaymentPreferenceDto: CreatePaymentPreferenceDto) {
    return this.paymentsService.create(createPaymentPreferenceDto);
  }

  @Post('webhook')
  webhook(@Body() body: WebhookDto, @Req() req: Request) {
    this.paymentsService.webhook(body, req);
  }
}
