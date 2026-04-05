import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  variant?: 'default' | 'category' | 'type' | 'provider';
  color?: string;
  style?: React.CSSProperties;
}

export function Badge({ children, variant = 'default', color, style }: Props) {
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

export function CategoryDot({ color }: { color: string }) {
  return (
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, display: 'inline-block' }} />
  );
}
