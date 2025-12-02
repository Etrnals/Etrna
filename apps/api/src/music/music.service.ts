import { Injectable } from '@nestjs/common';
import { PrismaService, TrackRecord } from '../prisma/prisma.service';
import { UploadTrackDto } from './dto/upload-track.dto';

@Injectable()
export class MusicService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadTrack(payload: UploadTrackDto): Promise<TrackRecord> {
    return this.prisma.createTrack(payload);
  }

  async listTracks(): Promise<TrackRecord[]> {
    return this.prisma.listTracks();
  }
}
