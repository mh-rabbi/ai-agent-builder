import type { AgentProfile, Skill, Layer, Notification } from '../types'

interface Props {
  selectedProfileData: AgentProfile | null
  selectedSkillsData: Skill[]
  selectedLayersData: Layer[]
  selectedProvider: string
  agentName: string
  onAgentNameChange: (name: string) => void
  onSave: () => void
  notification?: Notification | null
}

const PROVIDER_ICONS: Record<string, string> = {
  Gemini: '✦', ChatGPT: '⬡', Kimi: '◎', Claude: '◈', DeepSeek: '⬥',
}

const LAYER_TYPE_CLASS: Record<string, string> = {
  reasoning: 'layer-card-reasoning', personality: 'layer-card-personality',
  formatting: 'layer-card-formatting', context: 'layer-card-context',
}

const SKILL_DOT_CLASS: Record<string, string> = {
  information: 'skill-dot-information', action: 'skill-dot-action',
}

/** FIX-14: Redesigned agent configuration preview panel. */
export default function AgentCanvas({
  selectedProfileData, selectedSkillsData, selectedLayersData,
  selectedProvider, agentName, onAgentNameChange, onSave, notification,
}: Props) {
  const hasContent = selectedProfileData || selectedSkillsData.length > 0
    || selectedLayersData.length > 0 || selectedProvider

  return (
    <section className="panel">
      <h2 className="panel-title">Agent Preview</h2>

      {/* Inline notification — FIX-10 */}
      {notification && (
        <div className={`notif notif-${notification.type}`}>
          {notification.type === 'success' ? '✓' : '⚠'} {notification.message}
        </div>
      )}

      {/* Empty state */}
      {!hasContent ? (
        <div className="canvas-empty">
          <div className="canvas-empty-icon">🤖</div>
          <p className="canvas-empty-title">Start building your agent</p>
          <p className="canvas-empty-desc">Select a profile and add skills or layers to preview your agent here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s4)' }}>

          {/* Profile */}
          {selectedProfileData && (
            <div className="profile-block">
              <div className="profile-avatar">🧠</div>
              <div>
                <div className="profile-name">{selectedProfileData.name}</div>
                <div className="profile-desc">{selectedProfileData.description}</div>
              </div>
            </div>
          )}

          {/* Skills */}
          {selectedSkillsData.length > 0 && (
            <div>
              <div className="section-sub-title">Skills ({selectedSkillsData.length})</div>
              <div className="skills-pills">
                {selectedSkillsData.map(skill => (
                  <span key={skill.id} className="skill-pill">
                    <span className={`skill-dot ${SKILL_DOT_CLASS[skill.category] ?? 'skill-dot-default'}`} />
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Layers */}
          {selectedLayersData.length > 0 && (
            <div>
              <div className="section-sub-title">Layers ({selectedLayersData.length})</div>
              <div className="layers-list">
                {selectedLayersData.map(layer => (
                  <div key={layer.id} className={`layer-card ${LAYER_TYPE_CLASS[layer.type] ?? ''}`}>
                    <div className="layer-name">{layer.name}</div>
                    <div className="layer-type">{layer.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Provider */}
          {selectedProvider && (
            <div>
              <div className="section-sub-title">Provider</div>
              <span className="provider-chip">
                <span>{PROVIDER_ICONS[selectedProvider] ?? '◉'}</span>
                {selectedProvider}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Save section — always visible */}
      <div className="save-section">
        <div className="save-title">Save Agent</div>
        <div className="save-row">
          <input
            id="agent-name-input"
            className="save-input"
            type="text"
            placeholder="Give your agent a name…"
            value={agentName}
            onChange={e => onAgentNameChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSave()}
          />
          <button id="save-agent-btn" className="btn btn-accent" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </section>
  )
}
