import { IsOptional } from 'class-validator';

export class WebhookDto {
  @IsOptional()
  action: string;
  @IsOptional()
  api_version: string;
  @IsOptional()
  data: { id: string };
  @IsOptional()
  date_created: string;
  @IsOptional()
  id: string;
  @IsOptional()
  live_mode: false;
  @IsOptional()
  type: string;
  @IsOptional()
  user_id: number;
}
