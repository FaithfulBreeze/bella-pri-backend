import { IsNotEmpty, IsString } from "class-validator";

export class CreateAssetDto {
    @IsString()
    @IsNotEmpty()
    src: string

    @IsString()
    @IsNotEmpty()
    name: string
}
