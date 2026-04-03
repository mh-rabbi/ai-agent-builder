import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import SessionTimer from './components/SessionTimer'

// Define the types based on data.json
interface AgentProfile {
  id: string
  name: string
  description: string
}

interface Skill {
  id: string
  name: string
  category: string
  description: string
}

interface Layer {
  id: string
  name: string
  type: string
  description: string
}

interface AgentData {
  agentProfiles: AgentProfile[]
  skills: Skill[]
  layers: Layer[]
}

interface SavedAgent {
  name: string
  profileId: string
  skillIds: string[]
  layerIds: string[]
  provider?: string
}

function App() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Selection states
  const [selectedProfile, setSelectedProfile] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])

  // Saving states
  const [agentName, setAgentName] = useState('')
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>('')

  // FIX-6: useCallback so handleDeleteAgent is stable across renders
  const handleDeleteAgent = useCallback((indexToRemove: number) => {
    const updatedAgents = savedAgents.filter((_, index) => index !== indexToRemove)
    setSavedAgents(updatedAgents)
    // FIX-7: guard localStorage.setItem against private-mode / storage-full throws
    try {
      localStorage.setItem('savedAgents', JSON.stringify(updatedAgents))
    } catch (e) {
      console.error('Failed to persist savedAgents:', e)
    }
  }, [savedAgents])

  // FIX-4: sessionTime state + interval moved into <SessionTimer /> — removed here

  useEffect(() => {
    // Load saved agents from local storage on component mount
    const saved = localStorage.getItem('savedAgents')
    if (saved) {
      try {
        setSavedAgents(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved agents', e)
      }
    }
  }, [])

  // FIX-3: useRef tracks latest agentName so the interval never captures a stale closure
  const agentNameRef = useRef(agentName)
  useEffect(() => {
    agentNameRef.current = agentName
  }, [agentName])

  useEffect(() => {
    const analyticsInterval = setInterval(() => {
      if (agentNameRef.current !== '') {
        console.log(`[Analytics Heartbeat] User is working on agent named: "${agentNameRef.current}"`)
      } else {
        console.log(`[Analytics Heartbeat] User is working on an unnamed agent draft...`)
      }
    }, 8000)

    return () => clearInterval(analyticsInterval)
  }, [])

  // FIX-6 + PERF-4: useCallback makes fetchAPI a stable reference
  const fetchAPI = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate network delay and randomness (1 to 3 seconds)
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

  // Fetch data on initial component mount
  useEffect(() => {
    fetchAPI()
  }, [fetchAPI])

  // FIX-6: stable handlers via useCallback
  const handleLayerSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const layerId = e.target.value;
    if (layerId && !selectedLayers.includes(layerId)) {
      setSelectedLayers(prev => [...prev, layerId])
    }
    e.target.value = "";
  }, [selectedLayers])

  const handleSkillSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const skillId = e.target.value;
    if (skillId && !selectedSkills.includes(skillId)) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
    e.target.value = "";
  }, [selectedSkills])

  const handleSaveAgent = useCallback(() => {
    if (!agentName.trim()) {
      alert('Please enter a name for your agent.')
      return
    }

    const newAgent: SavedAgent = {
      name: agentName,
      profileId: selectedProfile,
      skillIds: selectedSkills,
      layerIds: selectedLayers,
      provider: selectedProvider,
    }

    const updatedAgents = [...savedAgents, newAgent]
    setSavedAgents(updatedAgents)
    // FIX-7: guard localStorage.setItem
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

  // FIX-5: memoized derived data — avoids repeated .find() calls on every render
  const selectedProfileData = useMemo(
    () => data?.agentProfiles.find(p => p.id === selectedProfile) ?? null,
    [data, selectedProfile]
  )

  const selectedSkillsData = useMemo(
    () => selectedSkills.map(id => data?.skills.find(s => s.id === id)).filter(Boolean) as Skill[],
    [data, selectedSkills]
  )

  const selectedLayersData = useMemo(
    () => selectedLayers.map(id => data?.layers.find(l => l.id === id)).filter(Boolean) as Layer[],
    [data, selectedLayers]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '1rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>AI Agent Builder</h1>
        <p>Design your custom AI personality and capability set.</p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={fetchAPI} disabled={loading}>
            {loading ? 'Fetching Configuration...' : 'Reload Configuration Data'}
          </button>
          {/* FIX-4: <SessionTimer> is isolated — its 1s tick no longer re-renders App */}
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            <SessionTimer />
          </span>
        </div>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'row' }}>
          {/* Left pane: Selections */}
          <section style={{ flex: '1 1 50%', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
            <h2>Configuration Options</h2>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}

            {/* Show loading state explicitly */}
            {loading && (
              <div style={{ padding: '2rem', background: '#f0f8ff', border: '1px dashed #0066cc', marginBottom: '1rem' }}>
                Fetching simulated API... (this takes 1-3 seconds to test loading states)
              </div>
            )}

            {!data && !loading && !error && <p>No data loaded.</p>}

            {data && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="profile-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Base Profile:</label>
                  <select
                    id="profile-select"
                    value={selectedProfile}
                    onChange={(e) => {
                      setSelectedProfile(e.target.value)
                      // FIX-1: fetchAPI() removed — profile change is purely a UI state change
                    }}
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value="">-- Select a Profile --</option>
                    {data.agentProfiles.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="skill-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Add Skill:</label>
                  <select
                    id="skill-select"
                    onChange={handleSkillSelect}
                    defaultValue=""
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value="" disabled>-- Select a Skill to Add --</option>
                    {data.skills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="layer-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Add Personality Layer:</label>
                  <select
                    id="layer-select"
                    onChange={handleLayerSelect}
                    defaultValue=""
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value="" disabled>-- Select a Layer to Add --</option>
                    {data.layers.map((l) => (
                      <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="provider-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Provider:</label>
                  <select
                    id="provider-select"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  >
                    <option value="">-- Select an AI Provider --</option>
                    {['Gemini', 'ChatGPT', 'Kimi', 'Claude', 'DeepSeek'].map((provider) => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </section>

          {/* Right pane: Selected configuration preview */}
          <section style={{ flex: '1 1 50%', paddingLeft: '1rem' }}>
            <h2>Current Agent Configuration</h2>

            <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', minHeight: '300px' }}>
              <h3 style={{ marginTop: 0 }}>Profile</h3>
              {/* FIX-5: use memoized selectedProfileData instead of repeated .find() */}
              {selectedProfileData ? (
                <p>
                  <strong>{selectedProfileData.name}</strong>:
                  {' '}{selectedProfileData.description}
                </p>
              ) : (
                <p style={{ color: '#888' }}>No profile selected.</p>
              )}

              <h3>Selected Skills</h3>
              {/* FIX-5: use memoized selectedSkillsData */}
              {selectedSkillsData.length > 0 ? (
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {selectedSkillsData.map(skill => (
                    <li key={skill.id} style={{ marginBottom: '0.5rem' }}>
                      {skill.name}
                      <button
                        onClick={() => setSelectedSkills(prev => prev.filter(id => id !== skill.id))}
                        style={{ marginLeft: '1rem', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#888' }}>No skills added.</p>
              )}

              <h3>Selected Layers</h3>
              {/* FIX-5: use memoized selectedLayersData */}
              {selectedLayersData.length > 0 ? (
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {selectedLayersData.map(layer => (
                    <li key={layer.id} style={{ marginBottom: '0.5rem' }}>
                      {layer.name}
                      <button
                        onClick={() => setSelectedLayers(prev => prev.filter(id => id !== layer.id))}
                        style={{ marginLeft: '1rem', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#888' }}>No layers added.</p>
              )}

              <h3>Selected Provider</h3>
              {selectedProvider ? (
                <p><strong>{selectedProvider}</strong></p>
              ) : (
                <p style={{ color: '#888' }}>No provider selected.</p>
              )}

              <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <h3 style={{ marginTop: 0 }}>Save This Agent</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter agent name..."
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem' }}
                  />
                  <button onClick={handleSaveAgent} style={{ padding: '0.5rem 1rem' }}>
                    Save Agent
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Panel: Saved Agents */}
        {savedAgents.length > 0 && (
          <section style={{ padding: '1.5rem', background: '#e0f7fa', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Saved Agents</h2>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all saved agents?')) {
                    setSavedAgents([])
                    localStorage.removeItem('savedAgents')
                  }
                }}
                style={{ padding: '0.5rem 1rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear All
              </button>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {savedAgents.map((agent, index) => (
                <div key={index} style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #b2ebf2', minWidth: '220px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ marginTop: 0, color: '#006064' }}>{agent.name}</h3>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Profile:</strong> {data?.agentProfiles.find(p => p.id === agent.profileId)?.name || 'None Selected'}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Skills:</strong> {agent.skillIds?.length || 0} included
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Layers:</strong> {agent.layerIds?.length || 0} included
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
                    <strong>Provider:</strong> {agent.provider || 'None'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => handleLoadAgent(agent)}
                      style={{ flex: 1, padding: '0.5rem', background: '#00838f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteAgent(index)}
                      style={{ padding: '0.5rem', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
