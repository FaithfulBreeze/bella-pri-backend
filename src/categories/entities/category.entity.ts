import { Product } from "../../products/entities/product.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    label: string

    @ManyToMany(() => Product, product => product.categories, { nullable: true })
    products: Product[]
}
