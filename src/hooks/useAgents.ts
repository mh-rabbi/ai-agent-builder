import { useState, useEffect, useCallback } from 'react';
import type { SavedAgent } from '../types';

export function useAgents() {
  const [agents, setAgents] = useState<SavedAgent[]>([]);

  // Init from persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedAgents');
      if (saved) {
        const parsed: SavedAgent[] = JSON.parse(saved).map((a: SavedAgent) => ({
          ...a, 
          id: a.id ?? crypto.randomUUID(), 
          createdAt: a.createdAt ?? Date.now(),
        }));
        setAgents(parsed);
      }
    } catch (e) { console.error('Failed to parse saved agents', e); }
  }, []);

  const persist = useCallback((updated: SavedAgent[]) => {
    try { localStorage.setItem('savedAgents', JSON.stringify(updated)); }
    catch (e) { console.error('localStorage write failed:', e); }
  }, []);

  const saveAgent = useCallback((agent: SavedAgent) => {
    setAgents(prev => {
      const existing = prev.find(a => a.id === agent.id);
      const updated = existing ? prev.map(a => a.id === agent.id ? agent : a) : [...prev, agent];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteAgent = useCallback((id: string) => {
    setAgents(prev => {
      const updated = prev.filter(a => a.id !== id);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteAllAgents = useCallback(() => {
    setAgents([]);
    localStorage.removeItem('savedAgents');
  }, []);

  return { agents, saveAgent, deleteAgent, deleteAllAgents };
}
