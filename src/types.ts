// Shared domain types — imported by App.tsx and all child components.

export interface AgentProfile {
  id: string
  name: string
  description: string
}

export interface Skill {
  id: string
  name: string
  category: string
  description: string
}

export interface Layer {
  id: string
  name: string
  type: string
  description: string
}

export interface AgentData {
  agentProfiles: AgentProfile[]
  skills: Skill[]
  layers: Layer[]
}

// FIX-9: added `id` (stable React key) and `createdAt` (for future relative timestamps).
export interface SavedAgent {
  id: string
  createdAt: number
  name: string
  profileId: string
  skillIds: string[]
  layerIds: string[]
  provider?: string
}

// Used by AgentCanvas for inline notification (wired up in FIX-10 / Phase 4).
export interface Notification {
  message: string
  type: 'success' | 'error'
}
