interface Props {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: [string, string];
  selected: boolean;
  onClick: () => void;
}

export function ProfileCard({ id, name, description, icon, gradient, selected, onClick }: Props) {
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
