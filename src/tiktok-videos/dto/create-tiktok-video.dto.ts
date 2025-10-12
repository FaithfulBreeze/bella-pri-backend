import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTiktokVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  videoId: string;

  @IsBoolean()
  @IsOptional()
  highlighted: boolean;

  @IsInt()
  @IsOptional()
  order: number;
}
