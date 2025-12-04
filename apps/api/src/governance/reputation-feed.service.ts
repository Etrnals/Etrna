import { Injectable } from '@nestjs/common';

export interface ReputationSnapshot {
  uniqueHumanScore: number;
  vibeCheckScore: number;
  verseXp: number;
  musicEngagement: number;
  uefContributions: number;
  etrnalsRarity: number;
  etrnaPass: number;
  multiplier: number;
}

@Injectable()
export class ReputationFeedService {
  async fetchReputation(wallet: string): Promise<ReputationSnapshot> {
    const snapshot: ReputationSnapshot = {
      uniqueHumanScore: 0.1,
      vibeCheckScore: 0.2,
      verseXp: 0.2,
      musicEngagement: 0.1,
      uefContributions: 0.2,
      etrnalsRarity: 0.2,
      etrnaPass: 0.1,
      multiplier: 1,
    };

    snapshot.multiplier =
      1 +
      snapshot.uniqueHumanScore +
      snapshot.vibeCheckScore +
      snapshot.verseXp +
      snapshot.musicEngagement +
      snapshot.uefContributions +
      snapshot.etrnalsRarity +
      snapshot.etrnaPass;

    return { ...snapshot, multiplier: parseFloat(snapshot.multiplier.toFixed(2)) };
  }
}
