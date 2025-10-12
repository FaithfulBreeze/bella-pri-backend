import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TiktokVideosService } from './tiktok-videos.service';
import { CreateTiktokVideoDto } from './dto/create-tiktok-video.dto';
import { UpdateTiktokVideoDto } from './dto/update-tiktok-video.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tiktok-videos')
export class TiktokVideosController {
  constructor(private readonly tiktokVideosService: TiktokVideosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTiktokVideoDto: CreateTiktokVideoDto) {
    return this.tiktokVideosService.create(createTiktokVideoDto);
  }

  @Get()
  findAll(
    @Query('take') take: number = 20,
    @Query('skip') skip: number = 0,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.tiktokVideosService.findAll(+take, +skip, order);
  }

  @Get('/highlighted')
  findAllHighlighted(
    @Query('take') take: number = 20,
    @Query('skip') skip: number = 0,
  ) {
    return this.tiktokVideosService.findAllHighlighted(+take, +skip);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiktokVideosService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTiktokVideoDto: UpdateTiktokVideoDto,
  ) {
    return this.tiktokVideosService.update(+id, updateTiktokVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiktokVideosService.remove(+id);
  }
}
