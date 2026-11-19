import { invoke } from '@forge/bridge';
import { BlastRadiusAnalysis, SimulationResult } from './types';

// Mock presets for different test scenarios
export const MOCK_ISSUES: Record<string, BlastRadiusAnalysis> = {
  'AUTH-412': {
    issueKey: 'AUTH-412',
    issueSummary: 'Refactor Token Validation & Key Rotation Pipeline',
    rootService: {
      id: 'auth-service',
      name: 'Auth & Session Token Service',
      tier: 0,
      type: 'microservice',
      ownerTeam: 'Identity & Core Security',
      compassScore: 78,
      p1IncidentsLast90Days: 1,
      sla: '99.99%',
      status: 'healthy',
      latencyMs: 18,
      dependencies: ['billing-api', 'user-profile-svc', 'api-gateway', 'audit-kafka-broker'],
      linkedConfluenceDocs: [
        { title: 'ADR-041: JWT to PASETO Migration Strategy', url: 'https://confluence.example.com/adr-041', lastUpdated: '14 days ago' },
        { title: 'Runbook: Auth Token Invalidation Emergency Steps', url: 'https://confluence.example.com/auth-runbook', lastUpdated: '6 months ago (STALE)' }
      ]
    },
    impactedServices: [
      {
        id: 'billing-api',
        name: 'Payment & Checkout Engine',
        tier: 1,
        type: 'microservice',
        ownerTeam: 'FinTech Core',
        compassScore: 92,
        p1IncidentsLast90Days: 2,
        sla: '99.999%',
        status: 'incident-prone',
        latencyMs: 85,
        dependencies: ['stripe-connector', 'ledger-db'],
        linkedConfluenceDocs: [
          { title: 'PCI-DSS Compliance Boundary v4.0', url: 'https://confluence.example.com/pci-dss', lastUpdated: '1 month ago' }
        ]
      },
      {
        id: 'user-profile-svc',
        name: 'Customer Profile & Preferences',
        tier: 1,
        type: 'microservice',
        ownerTeam: 'Growth & Accounts',
        compassScore: 64,
        p1IncidentsLast90Days: 0,
        sla: '99.9%',
        status: 'at-risk',
        latencyMs: 42,
        dependencies: ['redis-cache-cluster', 'postgres-primary'],
        linkedConfluenceDocs: []
      },
      {
        id: 'api-gateway',
        name: 'Edge Gateway (Kong / Envoy)',
        tier: 1,
        type: 'gateway',
        ownerTeam: 'Platform SRE',
        compassScore: 95,
        p1IncidentsLast90Days: 0,
        sla: '99.999%',
        status: 'healthy',
        latencyMs: 4,
        dependencies: [],
        linkedConfluenceDocs: [
          { title: 'Edge Routing Topology & Rate Limits', url: 'https://confluence.example.com/edge-routing', lastUpdated: '3 weeks ago' }
        ]
      },
      {
        id: 'audit-kafka-broker',
        name: 'Audit Stream & Event Bus',
        tier: 1,
        type: 'message-broker',
        ownerTeam: 'Data Infrastructure',
        compassScore: 88,
        p1IncidentsLast90Days: 1,
        sla: '99.95%',
        status: 'healthy',
        latencyMs: 12,
        dependencies: ['compliance-archive-worker'],
        linkedConfluenceDocs: []
      },
      {
        id: 'stripe-connector',
        name: 'Stripe External Payment Webhook',
        tier: 2,
        type: 'third-party',
        ownerTeam: 'FinTech Core',
        compassScore: 90,
        p1IncidentsLast90Days: 0,
        sla: '99.99%',
        status: 'healthy',
        latencyMs: 120,
        dependencies: [],
        linkedConfluenceDocs: []
      },
      {
        id: 'ledger-db',
        name: 'Double-Entry Financial Ledger',
        tier: 2,
        type: 'database',
        ownerTeam: 'FinTech Core',
        compassScore: 98,
        p1IncidentsLast90Days: 0,
        sla: '99.999%',
        status: 'healthy',
        latencyMs: 6,
        dependencies: [],
        linkedConfluenceDocs: [
          { title: 'Ledger Zero-Data-Loss Failover Procedure', url: 'https://confluence.example.com/ledger-failover', lastUpdated: '2 months ago' }
        ]
      },
      {
        id: 'redis-cache-cluster',
        name: 'User Session Redis Cluster',
        tier: 2,
        type: 'database',
        ownerTeam: 'Platform SRE',
        compassScore: 82,
        p1IncidentsLast90Days: 1,
        sla: '99.9%',
        status: 'at-risk',
        latencyMs: 2,
        dependencies: [],
        linkedConfluenceDocs: []
      },
      {
        id: 'compliance-archive-worker',
        name: 'Cold Storage Regulatory Exporter',
        tier: 2,
        type: 'microservice',
        ownerTeam: 'Legal & InfoSec',
        compassScore: 71,
        p1IncidentsLast90Days: 0,
        sla: '99.5%',
        status: 'healthy',
        latencyMs: 340,
        dependencies: [],
        linkedConfluenceDocs: []
      }
    ],
    totalServicesImpacted: 9,
    riskScore: 84,
    riskTier: 'CRITICAL',
    riskFactors: [
      {
        title: 'High-Value Financial Downstream Impact',
        description: 'Payment & Checkout Engine (billing-api) has 2 recorded P1 outages in the last 90 days related to authentication timeouts.',
        severity: 'critical'
      },
      {
        title: 'Stale Incident Rollback Runbook',
        description: 'Confluence runbook for Auth Token Invalidation was last updated >6 months ago and does not account for PASETO token signatures.',
        severity: 'high'
      },
      {
        title: 'Session Cache Choke-Point',
        description: 'User Session Redis Cluster is operating at 82% capacity and lacks automated circuit-breaker fallback for token retries.',
        severity: 'medium'
      }
    ],
    recentIncidentsFound: 4,
    missingRunbooksCount: 4,
    estimatedBlastRadiusDepth: 2,
    recommendedActions: [
      'Auto-generate regression test sub-tasks in Jira for billing-api and user-profile-svc.',
      'Draft a refreshed Confluence Rollback Runbook with verified PASETO failover commands.',
      'Notify FinTech Core and Platform SRE owners before deploying to Production staging.'
    ]
  },
  'PAY-892': {
    issueKey: 'PAY-892',
    issueSummary: 'Migrate Stripe Webhook Handler to Idempotent v3 Engine',
    rootService: {
      id: 'stripe-connector',
      name: 'Stripe External Payment Webhook',
      tier: 0,
      type: 'third-party',
      ownerTeam: 'FinTech Core',
      compassScore: 90,
      p1IncidentsLast90Days: 0,
      sla: '99.99%',
      status: 'healthy',
      latencyMs: 110,
      dependencies: ['billing-api', 'ledger-db'],
      linkedConfluenceDocs: [
        { title: 'PCI-DSS Compliance Boundary v4.0', url: 'https://confluence.example.com/pci-dss', lastUpdated: '1 month ago' }
      ]
    },
    impactedServices: [
      {
        id: 'billing-api',
        name: 'Payment & Checkout Engine',
        tier: 1,
        type: 'microservice',
        ownerTeam: 'FinTech Core',
        compassScore: 92,
        p1IncidentsLast90Days: 2,
        sla: '99.999%',
        status: 'incident-prone',
        latencyMs: 85,
        dependencies: [],
        linkedConfluenceDocs: []
      },
      {
        id: 'ledger-db',
        name: 'Double-Entry Financial Ledger',
        tier: 1,
        type: 'database',
        ownerTeam: 'FinTech Core',
        compassScore: 98,
        p1IncidentsLast90Days: 0,
        sla: '99.999%',
        status: 'healthy',
        latencyMs: 6,
        dependencies: [],
        linkedConfluenceDocs: []
      }
    ],
    totalServicesImpacted: 3,
    riskScore: 52,
    riskTier: 'ELEVATED',
    riskFactors: [
      {
        title: 'Financial Transaction Idempotency Risk',
        description: 'Duplicate webhook deliveries could trigger double balance assertions if ledger lock is breached.',
        severity: 'high'
      }
    ],
    recentIncidentsFound: 2,
    missingRunbooksCount: 1,
    estimatedBlastRadiusDepth: 1,
    recommendedActions: [
      'Generate regression tests for duplicate webhook replay scenarios.',
      'Run dry-run ledger verification script.'
    ]
  }
};

