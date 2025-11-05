import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { AuthGuard } from '@nestjs/passport';
import { PurchaseStatus } from './entities/purchase.entity';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(
    @Query('take') take: number = 20,
    @Query('skip') skip: number = 0,
    @Query('status') status: PurchaseStatus,
  ) {
    return this.purchasesService.findAll(+take, +skip, status);
  }

  @Get(':paymentId')
  findOne(@Param('paymentId') paymentId: string) {
    return this.purchasesService.findOne(paymentId);
  }

  @Patch(':paymentId')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('paymentId') paymentId: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchasesService.update(paymentId, updatePurchaseDto.status);
  }
}
