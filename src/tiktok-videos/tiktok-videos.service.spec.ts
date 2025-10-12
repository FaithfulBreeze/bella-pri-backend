import { Test, TestingModule } from '@nestjs/testing';
import { TiktokVideosService } from './tiktok-videos.service';

describe('TiktokVideosService', () => {
  let service: TiktokVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiktokVideosService],
    }).compile();

    service = module.get<TiktokVideosService>(TiktokVideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
