import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OracleService } from './oracle.service';
import { CreateOracleRequestDto } from './dto/create-oracle-request.dto';
import { OracleWebhookDto } from './dto/oracle-webhook.dto';

@Controller('oracle')
@UseGuards(JwtAuthGuard)
export class OracleController {
  constructor(private readonly oracleService: OracleService) {}

  @Post('requests')
  async createRequest(@Body() dto: CreateOracleRequestDto) {
    return this.oracleService.requestAI(dto);
  }

  @Get('requests/:chainRequestId')
  async getRequest(@Param('chainRequestId', ParseIntPipe) chainRequestId: number) {
    return this.oracleService.getRequest(chainRequestId);
  }

  @Post('webhook')
  async webhook(@Body() dto: OracleWebhookDto) {
    return this.oracleService.handleResultWebHook(dto);
  }
}
