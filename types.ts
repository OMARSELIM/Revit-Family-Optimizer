export interface OptimizationResult {
  isOverModeled: boolean;
  complexityScore: number; // 0-100
  polygonEstimate: string; // e.g., "High (approx 5000+)"
  unusedParams: string[];
  suggestions: Suggestion[];
  lodRecommendations: string;
  symbolicCandidates: string[];
  overallAnalysis: string;
}

export interface Suggestion {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  type: 'Deletion' | 'Symbolic' | 'Simplification' | 'Parameter';
}

export enum FamilyCategory {
  Furniture = 'Furniture',
  Lighting = 'Lighting Fixtures',
  Plumbing = 'Plumbing Fixtures',
  Specialty = 'Specialty Equipment',
  Door = 'Doors',
  Window = 'Windows',
  Generic = 'Generic Models',
  Mechanical = 'Mechanical Equipment'
}

export interface AnalysisInput {
  category: FamilyCategory;
  fileSizeMB: number;
  image: string | null; // Base64
  additionalContext: string;
}
