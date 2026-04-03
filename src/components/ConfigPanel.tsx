import { useState } from 'react'
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCorners, useDroppable,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  arrayMove, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { AgentData, Skill, Layer } from '../types'

interface Props {
  data: AgentData | null
  loading: boolean
  error: string | null
  selectedProfile: string
  selectedSkills: string[]
  selectedLayers: string[]
  selectedProvider: string
  onProfileChange: (id: string) => void
  onSkillAdd: (id: string) => void
  onSkillRemove: (id: string) => void
  onSkillsReorder: (ids: string[]) => void
  onLayerAdd: (id: string) => void
  onLayerRemove: (id: string) => void
  onLayersReorder: (ids: string[]) => void
  onProviderChange: (provider: string) => void
}

/* ── Sortable card (Selected column) ── */
function SortableCard({ id, name, badgeLabel, badgeClass, onRemove }: {
  id: string; name: string; badgeLabel: string; badgeClass: string; onRemove: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`dnd-card${isDragging ? ' dnd-card-dragging' : ''}`}
      {...attributes} {...listeners}
    >
      <div className="dnd-card-top">
        <span className="dnd-card-name">{name}</span>
        <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
        <button className="btn-icon" onClick={(e) => { e.stopPropagation(); onRemove(id) }} title="Remove">✕</button>
      </div>
    </div>
  )
}

/* ── Draggable card (Available column) ── */
function AvailCard({ id, name, badgeLabel, badgeClass, onAdd }: {
  id: string; name: string; badgeLabel: string; badgeClass: string; onAdd: (id: string) => void
}) {
  return (
    <div className="dnd-card" style={{ cursor: 'default' }}>
      <div className="dnd-card-top">
        <span className="dnd-card-name">{name}</span>
        <span className={`badge ${badgeClass}`}>{badgeLabel}</span>
        <button className="btn-icon" style={{ color: 'var(--accent2)' }} onClick={() => onAdd(id)} title="Add">＋</button>
      </div>
    </div>
  )
}

/* ── Droppable zone wrapper ── */
function DroppableZone({ id, label, children, isEmpty }: {
  id: string; label: string; children: React.ReactNode; isEmpty: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div ref={setNodeRef} className={`dnd-zone${isOver ? ' dnd-zone-over' : ''}`}>
      <div className="dnd-zone-header">{label}</div>
      {isEmpty
        ? <div className="dnd-zone-empty">{label === 'Available' ? 'All added' : 'Drag here or click ＋'}</div>
        : children}
    </div>
  )
}

function getBadgeForSkill(s: Skill) {
  const map: Record<string, string> = { information: 'badge-info', action: 'badge-action' }
  return { label: s.category, cls: map[s.category] ?? 'badge-accent' }
}
function getBadgeForLayer(l: Layer) {
  const map: Record<string, string> = { reasoning: 'badge-accent', personality: 'badge-pink', formatting: 'badge-warning', context: 'badge-info' }
  return { label: l.type, cls: map[l.type] ?? 'badge-accent' }
}

