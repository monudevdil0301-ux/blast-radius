export interface ServiceDependency {
  id: string;
  name: string;
  tier: number; // 0: Root, 1: Direct, 2: Secondary
  type: 'microservice' | 'database' | 'gateway' | 'third-party' | 'message-broker';
  ownerTeam: string;
  compassScore: number; // 0-100
  p1IncidentsLast90Days: number;
  sla: string;
  status: 'healthy' | 'at-risk' | 'incident-prone' | 'critical';
  latencyMs: number;
  dependencies: string[];
  linkedConfluenceDocs: Array<{ title: string; url: string; lastUpdated: string }>;
}

export interface RiskFactor {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BlastRadiusAnalysis {
  issueKey: string;
  issueSummary: string;
  rootService: ServiceDependency;
  impactedServices: ServiceDependency[];
  totalServicesImpacted: number;
  riskScore: number; // 0-100
  riskTier: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  riskFactors: RiskFactor[];
  recentIncidentsFound: number;
  missingRunbooksCount: number;
  estimatedBlastRadiusDepth: number;
  recommendedActions: string[];
}

export interface SimulationResult {
  simulatedService: string;
  failureType: string;
  cascadeEffect: {
    circuitBreakerTripped: boolean;
    downstreamDegradationRate: string;
    estimatedTTRMinutes: number;
    affectedEndpoints: string[];
    recommendedMitigation: string;
  };
}
