import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { AgentData, SavedAgent, Skill, Layer, Notification } from './types'
import SessionTimer from './components/SessionTimer'
import ConfigPanel from './components/ConfigPanel'
import AgentCanvas from './components/AgentCanvas'
import SavedAgentCard from './components/SavedAgentCard'
import './App.css'

function App() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedProfile, setSelectedProfile] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [selectedProvider, setSelectedProvider] = useState('')
  const [agentName, setAgentName] = useState('')
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([])
  const [notification, setNotification] = useState<Notification | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Load persisted agents on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedAgents')
    if (saved) {
      try {
        const parsed: SavedAgent[] = JSON.parse(saved).map((a: SavedAgent) => ({
          ...a, id: a.id ?? crypto.randomUUID(), createdAt: a.createdAt ?? Date.now(),
        }))
        setSavedAgents(parsed)
      } catch (e) { console.error('Failed to parse saved agents', e) }
    }
  }, [])

  // FIX-3: stale-closure-safe analytics
  const agentNameRef = useRef(agentName)
  useEffect(() => { agentNameRef.current = agentName }, [agentName])
  useEffect(() => {
    const id = setInterval(() => {
      console.log(agentNameRef.current
        ? `[Analytics] Working on: "${agentNameRef.current}"`
        : '[Analytics] Unnamed draft…')
    }, 8000)
    return () => clearInterval(id)
  }, [])

  // FIX-6+PERF-4: stable fetchAPI
  const fetchAPI = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      await new Promise(r => setTimeout(r, Math.floor(Math.random() * 2000) + 1000))
      const res = await fetch('/data.json')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch')
    } finally { setLoading(false) }
  }, [])
  useEffect(() => { fetchAPI() }, [fetchAPI])

  // FIX-10: notify helper
  const notify = useCallback((message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // Handlers
  const handleProfileChange = useCallback((id: string) => setSelectedProfile(id), [])
  const handleProviderChange = useCallback((p: string) => setSelectedProvider(p), [])

  // FIX-13: new per-action skill/layer handlers (replaces select event handlers)
  const handleSkillAdd = useCallback((id: string) => setSelectedSkills(p => [...p, id]), [])
  const handleSkillRemove = useCallback((id: string) => setSelectedSkills(p => p.filter(s => s !== id)), [])
  const handleSkillsReorder = useCallback((ids: string[]) => setSelectedSkills(ids), [])
  const handleLayerAdd = useCallback((id: string) => setSelectedLayers(p => [...p, id]), [])
  const handleLayerRemove = useCallback((id: string) => setSelectedLayers(p => p.filter(l => l !== id)), [])
  const handleLayersReorder = useCallback((ids: string[]) => setSelectedLayers(ids), [])

  const persist = useCallback((agents: SavedAgent[]) => {
    try { localStorage.setItem('savedAgents', JSON.stringify(agents)) }
    catch (e) { console.error('localStorage write failed:', e) }
  }, [])

  const handleSaveAgent = useCallback(() => {
    if (!agentName.trim()) { notify('Please enter a name for your agent.', 'error'); return }
    const newAgent: SavedAgent = {
      id: crypto.randomUUID(), createdAt: Date.now(), name: agentName,
      profileId: selectedProfile, skillIds: selectedSkills,
      layerIds: selectedLayers, provider: selectedProvider,
    }
    const updated = [...savedAgents, newAgent]
    setSavedAgents(updated); persist(updated); setAgentName('')
    notify(`Agent "${newAgent.name}" saved!`, 'success')
  }, [agentName, selectedProfile, selectedSkills, selectedLayers, selectedProvider, savedAgents, notify, persist])

  const handleLoadAgent = useCallback((agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || '')
    setSelectedSkills(agent.skillIds || [])
    setSelectedLayers([...(agent.layerIds || [])])
    setAgentName(agent.name)
    setSelectedProvider(agent.provider || '')
  }, [])

  const handleDeleteAgent = useCallback((id: string) => {
    const updated = savedAgents.filter(a => a.id !== id)
    setSavedAgents(updated); persist(updated)
  }, [savedAgents, persist])

  const handleClearAll = useCallback(() => setShowClearConfirm(true), [])
  const handleConfirmClear = useCallback(() => {
    setSavedAgents([]); localStorage.removeItem('savedAgents'); setShowClearConfirm(false)
  }, [])
  const handleCancelClear = useCallback(() => setShowClearConfirm(false), [])

  // FIX-5: memoized derived data
  const selectedProfileData = useMemo(
    () => data?.agentProfiles.find(p => p.id === selectedProfile) ?? null, [data, selectedProfile])
  const selectedSkillsData = useMemo(
    () => selectedSkills.map(id => data?.skills.find(s => s.id === id)).filter(Boolean) as Skill[],
    [data, selectedSkills])
  const selectedLayersData = useMemo(
    () => selectedLayers.map(id => data?.layers.find(l => l.id === id)).filter(Boolean) as Layer[],
    [data, selectedLayers])

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-brand">
          <h1>AI Agent Builder</h1>
          <p>Design your custom AI personality and capability set.</p>
        </div>
        <div className="header-controls">
          <button className="btn btn-ghost" onClick={fetchAPI} disabled={loading}>
            {loading ? '⏳ Loading…' : '↺ Reload Config'}
          </button>
          <div className="session-badge">
            <span className="session-dot" />
            <SessionTimer />
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Two-column builder */}
        <div className="builder-grid">
          <ConfigPanel
            data={data} loading={loading} error={error}
            selectedProfile={selectedProfile} selectedSkills={selectedSkills}
            selectedLayers={selectedLayers} selectedProvider={selectedProvider}
            onProfileChange={handleProfileChange}
            onSkillAdd={handleSkillAdd} onSkillRemove={handleSkillRemove} onSkillsReorder={handleSkillsReorder}
            onLayerAdd={handleLayerAdd} onLayerRemove={handleLayerRemove} onLayersReorder={handleLayersReorder}
            onProviderChange={handleProviderChange}
          />
          <AgentCanvas
            selectedProfileData={selectedProfileData}
            selectedSkillsData={selectedSkillsData}
            selectedLayersData={selectedLayersData}
            selectedProvider={selectedProvider}
            agentName={agentName} onAgentNameChange={setAgentName}
            onSave={handleSaveAgent} notification={notification}
          />
        </div>

        {/* Saved agents */}
        {savedAgents.length > 0 && (
          <section className="saved-section">
            <div className="saved-header">
              <h2>Saved Agents</h2>
              {showClearConfirm ? (
                <div className="clear-confirm-inline">
                  <span>Clear all?</span>
                  <button className="btn btn-danger btn-sm" onClick={handleConfirmClear}>Confirm</button>
                  <button className="btn btn-ghost btn-sm" onClick={handleCancelClear}>Cancel</button>
                </div>
              ) : (
                <button className="btn btn-danger" onClick={handleClearAll}>Clear All</button>
              )}
            </div>
            <div className="saved-grid">
              {savedAgents.map(agent => (
                <SavedAgentCard key={agent.id} agent={agent} data={data}
                  onLoad={handleLoadAgent} onDelete={handleDeleteAgent} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
