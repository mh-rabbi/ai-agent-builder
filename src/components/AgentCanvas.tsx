import type { AgentProfile, Skill, Layer, Notification } from '../types'

interface Props {
  selectedProfileData: AgentProfile | null
  selectedSkillsData: Skill[]
  selectedLayersData: Layer[]
  selectedProvider: string
  agentName: string
  onAgentNameChange: (name: string) => void
  onSave: () => void
  onRemoveSkill: (id: string) => void
  onRemoveLayer: (id: string) => void
  /** Inline notification — wired up in FIX-10 (Phase 4). Optional until then. */
  notification?: Notification | null
}

/**
 * FIX-8: Right-pane "Current Agent Configuration" panel.
 * Receives pre-computed (memoized) data from App — no derive logic here.
 */
export default function AgentCanvas({
  selectedProfileData,
  selectedSkillsData,
  selectedLayersData,
  selectedProvider,
  agentName,
  onAgentNameChange,
  onSave,
  onRemoveSkill,
  onRemoveLayer,
  notification,
}: Props) {
  return (
    <section style={{ flex: '1 1 50%', paddingLeft: '1rem' }}>
      <h2>Current Agent Configuration</h2>

      {/* Notification banner — rendered when FIX-10 wires up inline alerts */}
      {notification && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            background: notification.type === 'success' ? '#e8f5e9' : '#ffebee',
            color: notification.type === 'success' ? '#2e7d32' : '#c62828',
            border: `1px solid ${notification.type === 'success' ? '#a5d6a7' : '#ef9a9a'}`,
          }}
        >
          {notification.message}
        </div>
      )}

      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', minHeight: '300px' }}>
        {/* Profile */}
        <h3 style={{ marginTop: 0 }}>Profile</h3>
        {selectedProfileData ? (
          <p>
            <strong>{selectedProfileData.name}</strong>:{' '}
            {selectedProfileData.description}
          </p>
        ) : (
          <p style={{ color: '#888' }}>No profile selected.</p>
        )}

        {/* Skills */}
        <h3>Selected Skills</h3>
        {selectedSkillsData.length > 0 ? (
          <ul style={{ paddingLeft: '1.5rem' }}>
            {selectedSkillsData.map((skill) => (
              <li key={skill.id} style={{ marginBottom: '0.5rem' }}>
                {skill.name}
                <button
                  onClick={() => onRemoveSkill(skill.id)}
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

        {/* Layers */}
        <h3>Selected Layers</h3>
        {selectedLayersData.length > 0 ? (
          <ul style={{ paddingLeft: '1.5rem' }}>
            {selectedLayersData.map((layer) => (
              <li key={layer.id} style={{ marginBottom: '0.5rem' }}>
                {layer.name}
                <button
                  onClick={() => onRemoveLayer(layer.id)}
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

        {/* Provider */}
        <h3>Selected Provider</h3>
        {selectedProvider ? (
          <p><strong>{selectedProvider}</strong></p>
        ) : (
          <p style={{ color: '#888' }}>No provider selected.</p>
        )}

        {/* Save section */}
        <div style={{ marginTop: '2rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Save This Agent</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="agent-name-input"
              type="text"
              placeholder="Enter agent name…"
              value={agentName}
              onChange={(e) => onAgentNameChange(e.target.value)}
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <button id="save-agent-btn" onClick={onSave} style={{ padding: '0.5rem 1rem' }}>
              Save Agent
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
