import type { SavedAgent, AgentData } from '../types'

interface Props {
  agent: SavedAgent
  data: AgentData | null
  onLoad: (agent: SavedAgent) => void
  /** FIX-9: accepts agent.id (stable string), not an array index */
  onDelete: (id: string) => void
}

/**
 * FIX-8: Renders a single saved-agent card.
 * Fully self-contained — App only needs to pass the agent object + callbacks.
 */
export default function SavedAgentCard({ agent, data, onLoad, onDelete }: Props) {
  const profileName =
    data?.agentProfiles.find((p) => p.id === agent.profileId)?.name ?? 'None Selected'

  return (
    <div
      style={{
        padding: '1rem',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #b2ebf2',
        minWidth: '220px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
    >
      <h3 style={{ marginTop: 0, color: '#006064' }}>{agent.name}</h3>

      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
        <strong>Profile:</strong> {profileName}
      </p>
      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
        <strong>Skills:</strong> {agent.skillIds?.length ?? 0} included
      </p>
      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
        <strong>Layers:</strong> {agent.layerIds?.length ?? 0} included
      </p>
      <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
        <strong>Provider:</strong> {agent.provider ?? 'None'}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button
          onClick={() => onLoad(agent)}
          style={{
            flex: 1,
            padding: '0.5rem',
            background: '#00838f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Load
        </button>
        {/* FIX-9: passes agent.id, not array index */}
        <button
          onClick={() => onDelete(agent.id)}
          style={{
            padding: '0.5rem',
            background: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
