import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Product } from '../../products/entities/product.entity';

class PayerPhoneDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 3, { message: 'Area code must be 2 to 3 digits' })
  @Matches(/^\d+$/, { message: 'Area code must contain only numbers' })
  area_code: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 10, { message: 'Phone number must be between 8 and 10 digits' })
  @Matches(/^\d+$/, { message: 'Phone number must contain only numbers' })
  number: string;
}

class PayerAddressDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{5}-?\d{3}$/, { message: 'Invalid ZIP code format' })
  zip_code: string;

  @IsString()
  @IsNotEmpty()
  street_name: string;

  @IsString()
  @IsNotEmpty()
  street_number: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @Length(2, 2, { message: 'Federal unit (UF) must have 2 letters' })
  federal_unit: string;
}

class PayerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ValidateNested()
  @Type(() => PayerPhoneDto)
  phone: PayerPhoneDto;

  @ValidateNested()
  @Type(() => PayerAddressDto)
  address: PayerAddressDto;
}

export class CreatePaymentPreferenceDto {
  @IsArray()
  products: Pick<Product, 'name' | 'price' | 'quantity' | 'id'>[];

  @ValidateNested()
  @Type(() => PayerDto)
  payer: PayerDto;
}
