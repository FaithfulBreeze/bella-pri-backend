import { 
  IsArray, 
  IsInt, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsPositive, 
  IsString, 
  ArrayUnique 
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsString()
  @IsOptional()
  link?: string;

  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsOptional()
  assetIds?: number[];

  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[];
}
