export type PillarCategory = 'all' | 'root' | 'pillar-1' | 'pillar-2' | 'pillar-3' | 'pillar-4' | 'pillar-5';

export interface NodeMetric {
  label: string;
  value: string;
  subtext?: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

export interface MindMapNode {
  id: string;
  title: string;
  subtitle?: string;
  category: PillarCategory;
  color: string;
  icon?: string;
  details: string;
  extendedAnalysis?: string;
  metrics?: NodeMetric[];
  citations?: string[];
  actionRecommendation?: string;
  children?: MindMapNode[];
}

export interface ProcessedNode {
  data: MindMapNode;
  depth: number;
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  parent: ProcessedNode | null;
  mesh?: any;
}

export interface RegionalModel {
  id: string;
  program: string;
  city: string;
  state: string;
  yearsActive: string;
  mechanism: string;
  leadAgency: string;
  healthImpact: string;
  judicialImpact: string;
  operatingCost: string;
  roi: string;
  annualNetSavings: string;
  keyMetric: string;
  sourceDoc: string;
  relatedNodeId?: string;
}

export type ViewMode = '3d' | 'tree' | 'matrix' | 'simulator';
