import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase, PurchaseStatus } from './entities/purchase.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto) {
    const createdPurchase = this.purchasesRepository.create(createPurchaseDto);
    await this.purchasesRepository.save(createdPurchase);
  }

  async findAll(
    take: number,
    skip: number,
    status: PurchaseStatus = PurchaseStatus.PURCHASED,
  ) {
    const query = this.purchasesRepository.createQueryBuilder('purchases');
    query.take(take).skip(skip).where(`status = '${status}'`);

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

    foundPurchase.status = status;

    await this.purchasesRepository.save(foundPurchase);
  }
}
