import { Module } from '@nestjs/common';
import { TiktokVideosService } from './tiktok-videos.service';
import { TiktokVideosController } from './tiktok-videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiktokVideo } from './entities/tiktok-video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TiktokVideo])],
  controllers: [TiktokVideosController],
  providers: [TiktokVideosService],
})
export class TiktokVideosModule {}
