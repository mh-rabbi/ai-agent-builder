import type { ReactNode } from 'react';

interface Props {
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
}: Props) {
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
