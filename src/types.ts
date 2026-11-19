export interface ServiceDependency {
  id: string;
  name: string;
  tier: number; // 0: Root, 1: Direct, 2: Secondary, 3: Perimeter
  type: 'microservice' | 'database' | 'gateway' | 'third-party' | 'message-broker';
  ownerTeam: string;
  compassScore: number; // 0-100
  p1IncidentsLast90Days: number;
  sla: string;
  status: 'healthy' | 'at-risk' | 'incident-prone' | 'critical';
  latencyMs: number;
  dependencies: string[]; // IDs of services it depends on
  linkedConfluenceDocs: Array<{ title: string; url: string; lastUpdated: string }>;
}

export interface BlastRadiusAnalysis {
  issueKey: string;
  issueSummary: string;
  rootService: ServiceDependency;
  impactedServices: ServiceDependency[];
  totalServicesImpacted: number;
  riskScore: number; // 0-100
  riskTier: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  riskFactors: Array<{
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  recentIncidentsFound: number;
  missingRunbooksCount: number;
  estimatedBlastRadiusDepth: number;
  recommendedActions: string[];
}

export interface RegressionSubtaskPayload {
  issueKey: string;
  services: string[];
}

export interface RollbackRunbookPayload {
  issueKey: string;
  spaceKey?: string;
  services?: string[];
}
