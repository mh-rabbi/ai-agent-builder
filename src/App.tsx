import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { AgentData, SavedAgent, Skill, Layer } from './types'
import SessionTimer from './components/SessionTimer'
import ConfigPanel from './components/ConfigPanel'
import AgentCanvas from './components/AgentCanvas'
import SavedAgentCard from './components/SavedAgentCard'

/**
 * App — state owner and layout shell.
 *
 * After Phase 3 refactor (FIX-8) this component is responsible for:
 *  - All state (data, selections, savedAgents, agentName, provider)
 *  - All event handlers (stable via useCallback)
 *  - Memoized derived data (useMemo)
 *  - Rendering the layout + delegating UI to focused child components
 *
 * It no longer contains any UI logic itself.
 */
function App() {
  // ─── Remote data ─────────────────────────────────────────────────────────────
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ─── Selection state ─────────────────────────────────────────────────────────
  const [selectedProfile, setSelectedProfile] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  // ─── Agent persistence ───────────────────────────────────────────────────────
  const [agentName, setAgentName] = useState('')
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([])

  // ─── Lifecycle: load persisted agents on mount ───────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('savedAgents')
    if (saved) {
      try {
        // Migration: agents saved before FIX-9 lack `id`/`createdAt` — patch them on load.
        const parsed: SavedAgent[] = JSON.parse(saved).map((a: SavedAgent) => ({
          ...a,
          id: a.id ?? crypto.randomUUID(),         // FIX-9 migration: ensure stable id
          createdAt: a.createdAt ?? Date.now(),    // FIX-9 migration: ensure createdAt exists
        }))
        setSavedAgents(parsed)
      } catch (e) {
        console.error('Failed to parse saved agents', e)
      }
    }
  }, [])

  // ─── FIX-3: stale-closure-safe analytics interval ───────────────────────────
  const agentNameRef = useRef(agentName)
  useEffect(() => {
    agentNameRef.current = agentName
  }, [agentName])

  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      if (agentNameRef.current !== '') {
        console.log(`[Analytics Heartbeat] User is working on agent named: "${agentNameRef.current}"`)
      } else {
        console.log(`[Analytics Heartbeat] User is working on an unnamed agent draft…`)
      }
    }, 8000)
    return () => clearInterval(analyticsInterval)
  }, [])

  // ─── FIX-6 + PERF-4: stable fetchAPI reference ───────────────────────────────
  const fetchAPI = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const delay = Math.floor(Math.random() * 2000) + 1000
      await new Promise((resolve) => setTimeout(resolve, delay))

      const response = await fetch('/data.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jsonData: AgentData = await response.json()
      setData(jsonData)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch agent data'
      console.error('Error fetching data:', err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data on initial component mount only.
  useEffect(() => {
    fetchAPI()
  }, [fetchAPI])

  // ─── Event handlers (all useCallback for stable references) ─────────────────

  const handleProfileChange = useCallback((profileId: string) => {
    setSelectedProfile(profileId)
  }, [])

  const handleProviderChange = useCallback((provider: string) => {
    setSelectedProvider(provider)
  }, [])

  // FIX-2 applied earlier: spreads into new array (no mutation).
  const handleLayerSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const layerId = e.target.value
    if (layerId && !selectedLayers.includes(layerId)) {
      setSelectedLayers((prev) => [...prev, layerId])
    }
    e.target.value = ''
  }, [selectedLayers])

  const handleSkillSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const skillId = e.target.value
    if (skillId && !selectedSkills.includes(skillId)) {
      setSelectedSkills((prev) => [...prev, skillId])
    }
    e.target.value = ''
  }, [selectedSkills])

  const handleRemoveSkill = useCallback((id: string) => {
    setSelectedSkills((prev) => prev.filter((sid) => sid !== id))
  }, [])

  const handleRemoveLayer = useCallback((id: string) => {
    setSelectedLayers((prev) => prev.filter((lid) => lid !== id))
  }, [])

  // FIX-9: generates stable `id` + `createdAt` on each new agent.
  const handleSaveAgent = useCallback(() => {
    if (!agentName.trim()) {
      alert('Please enter a name for your agent.')
      return
    }

    const newAgent: SavedAgent = {
      id: crypto.randomUUID(),   // FIX-9: stable, unique key
      createdAt: Date.now(),     // FIX-9: for relative timestamps in Phase 5
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    }

    const updatedAgents = [...savedAgents, newAgent]
    setSavedAgents(updatedAgents)
    // FIX-7: guard against storage-full / private-browsing throws.
    try {
      localStorage.setItem('savedAgents', JSON.stringify(updatedAgents))
    } catch (e) {
      console.error('Failed to persist savedAgents:', e)
    }
    setAgentName('')
    alert(`Agent "${newAgent.name}" saved successfully!`)
  }, [agentName, selectedProfile, selectedSkills, selectedLayers, selectedProvider, savedAgents])

  const handleLoadAgent = useCallback((agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || '')
    setSelectedSkills(agent.skillIds || [])
    setSelectedLayers([...(agent.layerIds || [])])
    setAgentName(agent.name)
    setSelectedProvider(agent.provider || '')
  }, [])

  // FIX-9: deletes by stable id, not array index.
  const handleDeleteAgent = useCallback((id: string) => {
    const updatedAgents = savedAgents.filter((a) => a.id !== id)
    setSavedAgents(updatedAgents)
    try {
      localStorage.setItem('savedAgents', JSON.stringify(updatedAgents))
    } catch (e) {
      console.error('Failed to persist savedAgents:', e)
    }
  }, [savedAgents])

  // LOGIC-5: confirm() will be replaced with inline UI in FIX-10 (Phase 4).
  const handleClearAll = useCallback(() => {
    if (confirm('Are you sure you want to clear all saved agents?')) {
      setSavedAgents([])
      localStorage.removeItem('savedAgents')
    }
  }, [])

  // ─── FIX-5: memoized derived data ────────────────────────────────────────────
  const selectedProfileData = useMemo(
    () => data?.agentProfiles.find((p) => p.id === selectedProfile) ?? null,
    [data, selectedProfile]
  )

  const selectedSkillsData = useMemo(
    () =>
      selectedSkills
        .map((id) => data?.skills.find((s) => s.id === id))
        .filter(Boolean) as Skill[],
    [data, selectedSkills]
  )

  const selectedLayersData = useMemo(
    () =>
      selectedLayers
        .map((id) => data?.layers.find((l) => l.id === id))
        .filter(Boolean) as Layer[],
    [data, selectedLayers]
  )

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '1rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>AI Agent Builder</h1>
        <p>Design your custom AI personality and capability set.</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={fetchAPI} disabled={loading}>
            {loading ? 'Fetching Configuration…' : 'Reload Configuration Data'}
          </button>
          {/* FIX-4: isolated — its 1 s tick no longer re-renders App */}
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            <SessionTimer />
          </span>
        </div>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'row' }}>
          {/* FIX-8: Left pane */}
          <ConfigPanel
            data={data}
            loading={loading}
            error={error}
            selectedProfile={selectedProfile}
            selectedSkills={selectedSkills}
            selectedLayers={selectedLayers}
            selectedProvider={selectedProvider}
            onProfileChange={handleProfileChange}
            onSkillSelect={handleSkillSelect}
            onLayerSelect={handleLayerSelect}
            onProviderChange={handleProviderChange}
          />

          {/* FIX-8: Right pane */}
          <AgentCanvas
            selectedProfileData={selectedProfileData}
            selectedSkillsData={selectedSkillsData}
            selectedLayersData={selectedLayersData}
            selectedProvider={selectedProvider}
            agentName={agentName}
            onAgentNameChange={setAgentName}
            onSave={handleSaveAgent}
            onRemoveSkill={handleRemoveSkill}
            onRemoveLayer={handleRemoveLayer}
          />
        </div>

        {/* Saved agents — FIX-9: keyed by agent.id, FIX-8: saved-agent card component  */}
        {savedAgents.length > 0 && (
          <section style={{ padding: '1.5rem', background: '#e0f7fa', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Saved Agents</h2>
              {/* LOGIC-5: confirm() replaced with inline UI in Phase 4 (FIX-10) */}
              <button
                onClick={handleClearAll}
                style={{ padding: '0.5rem 1rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear All
              </button>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {savedAgents.map((agent) => (
                <SavedAgentCard
                  key={agent.id}
                  agent={agent}
                  data={data}
                  onLoad={handleLoadAgent}
                  onDelete={handleDeleteAgent}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
