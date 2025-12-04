import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GovernanceService } from './governance.service';
import { VotesService } from './votes.service';
import { DelegationService } from './delegation.service';
import { ReputationFeedService } from './reputation-feed.service';

@Module({
  imports: [PrismaModule],
  providers: [GovernanceService, VotesService, DelegationService, ReputationFeedService],
  exports: [GovernanceService, VotesService, DelegationService, ReputationFeedService],
})
export class GovernanceModule {}
