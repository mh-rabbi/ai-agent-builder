// ── Domain types — aligned with ANTIGRAVITY_MASTER_PROMPT spec ──

export type SkillCategory = 'information' | 'action';
export type LayerType = 'reasoning' | 'personality' | 'formatting' | 'context';
export type Provider = string;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  description: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  description: string;
  icon: string;           // emoji
  gradient: [string, string];
}

export interface ProviderInfo {
  id: Provider;
  name: string;
  color: string;
}

export interface AgentData {
  agentProfiles: AgentProfile[];
  skills: Skill[];
  layers: Layer[];
}

// Persisted agent entity
export interface SavedAgent {
  id: string;
  createdAt: number;
  name: string;
  profileId: string;
  skillIds: string[];
  layerIds: string[];
  provider?: string;
}

// Builder workflow state
export interface BuilderState {
  currentStep: 1 | 2 | 3;
  selectedProfile: string;
  selectedProvider: string;
  selectedSkills: string[];
  selectedLayers: string[];
  agentName: string;
}

// Toast
export interface Toast {
  type: 'success' | 'error';
  message: string;
}
