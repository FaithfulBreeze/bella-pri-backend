import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase, PurchaseStatus } from './entities/purchase.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
    private readonly productsService: ProductsService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const createdPurchase = this.purchasesRepository.create(createPurchaseDto);
    await this.purchasesRepository.save(createdPurchase);
    for (let product of createPurchaseDto.items) {
      const foundProduct = await this.productsService.findOne(
        Number(product.id),
      );
      if (foundProduct) {
        await this.productsService.update(Number(product.id), {
          quantity: foundProduct.quantity - product.quantity,
        });
      }
    }
  }

  async findAll(
    take: number,
    skip: number,
    status: PurchaseStatus = PurchaseStatus.PURCHASED,
  ) {
    const query = this.purchasesRepository.createQueryBuilder('purchase');
    query
      .take(take)
      .skip(skip)
      .where(`status = '${status}'`)
      .leftJoinAndSelect('purchase.products', 'products');

    return await query.getManyAndCount();
  }

  findOne(paymentId: string) {
    return this.purchasesRepository.findOne({
      where: {
        paymentId,
      },
    });
  }

  async update(paymentId: string, status: PurchaseStatus) {
    const foundPurchase = await this.purchasesRepository.findOne({
      where: {
        paymentId,
      },
    });

    if (!foundPurchase) throw new NotFoundException('Compra não encontrada');

    await this.purchasesRepository.update(foundPurchase.id, { status });
  }
}