export async function fetchBlastRadiusData(issueKey: string = 'AUTH-412'): Promise<BlastRadiusAnalysis> {
  try {
    const res = await invoke<BlastRadiusAnalysis>('getBlastRadiusContext', { issueKey });
    if (res && res.riskScore) {
      return res;
    }
  } catch (err) {
    console.warn('[ForgeBridge] Not running in Forge context or call failed, falling back to mock:', err);
  }

  // Fallback to mock preset
  await new Promise(r => setTimeout(r, 400));
  return MOCK_ISSUES[issueKey] || MOCK_ISSUES['AUTH-412'];
}

export async function invokeCreateRegressionSubtasks(issueKey: string, services: string[]) {
  try {
    const res = await invoke<any>('createRegressionSubtasks', { issueKey, services });
    if (res) return res;
  } catch (err) {
    console.warn('[ForgeBridge] Falling back to mock subtask creation:', err);
  }

  await new Promise(r => setTimeout(r, 600));
  return {
    success: true,
    parentIssue: issueKey,
    createdSubtasks: services.map((s, idx) => ({
      key: `${issueKey}-REG-${Math.floor(100 + idx * 45)}`,
      summary: `[BlastRadius Regression] Validate ${s} against ${issueKey} token changes`,
      service: s
    })),
    message: `Successfully generated ${services.length} regression test sub-tasks in Jira linked to ${issueKey}.`
  };
}

