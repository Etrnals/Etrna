import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, UefRecord } from '../prisma/prisma.service';
import { CreateUefDto } from './dto/create-uef.dto';
import { UpdateUefDto } from './dto/update-uef.dto';

@Injectable()
export class UefService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: CreateUefDto): Promise<UefRecord> {
    return this.prisma.registerUef({
      owner: dto.owner,
      uri: dto.uri,
      contentHash: dto.contentHash,
      name: dto.name,
    });
  }

  async update(id: number, dto: UpdateUefDto): Promise<UefRecord> {
    const next = await this.prisma.updateUef(id, {
      uri: dto.uri ?? undefined,
      contentHash: dto.contentHash ?? undefined,
      name: dto.name ?? undefined,
    });

    if (!next) {
      throw new NotFoundException(`UEF ${id} not found`);
    }

    return next;
  }

  async list(): Promise<UefRecord[]> {
    return this.prisma.listUefs();
  }

  async getOne(id: number): Promise<UefRecord> {
    const record = await this.prisma.findUef(id);
    if (!record) {
      throw new NotFoundException(`UEF ${id} not found`);
    }
    return record;
  }
}
