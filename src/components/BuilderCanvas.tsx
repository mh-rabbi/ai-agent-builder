import { useState, useCallback } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCorners,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  arrayMove, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { AgentData, BuilderState, Skill, Layer } from '../types';
import { PROFILE_META, PROVIDER_INFO } from '../data';
import { ProfileCard, SkillItem, LayerItem } from './Primitives';

interface Props {
  data: AgentData | null;
  loading: boolean;
  builderState: BuilderState;
  onProfileSelect: (id: string) => void;
  onProviderToggle: (id: string) => void;
  onSkillAdd: (id: string) => void;
  onSkillRemove: (id: string) => void;
  onSkillsReorder: (ids: string[]) => void;
  onLayerAdd: (id: string) => void;
  onLayerRemove: (id: string) => void;
  onLayersReorder: (ids: string[]) => void;
  onReset: () => void;
  onClearAll: () => void;
}

// Step indicator
function StepDot({ step, label, currentStep, isCompleted }: { step: number; label: string; currentStep: number; isCompleted: boolean }) {
  const isActive = currentStep === step;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: isCompleted ? 'var(--accent-success)' : isActive ? 'var(--accent-violet)' : 'var(--bg-surface-2)',
        color: (isCompleted || isActive) ? 'white' : 'var(--text-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500,
        transition: 'all 200ms',
        boxShadow: isActive ? '0 0 0 4px rgba(124,58,237,0.2)' : isCompleted ? '0 0 0 4px rgba(16,185,129,0.15)' : 'none',
        flexShrink: 0,
      }}>
        {isCompleted ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        ) : step}
      </div>
      <span style={{
        fontWeight: 500, fontSize: '0.875rem',
        color: isActive ? 'var(--text-primary)' : isCompleted ? 'var(--accent-success)' : 'var(--text-muted)',
        transition: 'color 200ms',
      }}>
        {label}
      </span>
    </div>
  );
}

// Sortable wrapper for dnd-kit
function SortableSkill({ id, children }: { id: string; children: (props: { dragHandleProps: React.HTMLAttributes<HTMLButtonElement>; isDragging: boolean }) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      {children({ dragHandleProps: { ...attributes, ...listeners } as React.HTMLAttributes<HTMLButtonElement>, isDragging })}
    </div>
  );
}

