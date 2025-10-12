import { PartialType } from '@nestjs/mapped-types';
import { CreateTiktokVideoDto } from './create-tiktok-video.dto';

export class UpdateTiktokVideoDto extends PartialType(CreateTiktokVideoDto) {}
