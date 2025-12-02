import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {}
