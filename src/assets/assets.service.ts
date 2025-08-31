import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Asset } from './entities/asset.entity';
import { Like, Repository } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetsRepository: Repository<Asset>,
  ) {}
  async create(createAssetDto: CreateAssetDto) {
    const foundAsset = await this.assetsRepository.findOne({
      where: {
        src: createAssetDto.src,
      },
    });

    if (foundAsset)
      throw new ConflictException('Você já possui um asset com essa url.');

    const createdAsset = this.assetsRepository.create(createAssetDto);
    const savedAsset = await this.assetsRepository.save(createdAsset);
    return savedAsset;
  }

  async findAll(take?: number, skip?: number) {
    const [assets, count] = await this.assetsRepository.findAndCount({
      skip: skip,
      take: take,
    });

    return {
      assets,
      count,
    };
  }

  async findOne(id: number) {
    const foundAsset = await this.assetsRepository.findOne({
      where: {
        id,
      },
      relations: {
        products: true,
      },
    });

    if (!foundAsset) throw new NotFoundException('Asset não encontrado');

    return foundAsset;
  }

  async findOneByName(name: string, take?: number, skip?: number) {
    const [assets, count] = await this.assetsRepository.findAndCount({
      where: { name: Like(`%${name}%`) },
      take,
      skip,
    });

    return {
      assets,
      count,
    };
  }

  async update(id: number, updateAssetDto: UpdateAssetDto) {
    const foundAsset = await this.assetsRepository.findOne({
      where: {
        src: updateAssetDto.src,
      },
    });

    if (foundAsset)
      throw new ConflictException('Você já possui um asset com essa url.');

    return await this.assetsRepository.update(id, updateAssetDto);
  }

  async remove(id: number) {
    const foundAsset = await this.assetsRepository.findOne({
      where: {
        id,
      },
    });

    if (!foundAsset) throw new NotFoundException('Asset não encontrado');

    return this.assetsRepository.remove(foundAsset);
  }
}
