import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MusicService } from './music.service';
import { UploadTrackDto } from './dto/upload-track.dto';

@Controller('music')
@UseGuards(JwtAuthGuard)
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  async listTracks() {
    return this.musicService.listTracks();
  }

  @Post()
  async upload(@Body() dto: UploadTrackDto) {
    return this.musicService.uploadTrack(dto);
  }
}
