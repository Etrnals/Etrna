import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { WalletModule } from './wallet/wallet.module';
import { MusicModule } from './music/music.module';
import { OracleModule } from './oracle/oracle.module';
import { AgentModule } from './agent/agent.module';
import { AuthModule } from './auth/auth.module';
import { UefModule } from './uef/uef.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    WalletModule,
    MusicModule,
    OracleModule,
    AgentModule,
    UefModule,
  ],
})
export class AppModule {}