// Capabilities tabs (Skills | Layers) with DnD
function CapabilitiesPanel({ data, builderState, onSkillAdd, onSkillRemove, onSkillsReorder, onLayerAdd, onLayerRemove, onLayersReorder }: {
  data: AgentData;
  builderState: BuilderState;
  onSkillAdd: (id: string) => void;
  onSkillRemove: (id: string) => void;
  onSkillsReorder: (ids: string[]) => void;
  onLayerAdd: (id: string) => void;
  onLayerRemove: (id: string) => void;
  onLayersReorder: (ids: string[]) => void;
}) {
  const [activeTab, setActiveTab] = useState<'skills' | 'layers'>('skills');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const { selectedSkills, selectedLayers } = builderState;
  const availableSkills = data.skills.filter(s => !selectedSkills.includes(s.id));
  const availableLayers = data.layers.filter(l => !selectedLayers.includes(l.id));
  const selectedSkillsData = selectedSkills.map(id => data.skills.find(s => s.id === id)).filter(Boolean) as Skill[];
  const selectedLayersData = selectedLayers.map(id => data.layers.find(l => l.id === id)).filter(Boolean) as Layer[];

  const selSkillIds = selectedSkills.map(id => `sel-sk-${id}`);
  const selLayerIds = selectedLayers.map(id => `sel-ly-${id}`);

  const onDragStart = useCallback(({ active }: DragStartEvent) => setActiveDragId(active.id as string), []);
  const onDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setActiveDragId(null);
    if (!over) return;
    const aId = active.id as string;
    const oId = over.id as string;
    if (activeTab === 'skills') {
      if (aId.startsWith('sel-sk-')) {
        const rawA = aId.slice(7), rawO = oId.slice(7);
        const oi = selectedSkills.indexOf(rawA), ni = selectedSkills.indexOf(rawO);
        if (oi !== -1 && ni !== -1 && oi !== ni) onSkillsReorder(arrayMove(selectedSkills, oi, ni));
      }
    } else {
      if (aId.startsWith('sel-ly-')) {
        const rawA = aId.slice(7), rawO = oId.slice(7);
        const oi = selectedLayers.indexOf(rawA), ni = selectedLayers.indexOf(rawO);
        if (oi !== -1 && ni !== -1 && oi !== ni) onLayersReorder(arrayMove(selectedLayers, oi, ni));
      }
    }
  }, [activeTab, selectedSkills, selectedLayers, onSkillsReorder, onLayersReorder]);

  const activeDragItem = activeDragId?.startsWith('sel-sk-')
    ? data.skills.find(s => s.id === activeDragId.slice(7))
    : activeDragId?.startsWith('sel-ly-')
      ? data.layers.find(l => l.id === activeDragId.slice(7))
      : null;

  const tabStyle = (tab: 'skills' | 'layers') => ({
    padding: '6px 14px', fontSize: '0.8rem', fontWeight: 500, borderRadius: '6px 6px 0 0',
    border: 'none', cursor: 'pointer', transition: 'all 150ms', fontFamily: 'var(--font-body)',
    background: activeTab === tab ? 'var(--accent-violet)' : 'transparent',
    color: activeTab === tab ? 'white' : 'var(--text-muted)',
  });

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* LEFT — Available */}
        <div style={{ background: 'var(--bg-surface-1)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-default)' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '0' }}>
            <button id="tab-skills" style={tabStyle('skills')} onClick={() => setActiveTab('skills')}>
              Skills ({data.skills.length})
            </button>
            <button id="tab-layers" style={tabStyle('layers')} onClick={() => setActiveTab('layers')}>
              Layers ({data.layers.length})
            </button>
          </div>

          <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeTab === 'skills' ? (
              availableSkills.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '24px', fontStyle: 'italic' }}>
                  All skills added ✓
                </p>
              ) : availableSkills.map(s => (
                <SkillItem
                  key={s.id} id={s.id} name={s.name} category={s.category}
                  onAdd={() => onSkillAdd(s.id)}
                />
              ))
            ) : (
              availableLayers.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '24px', fontStyle: 'italic' }}>
                  All layers added ✓
                </p>
              ) : availableLayers.map(l => (
                <LayerItem
                  key={l.id} id={l.id} name={l.name} type={l.type}
                  onAdd={() => onLayerAdd(l.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT — Selected & Ordered */}
        <div style={{ background: 'var(--bg-surface-1)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-default)' }}>
          <h3 style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
            Selected & Ordered
          </h3>

          {/* Skills drop zone */}
          {activeTab === 'skills' && (
            <SortableContext items={selSkillIds} strategy={verticalListSortingStrategy}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '200px' }}>
                {selectedSkillsData.length === 0 ? (
                  <div style={{
                    minHeight: '200px', border: '2px dashed var(--border-default)', borderRadius: '8px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="animate-bounce">
                      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                    </svg>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Drop or add skills here</p>
                  </div>
                ) : selectedSkillsData.map((skill, idx) => (
                  <SortableSkill key={`sel-sk-${skill.id}`} id={`sel-sk-${skill.id}`}>
                    {({ dragHandleProps, isDragging }) => (
                      <SkillItem
                        id={skill.id} name={skill.name} category={skill.category}
                        isSelected index={idx} isDragging={isDragging}
                        onRemove={() => onSkillRemove(skill.id)}
                        dragHandleProps={dragHandleProps}
                      />
                    )}
                  </SortableSkill>
                ))}
              </div>
            </SortableContext>
          )}

          {/* Layers drop zone */}
          {activeTab === 'layers' && (
            <SortableContext items={selLayerIds} strategy={verticalListSortingStrategy}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '200px' }}>
                {selectedLayersData.length === 0 ? (
                  <div style={{
                    minHeight: '200px', border: '2px dashed var(--border-default)', borderRadius: '8px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" className="animate-bounce">
                      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                    </svg>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Drop or add layers here</p>
                  </div>
                ) : selectedLayersData.map((layer, idx) => (
                  <SortableSkill key={`sel-ly-${layer.id}`} id={`sel-ly-${layer.id}`}>
                    {({ dragHandleProps, isDragging }) => (
                      <LayerItem
                        id={layer.id} name={layer.name} type={layer.type}
                        isSelected index={idx} isDragging={isDragging}
                        onRemove={() => onLayerRemove(layer.id)}
                        dragHandleProps={dragHandleProps}
                      />
                    )}
                  </SortableSkill>
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeDragItem && (
          <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-surface-2)', border: '1px solid var(--accent-violet)', boxShadow: 'var(--shadow-xl)', opacity: 0.95, transform: 'rotate(2deg) scale(1.04)' }}>
            <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{activeDragItem.name}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default function BuilderCanvas({
  data, loading, builderState,
  onProfileSelect, onProviderToggle,
  onSkillAdd, onSkillRemove, onSkillsReorder,
  onLayerAdd, onLayerRemove, onLayersReorder,
  onReset, onClearAll,
}: Props) {
  const [showClearModal, setShowClearModal] = useState(false);
  const { currentStep, selectedProfile, selectedProvider, selectedSkills, selectedLayers } = builderState;

  const hasContent = selectedProfile !== ''
    || selectedSkills.length > 0
    || selectedLayers.length > 0;

  const step1Done = selectedProfile !== '';
  const step2Done = selectedSkills.length > 0 || selectedLayers.length > 0;

  const profiles = data?.agentProfiles.map(p => ({
    ...p,
    ...(PROFILE_META[p.id] || { icon: '🤖', gradient: ['#7C3AED', '#4F46E5'] as [string, string] }),
  })) ?? [];

  return (
    <>
      <main style={{ flex: 1, background: 'var(--bg-base)', overflowY: 'auto', position: 'relative' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>

          {/* Toolbar */}
          {hasContent && (
            <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '24px' }}>
              <button
                id="reset-config-btn"
                onClick={onReset}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px',
                  borderRadius: '8px', fontSize: '0.8rem', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', background: 'var(--bg-surface-1)', transition: 'all 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
                </svg>
                Reset Configuration
              </button>
              <button
                id="clear-all-btn"
                onClick={() => setShowClearModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px',
                  borderRadius: '8px', fontSize: '0.8rem', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', background: 'var(--bg-surface-1)', transition: 'all 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent-danger)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Clear All
              </button>
            </div>
          )}

          {/* Progress Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
            <StepDot step={1} label="Profile" currentStep={currentStep} isCompleted={step1Done} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={step1Done ? 'var(--accent-success)' : 'var(--text-muted)'} strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <StepDot step={2} label="Capabilities" currentStep={currentStep} isCompleted={step2Done} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={step2Done ? 'var(--accent-success)' : 'var(--text-muted)'} strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <StepDot step={3} label="Save" currentStep={currentStep} isCompleted={false} />
          </div>

          {/* Loading state */}
          {loading && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
              padding: '80px 0', color: 'var(--text-muted)',
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '3px solid var(--border-default)', borderTopColor: 'var(--accent-violet)',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontSize: '0.875rem' }}>Loading configuration…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Step 1 — Profile Selection */}
          {!loading && (
            <section style={{ marginBottom: '48px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '24px' }}>
                Choose a Base Profile
              </h2>
              <div className="scrollbar-hide" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                {profiles.map(p => (
                  <ProfileCard
                    key={p.id} id={p.id} name={p.name} description={p.description}
                    icon={p.icon} gradient={p.gradient}
                    selected={selectedProfile === p.id}
                    onClick={() => onProfileSelect(p.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Step 2 — Build Capabilities (shown when step >= 2) */}
          {!loading && currentStep >= 2 && data && (
            <section className="animate-fade-in" style={{ marginBottom: '48px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '24px' }}>
                Build Capabilities
              </h2>

              <CapabilitiesPanel
                data={data}
                builderState={builderState}
                onSkillAdd={onSkillAdd} onSkillRemove={onSkillRemove} onSkillsReorder={onSkillsReorder}
                onLayerAdd={onLayerAdd} onLayerRemove={onLayerRemove} onLayersReorder={onLayersReorder}
              />

              {/* Provider Selection */}
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
                  Select Provider
                </h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {PROVIDER_INFO.map(p => {
                    const isSelected = selectedProvider === p.id;
                    return (
                      <button
                        key={p.id}
                        id={`provider-btn-${p.id.toLowerCase()}`}
                        onClick={() => onProviderToggle(p.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px',
                          borderRadius: '8px', border: `2px solid ${isSelected ? 'var(--accent-violet)' : 'var(--border-default)'}`,
                          background: isSelected ? 'rgba(124,58,237,0.08)' : 'var(--bg-surface-1)',
                          cursor: 'pointer', transition: 'all 150ms', fontFamily: 'var(--font-body)',
                        }}
                        aria-pressed={isSelected}
                        aria-label={`Select ${p.name} provider`}
                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; }}
                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                      >
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Clear All Modal */}
      {showClearModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowClearModal(false)}
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
              Clear Everything?
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              This will reset all current configuration including your profile, skills, layers, and provider selection. Your saved agents will not be affected.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                id="confirm-clear-all-btn"
                onClick={() => { onClearAll(); setShowClearModal(false); }}
                style={{
                  flex: 1, padding: '10px 16px', background: 'var(--accent-danger)',
                  color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: 500, fontSize: '0.875rem',
                }}
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowClearModal(false)}
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
