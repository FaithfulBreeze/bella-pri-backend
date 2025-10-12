import { Test, TestingModule } from '@nestjs/testing';
import { TiktokVideosController } from './tiktok-videos.controller';
import { TiktokVideosService } from './tiktok-videos.service';

describe('TiktokVideosController', () => {
  let controller: TiktokVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiktokVideosController],
      providers: [TiktokVideosService],
    }).compile();

    controller = module.get<TiktokVideosController>(TiktokVideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
