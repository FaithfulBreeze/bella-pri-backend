import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTiktokVideoDto } from './dto/create-tiktok-video.dto';
import { UpdateTiktokVideoDto } from './dto/update-tiktok-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TiktokVideo } from './entities/tiktok-video.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TiktokVideosService {
  constructor(
    @InjectRepository(TiktokVideo)
    private readonly tiktokVideosRepository: Repository<TiktokVideo>,
  ) {}

  private buildQuery({
    name,
    order = 'ASC',
    highlighted,
  }: {
    name?: string;
    order?: 'ASC' | 'DESC';
    highlighted?: boolean;
  }) {
    const query =
      this.tiktokVideosRepository.createQueryBuilder('tiktok_video');

    if (name) {
      query.where('LOWER(tiktok_video.name) ILIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    }

    if (highlighted) {
      query.andWhere('highlighted = true');
    }

    query.orderBy('tiktok_video.order', order);

    return query;
  }

  async create(createTiktokVideoDto: CreateTiktokVideoDto) {
    const videoIdConflict = await this.tiktokVideosRepository.findOne({
      where: { videoId: createTiktokVideoDto.videoId },
    });
    if (videoIdConflict)
      throw new ConflictException('Conflito na propriedade videoId');

    if (createTiktokVideoDto.order) {
      const orderConflict = await this.tiktokVideosRepository.findOne({
        where: { order: createTiktokVideoDto.order },
      });
      if (orderConflict)
        throw new ConflictException('Conflito na propriedade order');
    }

    const createdVideo = this.tiktokVideosRepository.create({
      ...createTiktokVideoDto,
      order:
        createTiktokVideoDto.order || (await this.getHighestOrderValue()) + 1,
    });

    return await this.tiktokVideosRepository.save(createdVideo);
  }

  async findAll(take?: number, skip?: number, order: 'ASC' | 'DESC' = 'ASC') {
    const query = this.buildQuery({ order });
    query.take(take).skip(skip);

    const [tiktokVideos, count] = await query.getManyAndCount();
    return { tiktokVideos, count };
  }

  async findAllHighlighted(take?: number, skip?: number) {
    const query = this.buildQuery({ highlighted: true });
    query.take(take).skip(skip);

    const [tiktokVideos, count] = await query.getManyAndCount();
    return { tiktokVideos, count };
  }

  async findOne(id: number) {
    const tiktokVideo = await this.tiktokVideosRepository.findOne({
      where: {
        id,
      },
    });
    if (!tiktokVideo) throw new NotFoundException('Video não encontrado.');
    return tiktokVideo;
  }

  async update(id: number, updateTiktokVideoDto: UpdateTiktokVideoDto) {
    if (updateTiktokVideoDto.videoId) {
      const videoIdConflict = await this.tiktokVideosRepository.findOne({
        where: { videoId: updateTiktokVideoDto.videoId },
      });
      if (videoIdConflict)
        throw new ConflictException('Conflito na propriedade videoId');
    }

    if (updateTiktokVideoDto.order) {
      const orderConflict = await this.tiktokVideosRepository.findOne({
        where: { order: updateTiktokVideoDto.order },
      });
      if (orderConflict)
        throw new ConflictException('Conflito na propriedade order');
    }

    const tiktokVideo = await this.tiktokVideosRepository.findOne({
      where: { id },
    });

    if (!tiktokVideo) throw new NotFoundException('Video não encontrado.');

    Object.assign(tiktokVideo, updateTiktokVideoDto);

    return this.tiktokVideosRepository.save(tiktokVideo);
  }

  async remove(id: number) {
    const tiktokVideo = await this.tiktokVideosRepository.findOne({
      where: { id },
    });
    if (!tiktokVideo) throw new NotFoundException('Video não encontrado');

    await this.tiktokVideosRepository.remove(tiktokVideo);
    return { message: 'Video removido com sucesso' };
  }

  private async getHighestOrderValue() {
    const orderedTiktokVideos = await this.tiktokVideosRepository.find({
      order: { order: 'DESC' },
    });
    const highestOrderValue = orderedTiktokVideos[0]?.order || 0;

    return highestOrderValue;
  }
}
