import type { ProviderInfo } from './types';

// Profile enrichment — adds icon + gradient to the raw data.json profiles
export const PROFILE_META: Record<string, { icon: string; gradient: [string, string] }> = {
  profile_1:  { icon: '🎧', gradient: ['#7C3AED', '#4F46E5'] }, // Customer Support - violet/indigo
  profile_2:  { icon: '💻', gradient: ['#0EA5E9', '#6366F1'] }, // Code Assistant - sky/indigo
  profile_3:  { icon: '📊', gradient: ['#0891B2', '#0284C7'] }, // Data Analyst - cyan/blue
  profile_4:  { icon: '✍️', gradient: ['#EC4899', '#F43F5E'] }, // Creative Writer - pink/rose
  profile_5:  { icon: '💼', gradient: ['#F59E0B', '#F97316'] }, // Sales Representative - amber/orange
  profile_6:  { icon: '📈', gradient: ['#10B981', '#0D9488'] }, // Financial Advisor - emerald/teal
  profile_7:  { icon: '👥', gradient: ['#8B5CF6', '#EC4899'] }, // HR Assistant - violet/pink
  profile_8:  { icon: '⚙️', gradient: ['#64748B', '#334155'] }, // DevOps Engineer - slate
  profile_9:  { icon: '⚖️', gradient: ['#EAB308', '#CA8A04'] }, // Legal Consultant - yellow
  profile_10: { icon: '🎨', gradient: ['#E11D48', '#9333EA'] }, // UI/UX Designer - rose/purple
};

// Provider registry
export const PROVIDER_INFO: ProviderInfo[] = [
  { id: 'Claude',   name: 'Claude',   color: '#CC785C' },
  { id: 'ChatGPT',  name: 'ChatGPT',  color: '#10B981' },
  { id: 'Gemini',   name: 'Gemini',   color: '#4285F4' },
  { id: 'DeepSeek', name: 'DeepSeek', color: '#7C3AED' },
  { id: 'Kimi',     name: 'Kimi',     color: '#FF6B35' },
];

// Colour maps used across many components
export const CATEGORY_COLORS: Record<string, string> = {
  information: '#3B82F6',
  action:      '#10B981',
};

export const LAYER_TYPE_COLORS: Record<string, string> = {
  reasoning:   '#7C3AED',
  personality: '#EC4899',
  formatting:  '#F59E0B',
  context:     '#06B6D4',
};

// Default builder state
export const DEFAULT_BUILDER_STATE = {
  currentStep: 1 as const,
  selectedProfile: '',
  selectedProvider: '',
  selectedSkills: [] as string[],
  selectedLayers: [] as string[],
  agentName: '',
};
