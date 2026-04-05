import { useState, useCallback } from 'react';
import type { BuilderState, AgentData, SavedAgent } from '../types';
import { DEFAULT_BUILDER_STATE } from '../data';

export function useBuilder(data: AgentData | null) {
  const [builderState, setBuilderState] = useState<BuilderState>(DEFAULT_BUILDER_STATE);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);

  const selectProfile = useCallback((id: string) => {
    const profile = data?.agentProfiles.find(p => p.id === id);
    setBuilderState(prev => ({
      ...prev,
      selectedProfile: id,
      currentStep: 2,
      agentName: prev.agentName || (profile ? `My ${profile.name}` : prev.agentName),
    }));
  }, [data]);

  const toggleProvider = useCallback((id: string) => {
    setBuilderState(prev => ({
      ...prev,
      selectedProvider: prev.selectedProvider === id ? '' : id,
    }));
  }, []);

  const addSkill = useCallback((id: string) => {
    setBuilderState(prev => prev.selectedSkills.includes(id) 
      ? prev : { ...prev, selectedSkills: [...prev.selectedSkills, id] });
  }, []);

  const removeSkill = useCallback((id: string) => {
    setBuilderState(prev => ({ ...prev, selectedSkills: prev.selectedSkills.filter(s => s !== id) }));
  }, []);

  const reorderSkills = useCallback((ids: string[]) => {
    setBuilderState(prev => ({ ...prev, selectedSkills: ids }));
  }, []);

  const addLayer = useCallback((id: string) => {
    setBuilderState(prev => prev.selectedLayers.includes(id) 
      ? prev : { ...prev, selectedLayers: [...prev.selectedLayers, id] });
  }, []);

  const removeLayer = useCallback((id: string) => {
    setBuilderState(prev => ({ ...prev, selectedLayers: prev.selectedLayers.filter(l => l !== id) }));
  }, []);

  const reorderLayers = useCallback((ids: string[]) => {
    setBuilderState(prev => ({ ...prev, selectedLayers: ids }));
  }, []);

  const setAgentName = useCallback((name: string) => {
    setBuilderState(prev => ({ ...prev, agentName: name }));
  }, []);

  const resetConfig = useCallback(() => {
    setBuilderState(prev => ({ ...prev, selectedSkills: [], selectedLayers: [], selectedProvider: '' }));
  }, []);

  const clearAll = useCallback(() => {
    setBuilderState(DEFAULT_BUILDER_STATE);
    setSelectedAgentId(null);
  }, []);

  const loadAgent = useCallback((agent: SavedAgent) => {
    setSelectedAgentId(agent.id);
    setBuilderState({
      currentStep: 2,
      selectedProfile: agent.profileId,
      selectedProvider: agent.provider ?? '',
      selectedSkills: agent.skillIds,
      selectedLayers: agent.layerIds,
      agentName: agent.name,
    });
  }, []);

  const setSaved = useCallback((id: string) => {
    setSelectedAgentId(id);
    setLastSaved(new Date());
    setBuilderState(prev => ({ ...prev, currentStep: 3 }));
  }, []);

  return {
    builderState,
    selectedAgentId,
    lastSaved,
    selectProfile,
    toggleProvider,
    addSkill,
    removeSkill,
    reorderSkills,
    addLayer,
    removeLayer,
    reorderLayers,
    setAgentName,
    resetConfig,
    clearAll,
    loadAgent,
    setSaved,
  };
}
