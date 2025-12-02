import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { WalletService } from './wallet.service';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId')
  async getSmartAccount(@Param('userId') userId: string) {
    return this.walletService.getSmartAccount(userId);
  }
}
