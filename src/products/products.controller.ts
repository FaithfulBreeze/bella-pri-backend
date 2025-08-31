import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('take') take: number = 20,
    @Query('skip') skip: number = 0,
    @Query('categoryIds') categoryIds?: number[],
    @Query('orderByPrice') orderByPrice: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.productsService.findAll(+take, +skip, categoryIds, orderByPrice);
  }

  @Get('/search')
  findOneByName(
    @Query('name') name: string,
    @Query('take') take: number = 20,
    @Query('skip') skip: number = 0,
    @Query('categoryIds') categoryIds?: number[],
    @Query('orderByPrice') orderByPrice: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.productsService.findOneByName(name, +take, +skip, categoryIds, orderByPrice);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
