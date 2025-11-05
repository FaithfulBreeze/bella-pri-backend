import { IsEnum } from 'class-validator';
import { PurchaseStatus } from '../entities/purchase.entity';

export class UpdatePurchaseDto {
  @IsEnum(PurchaseStatus)
  status: PurchaseStatus;
}
