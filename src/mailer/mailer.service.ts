import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MailerService {
  private transporter: Transporter;
  private transporterConfig: {
    service: string;
    email: string;
    password: string;
  };

  constructor(private readonly configService: ConfigService) {
    this.transporterConfig = {
      service: this.configService.getOrThrow<string>('NODEMAILER_SERVICE'),
      email: this.configService.getOrThrow<string>('NODEMAILER_EMAIL'),
      password: this.configService.getOrThrow<string>('NODEMAILER_PASSWORD'),
    };
    this.transporter = createTransport({
      service: this.transporterConfig.service,
      auth: {
        user: this.transporterConfig.email,
        pass: this.transporterConfig.password,
      },
    });
  }

  async sendPurchaseEmail(mailArgs: { addressee: string }): Promise<void> {
    const template = await fs.readFile(
      join(process.cwd(), 'src', 'mailer', 'templates', 'purchase-email.html'),
    );
    this.transporter.sendMail({
      from: this.transporterConfig.email,
      to: mailArgs.addressee,
      subject: 'Compra aprovada - Bella Pri',
      html: template,
    });
  }
}
