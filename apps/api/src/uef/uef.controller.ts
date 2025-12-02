import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UefService } from './uef.service';
import { CreateUefDto } from './dto/create-uef.dto';
import { UpdateUefDto } from './dto/update-uef.dto';

@Controller('uef')
@UseGuards(JwtAuthGuard)
export class UefController {
  constructor(private readonly uefService: UefService) {}

  @Get()
  async list() {
    return this.uefService.list();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.uefService.getOne(id);
  }

  @Post()
  async register(@Body() dto: CreateUefDto) {
    return this.uefService.register(dto);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUefDto) {
    return this.uefService.update(id, dto);
  }
}
