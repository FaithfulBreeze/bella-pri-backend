import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PurchaseStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PURCHASED = 'PURCHASED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentId: string;

  @Column({ enum: PurchaseStatus })
  status: PurchaseStatus = PurchaseStatus.PENDING_PAYMENT;

  @Column()
  totalCost: number;

  @Column()
  zipCode: string;

  @Column()
  streetName: string;

  @Column()
  streetNumber: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column()
  federalUnit: string;

  @Column()
  payerPhoneNumber: string;

  @Column()
  payerPhoneAreaCode: string;

  @Column()
  payerEmail: string;

  @Column()
  payerName: string;

  @ManyToMany(() => Product, (product) => product.purchases, { nullable: true })
  @JoinTable()
  products: Product[];
}
