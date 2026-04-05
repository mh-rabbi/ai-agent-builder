// ── Shared primitive components ──

import type { ReactNode } from 'react';
import { CATEGORY_COLORS, LAYER_TYPE_COLORS } from '../data';

// ── CategoryDot ──
export function CategoryDot({ color }: { color: string }) {
  return (
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
  );
}

// ── Badge ──
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'category' | 'type' | 'provider';
  color?: string;
  style?: React.CSSProperties;
}
export function Badge({ children, variant = 'default', color, style }: BadgeProps) {
  let bg = 'var(--bg-surface-2)', textColor = 'var(--text-muted)', border = 'transparent';
  if ((variant === 'category' || variant === 'type') && color) {
    bg = color + '20'; textColor = color; border = color + '40';
  }
  return (
    <span
      className="font-mono"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem',
        fontFamily: 'var(--font-mono)', fontWeight: 500,
        background: bg, color: textColor, border: `1px solid ${border}`,
        letterSpacing: '0.02em', whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Button ──
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}
export function Button({
  children, variant = 'primary', size = 'md', icon, onClick, disabled, style, 'aria-label': ariaLabel, type = 'button',
}: ButtonProps) {
  const sizePad: Record<string, string> = { sm: '6px 12px', md: '8px 16px', lg: '12px 24px' };
  const sizeFnt: Record<string, string> = { sm: '0.8rem', md: '0.9rem', lg: '1rem' };

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: sizePad[size], fontSize: sizeFnt[size], fontWeight: 500,
    fontFamily: 'var(--font-body)', borderRadius: '8px', border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1, transition: 'all 150ms ease',
    ...style,
  };

  const variantStyle: React.CSSProperties =
    variant === 'primary' ? {
      background: 'var(--accent-violet)', color: 'var(--text-primary)',
      boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
    } :
    variant === 'ghost' ? {
      background: 'transparent', color: 'var(--text-muted)',
    } : {
      background: 'transparent', border: '2px dashed var(--border-default)',
      color: 'var(--text-muted)',
    };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{ ...baseStyle, ...variantStyle }}
      onMouseEnter={e => {
        if (disabled) return;
        const el = e.currentTarget;
        if (variant === 'primary') { el.style.background = 'var(--accent-violet-light)'; }
        else if (variant === 'ghost') { el.style.background = 'var(--bg-surface-2)'; el.style.color = 'var(--text-primary)'; }
        else { el.style.borderColor = 'var(--accent-violet)'; el.style.color = 'var(--text-primary)'; }
      }}
      onMouseLeave={e => {
        if (disabled) return;
        const el = e.currentTarget;
        if (variant === 'primary') { el.style.background = 'var(--accent-violet)'; }
        else if (variant === 'ghost') { el.style.background = 'transparent'; el.style.color = 'var(--text-muted)'; }
        else { el.style.borderColor = 'var(--border-default)'; el.style.color = 'var(--text-muted)'; }
      }}
    >
      {icon && icon}
      {children}
    </button>
  );
}

// ── ProfileCard ──
interface ProfileCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: [string, string];
  selected: boolean;
  onClick: () => void;
}
export function ProfileCard({ id, name, description, icon, gradient, selected, onClick }: ProfileCardProps) {
  return (
    <button
      id={`profile-card-${id}`}
      onClick={onClick}
      style={{
        position: 'relative', width: '176px', padding: '16px', borderRadius: '12px',
        border: `2px solid ${selected ? 'var(--accent-violet)' : 'var(--border-default)'}`,
        background: selected ? 'rgba(124,58,237,0.08)' : 'rgba(26,29,38,0.5)',
        cursor: 'pointer', flexShrink: 0, transition: 'all 150ms ease-out',
        boxShadow: selected ? 'var(--shadow-md)' : 'none',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        opacity: selected ? 1 : 0.75, textAlign: 'left',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.opacity = '0.75';
          e.currentTarget.style.borderColor = 'var(--border-default)';
        }
      }}
      aria-pressed={selected}
      aria-label={`Select ${name} profile`}
    >
      {/* Checkmark */}
      {selected && (
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          width: '20px', height: '20px', borderRadius: '50%',
          background: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}

      {/* Icon */}
      <div style={{
        width: '48px', height: '48px', borderRadius: '10px', marginBottom: '12px',
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
        boxShadow: `0 4px 12px ${gradient[0]}40`,
      }}>
        {icon}
      </div>

      <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
        {name}
      </h3>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
        {description}
      </p>
    </button>
  );
}

// ── SkillLayerItem (for draggable list items) ──
interface SkillItemProps {
  id: string; name: string; category: string;
  isSelected?: boolean;
  onAdd?: () => void; onRemove?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  index?: number;
}
export function SkillItem({ id, name, category, isSelected, onAdd, onRemove, dragHandleProps, isDragging, index }: SkillItemProps) {
  const color = CATEGORY_COLORS[category] || 'var(--accent-violet)';
  return (
    <div
      id={`skill-item-${id}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
        borderRadius: '8px', border: `1px ${isSelected ? 'solid' : 'dashed'} ${isSelected ? 'var(--border-default)' : 'var(--border-default)'}`,
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
}

// ── LayerItem ──
interface LayerItemProps {
  id: string; name: string; type: string;
  isSelected?: boolean;
  onAdd?: () => void; onRemove?: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  index?: number;
}
export function LayerItem({ id, name, type, isSelected, onAdd, onRemove, dragHandleProps, isDragging, index }: LayerItemProps) {
  const color = LAYER_TYPE_COLORS[type] || 'var(--accent-violet)';
  return (
    <div
      id={`layer-item-${id}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px',
        borderRadius: '8px', borderLeft: `4px solid ${color}`,
        border: `1px solid ${isSelected ? 'var(--border-default)' : 'var(--border-default)'}`,
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
}
