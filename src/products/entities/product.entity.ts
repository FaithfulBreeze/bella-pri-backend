import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';

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

  @ManyToMany(() => Asset, asset => asset.product, { nullable: true })
  @JoinTable()
  assets: Asset[];
}
