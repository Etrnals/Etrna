import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MusicService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadTrack(payload: { title: string; uri: string; mintOnChain: boolean }) {
    // Placeholder for integration with UEFRegistry + MusicDistributor.
    return payload;
  }
}
