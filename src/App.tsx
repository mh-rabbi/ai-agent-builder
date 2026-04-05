import { useState, useEffect, useRef, useCallback } from 'react'
import type { AgentData, SavedAgent, BuilderState, Toast } from './types'
import { PROFILE_META, DEFAULT_BUILDER_STATE } from './data'
import LeftSidebar from './components/LeftSidebar'
import BuilderCanvas from './components/BuilderCanvas'
import AgentPreview from './components/AgentPreview'
import MobileHeader from './components/MobileHeader'
import ToastNotification from './components/ToastNotification'
import { useWindowSize } from './hooks/useWindowSize'
import './index.css'

function App() {
  /* ── Data ── */
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(false)

  /* ── Agents list ── */
  const [agents, setAgents] = useState<SavedAgent[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined)

  /* ── Builder state ── */
  const [builderState, setBuilderState] = useState<BuilderState>(DEFAULT_BUILDER_STATE)

  /* ── Toast ── */
  const [toast, setToast] = useState<Toast | null>(null)

  /* ── Responsive State ── */
  const { width } = useWindowSize()
  const isDesktop = width >= 1024
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Auto-close drawers on escape or navigation might be nice, but simple toggle for now.
  // Ensure drawers are closed when switching to desktop to avoid weird states if they were open.
  useEffect(() => {
    if (isDesktop) {
      setIsLeftSidebarOpen(false)
      setIsPreviewOpen(false)
    }
  }, [isDesktop])

  // ── Notify helper ──
  const notify = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }, [])

  const dismissToast = useCallback(() => setToast(null), [])

  // ── Fetch config on mount (stale-closure-safe) ──
  const fetchAPI = useCallback(async () => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 800)) // slight delay for UX
      const res = await fetch('/data.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      // Enrich profiles with icon + gradient from PROFILE_META
      const enriched = {
        ...json,
        agentProfiles: json.agentProfiles.map((p: AgentData['agentProfiles'][0]) => ({
          ...p,
          ...(PROFILE_META[p.id] || { icon: '🤖', gradient: ['#7C3AED', '#4F46E5'] }),
        })),
      }
      setData(enriched)
    } catch (err) {
      notify('Failed to load configuration.', 'error')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => { fetchAPI() }, [fetchAPI])

  // ── Load persisted agents from localStorage ──
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedAgents')
      if (saved) {
        const parsed: SavedAgent[] = JSON.parse(saved).map((a: SavedAgent) => ({
          ...a, id: a.id ?? crypto.randomUUID(), createdAt: a.createdAt ?? Date.now(),
        }))
        setAgents(parsed)
      }
    } catch (e) { console.error('Failed to parse saved agents', e) }
  }, [])

  // ── Stale-closure-safe analytics ──
  const agentNameRef = useRef(builderState.agentName)
  useEffect(() => { agentNameRef.current = builderState.agentName }, [builderState.agentName])
  useEffect(() => {
    const id = setInterval(() => {
      console.log(agentNameRef.current
        ? `[Analytics] Working on: "${agentNameRef.current}"`
        : '[Analytics] Unnamed draft…')
    }, 8000)
    return () => clearInterval(id)
  }, [])

  // ── Persist agents to localStorage ──
  const persist = useCallback((updated: SavedAgent[]) => {
    try { localStorage.setItem('savedAgents', JSON.stringify(updated)) }
    catch (e) { console.error('localStorage write failed:', e) }
  }, [])

  // ── Builder state updaters ──
  const patchBuilder = useCallback((patch: Partial<BuilderState>) => {
    setBuilderState(prev => ({ ...prev, ...patch }))
  }, [])

  const handleProfileSelect = useCallback((id: string) => {
    const profile = data?.agentProfiles.find(p => p.id === id)
    setBuilderState(prev => ({
      ...prev,
      selectedProfile: id,
      currentStep: 2,
      agentName: prev.agentName || (profile ? `My ${profile.name}` : prev.agentName),
    }))
  }, [data])

  const handleProviderToggle = useCallback((id: string) => {
    setBuilderState(prev => ({
      ...prev,
      selectedProvider: prev.selectedProvider === id ? '' : id,
    }))
  }, [])

  const handleSkillAdd = useCallback((id: string) => {
    setBuilderState(prev => prev.selectedSkills.includes(id)
      ? prev : { ...prev, selectedSkills: [...prev.selectedSkills, id] })
  }, [])
  const handleSkillRemove = useCallback((id: string) => {
    setBuilderState(prev => ({ ...prev, selectedSkills: prev.selectedSkills.filter(s => s !== id) }))
  }, [])
  const handleSkillsReorder = useCallback((ids: string[]) => {
    setBuilderState(prev => ({ ...prev, selectedSkills: ids }))
  }, [])

  const handleLayerAdd = useCallback((id: string) => {
    setBuilderState(prev => prev.selectedLayers.includes(id)
      ? prev : { ...prev, selectedLayers: [...prev.selectedLayers, id] })
  }, [])
  const handleLayerRemove = useCallback((id: string) => {
    setBuilderState(prev => ({ ...prev, selectedLayers: prev.selectedLayers.filter(l => l !== id) }))
  }, [])
  const handleLayersReorder = useCallback((ids: string[]) => {
    setBuilderState(prev => ({ ...prev, selectedLayers: ids }))
  }, [])

  const handleAgentNameChange = useCallback((name: string) => {
    patchBuilder({ agentName: name })
  }, [patchBuilder])

  // ── Reset / Clear ──
  const handleReset = useCallback(() => {
    setBuilderState(prev => ({ ...prev, selectedSkills: [], selectedLayers: [], selectedProvider: '' }))
  }, [])

  const handleClearAll = useCallback(() => {
    setBuilderState(DEFAULT_BUILDER_STATE)
    setSelectedAgentId(null)
  }, [])

  // ── Save agent ──
  const handleSave = useCallback(() => {
    if (!builderState.selectedProfile || !builderState.agentName.trim()) {
      notify(
        !builderState.selectedProfile
          ? 'Please select a base profile first.'
          : 'Please enter a name for your agent.',
        'error'
      )
      return
    }
    const existing = selectedAgentId ? agents.find(a => a.id === selectedAgentId) : null

    const newAgent: SavedAgent = {
      id: existing?.id ?? crypto.randomUUID(),
      createdAt: existing?.createdAt ?? Date.now(),
      name: builderState.agentName.trim(),
      profileId: builderState.selectedProfile,
      skillIds: builderState.selectedSkills,
      layerIds: builderState.selectedLayers,
      provider: builderState.selectedProvider || undefined,
    }
    const updated = existing
      ? agents.map(a => a.id === existing.id ? newAgent : a)
      : [...agents, newAgent]
    setAgents(updated)
    persist(updated)
    setSelectedAgentId(newAgent.id)
    setLastSaved(new Date())
    patchBuilder({ currentStep: 3 })
    notify(`Agent "${newAgent.name}" saved!`, 'success')
  }, [builderState, agents, selectedAgentId, persist, patchBuilder, notify])

  // ── New agent ──
  const handleNewAgent = useCallback(() => {
    setBuilderState(DEFAULT_BUILDER_STATE)
    setSelectedAgentId(null)
    setLastSaved(undefined)
  }, [])

  // ── Select agent from sidebar ──
  const handleSelectAgent = useCallback((agent: SavedAgent) => {
    setSelectedAgentId(agent.id)
    setBuilderState({
      currentStep: 2,
      selectedProfile: agent.profileId,
      selectedProvider: agent.provider ?? '',
      selectedSkills: agent.skillIds,
      selectedLayers: agent.layerIds,
      agentName: agent.name,
    })
  }, [])

  // ── Delete agent ──
  const handleDeleteAgent = useCallback((id: string) => {
    const agent = agents.find(a => a.id === id)
    const updated = agents.filter(a => a.id !== id)
    setAgents(updated)
    persist(updated)
    if (selectedAgentId === id) {
      setSelectedAgentId(null)
      setBuilderState(DEFAULT_BUILDER_STATE)
      setLastSaved(undefined)
    }
    if (agent) notify(`Agent "${agent.name}" deleted.`, 'success')
  }, [agents, selectedAgentId, persist, notify])

  // ── Delete all agents ──
  const handleDeleteAllAgents = useCallback(() => {
    setAgents([])
    localStorage.removeItem('savedAgents')
    setSelectedAgentId(null)
    setBuilderState(DEFAULT_BUILDER_STATE)
    setLastSaved(undefined)
    notify('All agents deleted.', 'success')
  }, [notify])

  const toggleLeftSidebar = useCallback(() => setIsLeftSidebarOpen(prev => !prev), [])
  const togglePreview = useCallback(() => setIsPreviewOpen(prev => !prev), [])
  const closeAllDrawers = useCallback(() => {
    setIsLeftSidebarOpen(false)
    setIsPreviewOpen(false)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'var(--bg-base)',
      position: 'relative'
    }}>
      {!isDesktop && (
        <MobileHeader
          onToggleLeft={toggleLeftSidebar}
          onToggleRight={togglePreview}
          isLeftOpen={isLeftSidebarOpen}
          isPreviewOpen={isPreviewOpen}
        />
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Left Sidebar (Fixed or Drawer) */}
        {(isDesktop || isLeftSidebarOpen) && (
          <div
            className={!isDesktop ? 'drawer drawer-left glass-drawer' : ''}
            style={!isDesktop ? {} : { flexShrink: 0 }}
          >
            <LeftSidebar
              agents={agents}
              data={data}
              selectedAgentId={selectedAgentId}
              builderState={builderState}
              onNewAgent={() => { handleNewAgent(); if (!isDesktop) setIsLeftSidebarOpen(false); }}
              onSelectAgent={(agent) => { handleSelectAgent(agent); if (!isDesktop) setIsLeftSidebarOpen(false); }}
              onDeleteAgent={handleDeleteAgent}
              onDeleteAllAgents={handleDeleteAllAgents}
              onClose={!isDesktop ? () => setIsLeftSidebarOpen(false) : undefined}
            />
          </div>
        )}

        <BuilderCanvas
          data={data}
          loading={loading}
          builderState={builderState}
          onProfileSelect={handleProfileSelect}
          onProviderToggle={handleProviderToggle}
          onSkillAdd={handleSkillAdd}
          onSkillRemove={handleSkillRemove}
          onSkillsReorder={handleSkillsReorder}
          onLayerAdd={handleLayerAdd}
          onLayerRemove={handleLayerRemove}
          onLayersReorder={handleLayersReorder}
          onReset={handleReset}
          onClearAll={handleClearAll}
        />

        {/* Agent Preview (Fixed or Drawer) */}
        {(isDesktop || isPreviewOpen) && (
          <div
            className={!isDesktop ? 'drawer drawer-right glass-drawer-right' : ''}
            style={!isDesktop ? {} : { flexShrink: 0 }}
          >
            <AgentPreview
              data={data}
              builderState={builderState}
              lastSaved={lastSaved}
              onSave={handleSave}
              onAgentNameChange={handleAgentNameChange}
              onClose={!isDesktop ? () => setIsPreviewOpen(false) : undefined}
            />
          </div>
        )}

        {/* Overlay for drawers */}
        {!isDesktop && (isLeftSidebarOpen || isPreviewOpen) && (
          <div className="drawer-overlay" onClick={closeAllDrawers} />
        )}
      </div>

      <ToastNotification toast={toast} onClose={dismissToast} />
    </div>
  )
}

export default App
