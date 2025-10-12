import { Product } from '../../products/entities/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @ManyToMany(() => Product, (product) => product.categories, {
    nullable: true,
  })
  @JoinTable()
  products: Product[];
}
