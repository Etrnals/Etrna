import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WalletModule } from './wallet/wallet.module';
import { MusicModule } from './music/music.module';
import { OracleModule } from './oracle/oracle.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WalletModule,
    MusicModule,
    OracleModule,
    AgentModule,
  ],
})
export class AppModule {}