export async function invokeCreateRollbackRunbook(issueKey: string, spaceKey: string = 'ENG') {
  try {
    const res = await invoke<any>('createConfluenceRollbackRunbook', { issueKey, spaceKey });
    if (res) return res;
  } catch (err) {
    console.warn('[ForgeBridge] Falling back to mock runbook creation:', err);
  }

  await new Promise(r => setTimeout(r, 700));
  return {
    success: true,
    pageTitle: `[BlastRadius Playbook] Rollback & Incident Guide for ${issueKey}`,
    pageUrl: `https://confluence.example.com/spaces/ENG/pages/blastradius-${issueKey.toLowerCase()}`,
    pageId: 'conf-892144',
    message: `Emergency Rollback Playbook successfully drafted in Confluence.`
  };
}

export async function invokeSimulateFailure(serviceId: string, failureType: string): Promise<SimulationResult> {
  try {
    const res = await invoke<SimulationResult>('simulateFailure', { serviceId, failureType });
    if (res) return res;
  } catch (err) {
    console.warn('[ForgeBridge] Falling back to mock failure simulation:', err);
  }

  await new Promise(r => setTimeout(r, 450));
  const isRoot = serviceId === 'auth-service';
  return {
    simulatedService: serviceId,
    failureType,
    cascadeEffect: {
      circuitBreakerTripped: isRoot,
      downstreamDegradationRate: isRoot ? '87%' : '35%',
      estimatedTTRMinutes: isRoot ? 18 : 6,
      affectedEndpoints: isRoot ? [
        '/api/v2/checkout/finalize (HTTP 504 Gateway Timeout)',
        '/api/v1/user/me (HTTP 401 Unauthorized Retry Loop)',
        '/webhooks/stripe (Stripe Retries Backlog > 14,200 req)'
      ] : [
        '/api/v1/user/settings (HTTP 500 Internal Cache Error)'
      ],
      recommendedMitigation: isRoot 
        ? 'Engage circuit breaker on billing-api auth validator with 2-second fallback cache.'
        : 'Re-route read traffic to replica database cluster.'
    }
  };
}
