import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MusicService } from './music.service';

@Module({
  imports: [PrismaModule],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
