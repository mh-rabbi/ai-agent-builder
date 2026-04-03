import type { AgentData } from '../types'

interface Props {
  data: AgentData | null
  loading: boolean
  error: string | null
  selectedProfile: string
  selectedSkills: string[]
  selectedLayers: string[]
  selectedProvider: string
  onProfileChange: (profileId: string) => void
  onSkillSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onLayerSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onProviderChange: (provider: string) => void
}

/**
 * FIX-8: Left-pane configuration panel.
 * Receives all selection state + callbacks from App — owns zero state itself.
 */
export default function ConfigPanel({
  data,
  loading,
  error,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  onProfileChange,
  onSkillSelect,
  onLayerSelect,
  onProviderChange,
}: Props) {
  return (
    <section style={{ flex: '1 1 50%', borderRight: '1px solid #ccc', paddingRight: '1rem' }}>
      <h2>Configuration Options</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>
      )}

      {loading && (
        <div style={{ padding: '2rem', background: '#f0f8ff', border: '1px dashed #0066cc', marginBottom: '1rem' }}>
          Fetching simulated API… (this takes 1–3 seconds to test loading states)
        </div>
      )}

      {!data && !loading && !error && <p>No data loaded.</p>}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Base Profile */}
          <div>
            <label htmlFor="profile-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Base Profile:
            </label>
            <select
              id="profile-select"
              value={selectedProfile}
              onChange={(e) => onProfileChange(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="">-- Select a Profile --</option>
              {data.agentProfiles.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Skills — already-selected ones filtered out to avoid duplicates */}
          <div>
            <label htmlFor="skill-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Add Skill:
            </label>
            <select
              id="skill-select"
              onChange={onSkillSelect}
              defaultValue=""
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="" disabled>-- Select a Skill to Add --</option>
              {data.skills
                .filter((s) => !selectedSkills.includes(s.id))
                .map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                ))}
            </select>
          </div>

          {/* Layers — same filter pattern */}
          <div>
            <label htmlFor="layer-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Add Personality Layer:
            </label>
            <select
              id="layer-select"
              onChange={onLayerSelect}
              defaultValue=""
              style={{ width: '100%', padding: '0.5rem' }}
            >
              <option value="" disabled>-- Select a Layer to Add --</option>
              {data.layers
                .filter((l) => !selectedLayers.includes(l.id))
                .map((l) => (
                  <option key={l.id} value={l.id}>{l.name} ({l.type})</option>
                ))}
            </select>
          </div>

          {/* AI Provider */}
          <div>
            <label htmlFor="provider-select" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              AI Provider:
            </label>
            <select
              id="provider-select"
              value={selectedProvider}
              onChange={(e) => onProviderChange(e.target.value)}
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
  )
}
