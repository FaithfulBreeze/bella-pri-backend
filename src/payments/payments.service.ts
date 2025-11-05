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
import { type Response, type Request } from 'express';
import { PurchasesService } from '../purchases/purchases.service';
import { PurchaseStatus } from '../purchases/entities/purchase.entity';

@Injectable()
export class PaymentsService {
  mp: MercadoPago;
  webhookSecret: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly purchasesService: PurchasesService,
  ) {
    this.webhookSecret = configService.getOrThrow(
      'MP_WEBHOOK_SIGNATURE_SECRET',
    );
    this.mp = new MercadoPago({
      accessToken: this.configService.getOrThrow('MP_ACCESS_TOKEN'),
    });
  }

  async webhook(body: WebhookDto, req: Request, res: Response) {
    this.validateWebhook(req);
    try {
      const payment = await this.getPayment(body.id);

      if (payment.status !== 'approved')
        throw new BadRequestException('Payment not approved');

      this.purchasesService.update(body.id, PurchaseStatus.PURCHASED);

      const payer = payment.payer;

      await this.mailerService.sendPurchaseEmail({
        addressee: payer?.email || '',
      });

      res.json({ success: true });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
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

    await this.purchasesService.create({
      paymentId: preference.id!,
      totalCost: items.reduce(
        (acc, item) => acc + item.unit_price * item.quantity,
        0,
      ),
      city: createPaymentPreferenceDto.payer.address.city,
      federalUnit: createPaymentPreferenceDto.payer.address.federal_unit,
      neighborhood: createPaymentPreferenceDto.payer.address.neighborhood,
      streetName: createPaymentPreferenceDto.payer.address.street_name,
      streetNumber: createPaymentPreferenceDto.payer.address.street_number,
      zipCode: createPaymentPreferenceDto.payer.address.zip_code,
      payerEmail: createPaymentPreferenceDto.payer.email,
      payerPhoneNumber: createPaymentPreferenceDto.payer.phone.number,
      payerPhoneAreaCode: createPaymentPreferenceDto.payer.phone.area_code,
      payerName: createPaymentPreferenceDto.payer.name,
      status: PurchaseStatus.PENDING_PAYMENT,
    });

    return preference;
  }

  async getPayment(paymentId: string) {
    return await new Payment(this.mp).get({ id: paymentId });
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
