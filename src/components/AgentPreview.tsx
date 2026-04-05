import { useState, useRef, useEffect } from 'react';
import type { AgentData, BuilderState } from '../types';
import { PROFILE_META, PROVIDER_INFO, CATEGORY_COLORS, LAYER_TYPE_COLORS } from '../data';
import { Badge, CategoryDot, Button } from './Primitives';

interface Props {
  data: AgentData | null;
  builderState: BuilderState;
  lastSaved: Date | undefined;
  onSave: () => void;
  onAgentNameChange: (name: string) => void;
}

export default function AgentPreview({ data, builderState, lastSaved, onSave, onAgentNameChange }: Props) {
  const [isEditingName, setIsEditingName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { selectedProfile, selectedProvider, selectedSkills, selectedLayers, agentName } = builderState;

  useEffect(() => {
    if (isEditingName && inputRef.current) inputRef.current.focus();
  }, [isEditingName]);

  const profile = data?.agentProfiles.find(p => p.id === selectedProfile);
  const profileMeta = selectedProfile ? PROFILE_META[selectedProfile] : undefined;
  const providerInfo = PROVIDER_INFO.find(p => p.id === selectedProvider);

  const allSkills = data?.skills ?? [];
  const allLayers = data?.layers ?? [];
  const selectedSkillsData = allSkills.filter(s => selectedSkills.includes(s.id)).sort((a, b) => selectedSkills.indexOf(a.id) - selectedSkills.indexOf(b.id));
  const selectedLayersData = allLayers.filter(l => selectedLayers.includes(l.id)).sort((a, b) => selectedLayers.indexOf(a.id) - selectedLayers.indexOf(b.id));

  const hasContent = profile || selectedSkillsData.length > 0 || selectedLayersData.length > 0;

  const lastSavedText = lastSaved
    ? `${Math.floor((Date.now() - lastSaved.getTime()) / 60000)}m ago`
    : null;

  return (
    <aside style={{
      width: '320px', height: '100vh', overflowY: 'auto', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-surface-1)', borderLeft: '1px solid var(--border-default)', flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-default)' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          Agent Preview
        </h2>
      </div>

      {/* Empty State */}
      {!hasContent ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              border: '2px dashed var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', opacity: 0.3,
            }}>
              <span style={{ fontSize: '2rem' }}>🤖</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Your agent will appear here
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              Select a profile to get started
              <span style={{ color: 'var(--accent-violet)', fontWeight: 700 }}>←</span>
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Profile header */}
          {profile && profileMeta && (
            <div className="animate-fade-in" style={{ padding: '24px', borderBottom: '1px solid var(--border-default)', textAlign: 'center' }}>
              {/* Avatar with provider dot */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${profileMeta.gradient[0]}, ${profileMeta.gradient[1]})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.25rem', boxShadow: `0 8px 24px ${profileMeta.gradient[0]}50`,
                }}>
                  {profileMeta.icon}
                </div>
                {providerInfo && (
                  <div style={{
                    position: 'absolute', bottom: '-2px', right: '-2px',
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: providerInfo.color, border: '2px solid var(--bg-surface-1)',
                    boxShadow: `0 2px 8px ${providerInfo.color}60`,
                  }} title={providerInfo.name} />
                )}
              </div>

              {/* Editable agent name */}
              <div style={{ marginBottom: '10px' }}>
                {isEditingName ? (
                  <input
                    ref={inputRef}
                    value={agentName}
                    onChange={e => onAgentNameChange(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={e => { if (e.key === 'Enter') setIsEditingName(false); }}
                    id="agent-name-input"
                    placeholder="Untitled Agent"
                    style={{
                      fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.2rem',
                      color: 'var(--text-primary)', background: 'transparent',
                      border: 'none', borderBottom: '2px solid var(--accent-violet)',
                      outline: 'none', textAlign: 'center', padding: '2px 8px', width: '100%',
                    }}
                  />
                ) : (
                  <h3
                    onClick={() => setIsEditingName(true)}
                    title="Click to edit name"
                    style={{
                      fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.2rem',
                      color: 'var(--text-primary)', cursor: 'text',
                      transition: 'color 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-violet-light)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  >
                    {agentName || 'Untitled Agent'}
                  </h3>
                )}
              </div>

              <Badge variant="default">{profile.name}</Badge>
            </div>
          )}

          {/* Skills Section */}
          {selectedSkillsData.length > 0 && (
            <div className="animate-fade-in" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedSkillsData.map(skill => {
                  const color = CATEGORY_COLORS[skill.category] || '#888';
                  return (
                    <Badge key={skill.id} variant="category" color={color}>
                      <CategoryDot color={color} />
                      {skill.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Layers Section */}
          {selectedLayersData.length > 0 && (
            <div className="animate-fade-in" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Layers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedLayersData.map((layer, idx) => {
                  const color = LAYER_TYPE_COLORS[layer.type] || '#888';
                  return (
                    <div key={layer.id} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px', borderRadius: '6px', background: 'var(--bg-surface-2)',
                      borderLeft: `4px solid ${color}`,
                    }}>
                      <span style={{
                        width: '20px', height: '20px', borderRadius: '4px',
                        background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', flexShrink: 0,
                      }}>
                        {idx + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {layer.name}
                        </p>
                      </div>
                      <Badge variant="type" color={color} style={{ textTransform: 'capitalize', fontSize: '0.65rem' }}>
                        {layer.type}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer / Save */}
      <div style={{ padding: '24px', marginTop: 'auto', borderTop: hasContent ? '1px solid var(--border-default)' : 'none' }}>
        <Button
          variant="primary"
          size="md"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
          }
          onClick={onSave}
          disabled={!selectedProfile || !agentName.trim()}
          style={{ width: '100%', marginBottom: '8px' }}
        >
          Save Agent
        </Button>

        {!selectedProfile && (
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Select a profile to save
          </p>
        )}
        {selectedProfile && !agentName.trim() && (
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Click the name above to set a name
          </p>
        )}

        {lastSavedText && (
          <p style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: '8px' }}>
            Last saved: {lastSavedText}
          </p>
        )}
      </div>
    </aside>
  );
}
