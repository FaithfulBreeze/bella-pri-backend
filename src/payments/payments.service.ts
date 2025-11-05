import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePaymentPreferenceDto } from './dto/create-payment-preference.dto';
import MercadoPago, { Payment, Preference } from 'mercadopago';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import * as crypto from 'crypto';
import { WebhookDto } from './dto/webhook.dto';
import { type Request } from 'express';

@Injectable()
export class PaymentsService {
  mp: MercadoPago;
  webhookSecret: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.webhookSecret = configService.getOrThrow(
      'MP_WEBHOOK_SIGNATURE_SECRET',
    );
    this.mp = new MercadoPago({
      accessToken: this.configService.getOrThrow('MP_ACCESS_TOKEN'),
    });
  }

  async webhook(body: WebhookDto, req: Request) {
    this.validateWebhook(req);
    try {
      const payment = await new Payment(this.mp).get({ id: body.id });
      if (payment.status !== 'approved')
        throw new BadRequestException('Payment not approved');
      const payer = payment.payer;

      await this.mailerService.sendPurchaseEmail({
        addressee: payer?.email || '',
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async create(createPaymentPreferenceDto: CreatePaymentPreferenceDto) {
    const items = createPaymentPreferenceDto.products.map((p) => ({
      id: p.id.toString(),
      title: p.name,
      quantity: p.quantity,
      currency_id: 'BRL',
      unit_price: p.price,
    }));

    const preference = await new Preference(this.mp).create({
      body: {
        items,
        payer: createPaymentPreferenceDto.payer,
        redirect_urls: {
          success: '/thank-you',
          failure: '/payment-failure',
          pending: '/payment-pending',
        },
      },
    });

    return preference;
  }

  private validateWebhook(req) {
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];

    const parts = xSignature.split(',');
    let ts, hash;

    parts.forEach((part) => {
      const [key, value] = part.split('=');
      if (key === 'ts') ts = value;
      if (key === 'v1') hash = value;
    });

    const dataId = req.body.data?.id || req.body.id;

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    const hmac = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(manifest)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(hash),
    );

    if (!isValid) throw new UnauthorizedException();
  }
}
