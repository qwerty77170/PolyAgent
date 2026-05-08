export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  DEGEN = 'DEGEN',
}

export interface Trade {
  id: string;
  market: string;
  outcome: 'YES' | 'NO';
  stake: number;
  odds: number;
  timestamp: number;
  status: 'PENDING' | 'WON' | 'LOST';
  analysis: string;
}

export interface Market {
  id: string;
  question: string;
  liquidity: number;
  volume: number;
  yesProbability: number;
  aiConfidence: number;
  aiVerdict: 'YES' | 'NO' | 'WAIT';
  category: string;
}

export interface AgentSettings {
  autoTrade: boolean;
  maxStake: number;
  riskLevel: RiskLevel;
  preferredCategories: string[];
  minConfidence: number;
}
