import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  link?: string;

  @ManyToMany(() => Asset, asset => asset.products, { nullable: true })
  @JoinTable()
  assets: Asset[];

  @ManyToMany(() => Category, category => category.products, { nullable: true })
  categories: Category[]
}
