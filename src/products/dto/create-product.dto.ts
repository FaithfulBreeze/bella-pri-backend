import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ArrayUnique,
  IsBoolean,
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

  @IsBoolean()
  @IsOptional()
  highlighted: boolean;

  @IsInt()
  @IsOptional()
  mainAssetId?: number;

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