/* ── Generic DnD section (skills or layers) ── */
function DndSection({ allItems, selectedIds, onAdd, onRemove, onReorder, getLabel }: {
  allItems: (Skill | Layer)[]
  selectedIds: string[]
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  onReorder: (ids: string[]) => void
  getLabel: (item: Skill | Layer) => { label: string; cls: string }
}) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const available = allItems.filter(i => !selectedIds.includes(i.id))
  const selected = selectedIds.map(id => allItems.find(i => i.id === id)).filter(Boolean) as (Skill | Layer)[]
  const selIds = selectedIds.map(id => `sel-${id}`)

  function onDragStart({ active }: DragStartEvent) { setActiveDragId(active.id as string) }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveDragId(null)
    if (!over) return
    const aId = active.id as string
    const oId = over.id as string
    if (aId.startsWith('sel-')) {
      // reordering within selected, or drop back to available zone
      if (oId === 'avail-zone') { onRemove(aId.slice(4)); return }
      const rawA = aId.slice(4), rawO = oId.slice(4)
      const oi = selectedIds.indexOf(rawA), ni = selectedIds.indexOf(rawO)
      if (oi !== -1 && ni !== -1 && oi !== ni) onReorder(arrayMove(selectedIds, oi, ni))
    }
  }

  const activeItem = activeDragId?.startsWith('sel-')
    ? allItems.find(i => i.id === activeDragId.slice(4))
    : null

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="dnd-cols">
        {/* Available column */}
        <DroppableZone id="avail-zone" label="Available" isEmpty={available.length === 0}>
          {available.map(item => {
            const { label, cls } = getLabel(item)
            return <AvailCard key={item.id} id={item.id} name={item.name} badgeLabel={label} badgeClass={cls} onAdd={onAdd} />
          })}
        </DroppableZone>

        {/* Selected column — sortable */}
        <SortableContext items={selIds} strategy={verticalListSortingStrategy}>
          <DroppableZone id="sel-zone" label="Selected" isEmpty={selected.length === 0}>
            {selected.map(item => {
              const { label, cls } = getLabel(item)
              return (
                <SortableCard key={`sel-${item.id}`} id={`sel-${item.id}`} name={item.name}
                  badgeLabel={label} badgeClass={cls} onRemove={onRemove} />
              )
            })}
          </DroppableZone>
        </SortableContext>
      </div>

      <DragOverlay>
        {activeItem && (() => {
          const { label, cls } = getLabel(activeItem)
          return (
            <div className="dnd-card dnd-card-overlay">
              <div className="dnd-card-top">
                <span className="dnd-card-name">{activeItem.name}</span>
                <span className={`badge ${cls}`}>{label}</span>
              </div>
            </div>
          )
        })()}
      </DragOverlay>
    </DndContext>
  )
}

/* ── ConfigPanel ── */
export default function ConfigPanel({
  data, loading, error, selectedProfile, selectedSkills, selectedLayers, selectedProvider,
  onProfileChange, onSkillAdd, onSkillRemove, onSkillsReorder,
  onLayerAdd, onLayerRemove, onLayersReorder, onProviderChange,
}: Props) {
  return (
    <section className="panel">
      <h2 className="panel-title">Configuration</h2>

      {error && <div className="config-error">⚠ {error}</div>}
      {loading && <div className="config-loading">⏳ Loading configuration…</div>}
      {!data && !loading && !error && <p className="config-nodata">No data loaded.</p>}

      {data && (
        <>
          {/* Profile select */}
          <div className="form-group">
            <label className="form-label" htmlFor="profile-select">Base Profile</label>
            <select id="profile-select" className="form-select" value={selectedProfile}
              onChange={e => onProfileChange(e.target.value)}>
              <option value="">— Select a Profile —</option>
              {data.agentProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Skills DnD — FIX-13 */}
          <div className="dnd-section">
            <span className="dnd-section-label">Skills</span>
            <DndSection
              allItems={data.skills}
              selectedIds={selectedSkills}
              onAdd={onSkillAdd}
              onRemove={onSkillRemove}
              onReorder={onSkillsReorder}
              getLabel={i => getBadgeForSkill(i as Skill)}
            />
          </div>

          {/* Layers DnD — FIX-13 */}
          <div className="dnd-section">
            <span className="dnd-section-label">Personality Layers</span>
            <DndSection
              allItems={data.layers}
              selectedIds={selectedLayers}
              onAdd={onLayerAdd}
              onRemove={onLayerRemove}
              onReorder={onLayersReorder}
              getLabel={i => getBadgeForLayer(i as Layer)}
            />
          </div>

          {/* Provider */}
          <div className="form-group">
            <label className="form-label" htmlFor="provider-select">AI Provider</label>
            <select id="provider-select" className="form-select" value={selectedProvider}
              onChange={e => onProviderChange(e.target.value)}>
              <option value="">— Select a Provider —</option>
              {['Gemini', 'ChatGPT', 'Kimi', 'Claude', 'DeepSeek'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </section>
  )
}
