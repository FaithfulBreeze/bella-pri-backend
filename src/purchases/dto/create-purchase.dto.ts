import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { PurchaseStatus } from '../entities/purchase.entity';

export class CreatePurchaseDto {
  @IsString()
  paymentId: string;

  @IsEnum({ enum: PurchaseStatus })
  status: PurchaseStatus = PurchaseStatus.PURCHASED;

  @IsNumber()
  totalCost: number;

  @IsString()
  zipCode: string;

  @IsString()
  streetName: string;

  @IsString()
  streetNumber: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  federalUnit: string;

  @IsString()
  payerPhoneNumber: string;

  @IsString()
  payerPhoneAreaCode: string;

  @IsString()
  payerEmail: string;

  @IsString()
  payerName: string;

  @IsArray()
  items: {
    id: string;
    title: string;
    quantity: number;
    currency_id: string;
    unit_price: number;
  }[];
}
