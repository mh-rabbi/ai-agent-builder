import type { SavedAgent, AgentData } from '../types'

interface Props {
  agent: SavedAgent
  data: AgentData | null
  onLoad: (agent: SavedAgent) => void
  onDelete: (id: string) => void
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

/** FIX-15: Polished saved-agent card with relative timestamp, badges, hover lift. */
export default function SavedAgentCard({ agent, data, onLoad, onDelete }: Props) {
  const profileName = data?.agentProfiles.find(p => p.id === agent.profileId)?.name ?? '—'

  return (
    <div className="agent-card">
      <div className="agent-card-name">{agent.name}</div>

      <div className="agent-card-meta">
        <div className="agent-card-row">
          <span className="agent-card-label">Profile</span>
          <span style={{ fontSize: 'var(--sm)', color: 'var(--text)' }}>{profileName}</span>
        </div>

        <div className="agent-card-row">
          <span className="agent-card-label">Skills</span>
          <span className="mini-badge">{agent.skillIds?.length ?? 0} skills</span>
        </div>

        <div className="agent-card-row">
          <span className="agent-card-label">Layers</span>
          <span className="mini-badge">{agent.layerIds?.length ?? 0} layers</span>
        </div>

        {agent.provider && (
          <div className="agent-card-row">
            <span className="agent-card-label">Provider</span>
            <span className="mini-badge">{agent.provider}</span>
          </div>
        )}
      </div>

      {agent.createdAt && (
        <div className="agent-card-time">🕐 {timeAgo(agent.createdAt)}</div>
      )}

      <div className="agent-card-actions">
        <button className="btn btn-accent" style={{ flex: 1 }} onClick={() => onLoad(agent)}>
          Load
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(agent.id)} title="Delete agent">
          🗑
        </button>
      </div>
    </div>
  )
}
