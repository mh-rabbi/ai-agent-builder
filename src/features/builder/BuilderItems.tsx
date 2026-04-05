import { memo } from 'react';
import { CATEGORY_COLORS, LAYER_TYPE_COLORS } from '../../data';
import { CategoryDot, Badge } from '../../components/ui/Badge';

// ── SkillItem ──
interface SkillItemProps {
  id: string; name: string; category: string;
  isSelected?: boolean;
  onAdd?: () => void; onRemove?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  index?: number;
}
export const SkillItem = memo(function SkillItem({ id, name, category, isSelected, onAdd, onRemove, dragHandleProps, isDragging, index }: SkillItemProps) {
  const color = CATEGORY_COLORS[category] || 'var(--accent-violet)';
  return (
    <div
      id={`skill-item-${id}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
        borderRadius: '8px', border: `1px ${isSelected ? 'solid' : 'dashed'} var(--border-default)`,
        background: isSelected ? 'var(--bg-surface-2)' : 'rgba(26,29,38,0.5)',
        transition: 'all 150ms', opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
      }}
    >
      {isSelected && index !== undefined && (
        <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', minWidth: '16px' }}>
          {index + 1}
        </span>
      )}

      <CategoryDot color={color} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name}
        </p>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{category}</p>
      </div>

      {isSelected && onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '2px', borderRadius: '4px', transition: 'color 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-danger)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}

      {isSelected && dragHandleProps && (
        <button
          {...dragHandleProps}
          aria-label={`Drag to reorder ${name}`}
          style={{ background: 'none', border: 'none', cursor: 'grab', color: 'var(--text-muted)', display: 'flex', padding: '2px', borderRadius: '4px', transition: 'color 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
        </button>
      )}

      {!isSelected && onAdd && (
        <button
          onClick={onAdd}
          aria-label={`Add ${name}`}
          style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer', color: 'var(--accent-violet-light)', display: 'flex', padding: '3px 6px', borderRadius: '4px', transition: 'all 150ms', fontSize: '0.7rem', fontWeight: 600 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.1)'; }}
        >
          + Add
        </button>
      )}
    </div>
  );
});

// ── LayerItem ──
interface LayerItemProps {
  id: string; name: string; type: string;
  isSelected?: boolean;
  onAdd?: () => void; onRemove?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  index?: number;
}
export const LayerItem = memo(function LayerItem({ id, name, type, isSelected, onAdd, onRemove, dragHandleProps, isDragging, index }: LayerItemProps) {
  const color = LAYER_TYPE_COLORS[type] || 'var(--accent-violet)';
  return (
    <div
      id={`layer-item-${id}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
        borderRadius: '8px', borderLeft: `4px solid ${color}`,
        border: `1px solid var(--border-default)`,
        borderLeftWidth: '4px', borderLeftColor: color,
        background: isSelected ? 'var(--bg-surface-2)' : 'rgba(26,29,38,0.5)',
        transition: 'all 150ms', opacity: isDragging ? 0.4 : 1,
        transform: isDragging ? 'rotate(2deg) scale(1.05)' : 'none',
      }}
    >
      {isSelected && index !== undefined && (
        <span style={{
          minWidth: '20px', height: '20px', borderRadius: '4px',
          background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
        }}>
          {index + 1}
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <p className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
          {name}
        </p>
        <Badge variant="type" color={color} style={{ textTransform: 'capitalize' }}>{type}</Badge>
      </div>

      {isSelected && onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '2px', borderRadius: '4px', transition: 'color 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-danger)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}

      {isSelected && dragHandleProps && (
        <button
          {...dragHandleProps}
          aria-label={`Drag to reorder ${name}`}
          style={{ background: 'none', border: 'none', cursor: 'grab', color: 'var(--text-muted)', display: 'flex', padding: '2px', borderRadius: '4px', transition: 'color 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="19" r="1" fill="currentColor"/><circle cx="15" cy="5" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="19" r="1" fill="currentColor"/></svg>
        </button>
      )}

      {!isSelected && onAdd && (
        <button
          onClick={onAdd}
          aria-label={`Add ${name}`}
          style={{ background: `${color}15`, border: `1px solid ${color}40`, cursor: 'pointer', color: color, display: 'flex', padding: '3px 6px', borderRadius: '4px', transition: 'all 150ms', fontSize: '0.7rem', fontWeight: 600 }}
          onMouseEnter={e => (e.currentTarget.style.background = `${color}25`)}
          onMouseLeave={e => (e.currentTarget.style.background = `${color}15`)}
        >
          + Add
        </button>
      )}
    </div>
  );
});
