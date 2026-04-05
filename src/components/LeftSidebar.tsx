import { useState, useCallback } from 'react';
import type { SavedAgent, AgentData, BuilderState } from '../types';
import { PROFILE_META, PROVIDER_INFO, CATEGORY_COLORS } from '../data';
import { Button } from './ui/Button';
import { CategoryDot } from './ui/Badge';
import { timeAgo } from '../utils/time';

interface Props {
  agents: SavedAgent[];
  data: AgentData | null;
  selectedAgentId: string | null;
  builderState: BuilderState;
  onNewAgent: () => void;
  onSelectAgent: (agent: SavedAgent) => void;
  onDeleteAgent: (id: string) => void;
  onDeleteAllAgents: () => void;
}



export default function LeftSidebar({ agents, data, selectedAgentId, onNewAgent, onSelectAgent, onDeleteAgent, onDeleteAllAgents }: Props) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const handleDeleteClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirm(id);
  }, []);

  const handleConfirmDelete = useCallback((id: string) => {
    onDeleteAgent(id);
    setDeleteConfirm(null);
  }, [onDeleteAgent]);

  return (
    <>
      <aside style={{
        width: '280px', height: '100vh', display: 'flex', flexDirection: 'column',
        background: 'var(--bg-surface-1)', borderRight: '1px solid var(--border-default)',
        flexShrink: 0, overflow: 'hidden',
      }}>
        {/* Section A — Branding */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Agent Builder
            </h1>
          </div>
        </div>

        {/* Section B — My Agents sub-header */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{
              fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-body)',
            }}>
              My Agents
            </h2>
            <span className="font-mono" style={{
              padding: '2px 8px', background: 'var(--bg-surface-2)', borderRadius: '4px',
              fontSize: '0.7rem', color: 'var(--text-muted)',
            }}>
              {agents.length}
            </span>
          </div>

          {agents.length > 0 && (
            <button
              onClick={() => setShowDeleteAllModal(true)}
              id="clear-all-agents-btn"
              style={{
                width: '100%', padding: '6px 12px', fontSize: '0.75rem',
                color: 'var(--text-muted)', background: 'transparent', border: 'none',
                borderRadius: '6px', cursor: 'pointer', textAlign: 'left', transition: 'all 150ms',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Clear all agents
            </button>
          )}
        </div>

        {/* Section C — Agent list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {agents.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', textAlign: 'center' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                border: '2px dashed var(--border-default)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginBottom: '12px', opacity: 0.5,
              }}>
                <span style={{ fontSize: '1.5rem' }}>🤖</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginBottom: '4px' }}>No agents yet</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Build your first agent →</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {agents.map(agent => {
                const profile = data?.agentProfiles.find(p => p.id === agent.profileId);
                const profileMeta = agent.profileId ? PROFILE_META[agent.profileId] : undefined;
                const providerInfo = PROVIDER_INFO.find(p => p.id === agent.provider);
                const isSelected = selectedAgentId === agent.id;
                const uniqueCategories = [...new Set(
                  agent.skillIds.map(id => data?.skills.find(s => s.id === id)?.category).filter(Boolean)
                )];

                return (
                  <div key={agent.id} style={{ position: 'relative' }}>
                    {/* Agent card */}
                    <div
                      id={`agent-card-${agent.id}`}
                      onClick={() => { setDeleteConfirm(null); onSelectAgent(agent); }}
                      className="group"
                      style={{
                        width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer',
                        borderLeft: `2px solid ${isSelected ? 'var(--accent-violet)' : 'transparent'}`,
                        background: isSelected ? 'var(--bg-surface-2)' : 'transparent',
                        transition: 'all 150ms', textAlign: 'left',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(26,29,38,0.6)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                          {profileMeta && (
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '6px', flexShrink: 0,
                              background: `linear-gradient(135deg, ${profileMeta.gradient[0]}, ${profileMeta.gradient[1]})`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                            }}>
                              {profileMeta.icon}
                            </div>
                          )}
                          <h3 style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem', flex: 1, paddingRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {agent.name}
                          </h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {providerInfo && (
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: providerInfo.color, flexShrink: 0 }} />
                          )}
                          <button
                            onClick={(e) => handleDeleteClick(e, agent.id)}
                            aria-label={`Delete ${agent.name}`}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                              color: 'var(--text-muted)', display: 'flex', borderRadius: '4px',
                              opacity: 0, transition: 'opacity 150ms, color 150ms',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-danger)'; e.currentTarget.style.opacity = '1'; }}
                            onFocus={e => (e.currentTarget.style.opacity = '1')}
                            ref={(el) => {
                              if (el) {
                                const parent = el.closest('[id^="agent-card-"]');
                                if (parent) {
                                  const show = () => (el.style.opacity = '1');
                                  const hide = () => (el.style.opacity = '0');
                                  parent.addEventListener('mouseenter', show);
                                  parent.addEventListener('mouseleave', hide);
                                }
                              }
                            }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        {profile?.name ?? '—'} · {timeAgo(agent.createdAt)}
                      </p>

                      {uniqueCategories.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {(uniqueCategories as string[]).slice(0, 3).map(cat => (
                            <CategoryDot key={cat} color={CATEGORY_COLORS[cat] || '#888'} />
                          ))}
                          {agent.skillIds.length > 0 && (
                            <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                              {agent.skillIds.length} skills
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Inline delete confirm */}
                    {deleteConfirm === agent.id && (
                      <div className="animate-scale-in" style={{
                        position: 'absolute', inset: 0, zIndex: 10,
                        background: 'var(--bg-surface-1)', border: '1px solid var(--accent-danger)',
                        borderRadius: '8px', padding: '12px', boxShadow: 'var(--shadow-xl)',
                      }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
                          Delete &ldquo;{agent.name}&rdquo;?
                        </p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleConfirmDelete(agent.id)}
                            id={`confirm-delete-${agent.id}`}
                            style={{
                              flex: 1, padding: '6px 12px', background: 'var(--accent-danger)',
                              color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',
                              fontSize: '0.75rem', fontWeight: 500,
                            }}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            style={{
                              flex: 1, padding: '6px 12px', background: 'transparent',
                              color: 'var(--text-muted)', border: '1px solid var(--border-default)',
                              borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section D — Footer CTA */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-default)' }}>
          <Button
            variant="outline"
            size="sm"
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            }
            onClick={onNewAgent}
            style={{ width: '100%' }}
          >
            New Agent
          </Button>
        </div>
      </aside>

      {/* Delete All Confirm Modal */}
      {showDeleteAllModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowDeleteAllModal(false)}
        >
          <div
            className="animate-scale-in"
            style={{
              background: 'var(--bg-surface-1)', border: '1px solid var(--border-default)',
              borderRadius: '16px', padding: '24px', maxWidth: '360px', margin: '0 16px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Delete All Agents?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              This will permanently remove all {agents.length} saved agent{agents.length !== 1 ? 's' : ''}. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                id="confirm-delete-all-btn"
                onClick={() => { onDeleteAllAgents(); setShowDeleteAllModal(false); }}
                style={{
                  flex: 1, padding: '10px 16px', background: 'var(--accent-danger)',
                  color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 500, fontSize: '0.875rem',
                }}
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowDeleteAllModal(false)}
                style={{
                  flex: 1, padding: '10px 16px', background: 'transparent',
                  color: 'var(--text-muted)', border: '1px solid var(--border-default)',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
