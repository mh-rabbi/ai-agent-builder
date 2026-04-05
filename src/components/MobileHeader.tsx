

interface Props {
  onToggleLeft: () => void;
  onToggleRight: () => void;
  isLeftOpen: boolean;
  isPreviewOpen: boolean;
}

export default function MobileHeader({ onToggleLeft, onToggleRight, isLeftOpen, isPreviewOpen }: Props) {
  return (
    <header style={{
      height: '60px',
      width: '100%',
      background: 'var(--bg-surface-1)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onToggleLeft}
          style={{
            background: isLeftOpen ? 'var(--bg-surface-2)' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isLeftOpen ? 'var(--accent-violet-light)' : 'var(--text-primary)',
          }}
          aria-label="Toggle agents list"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: 'var(--accent-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-heading)' }}>Agent Builder</span>
        </div>
      </div>

      <button
        onClick={onToggleRight}
        style={{
          background: isPreviewOpen ? 'var(--bg-surface-2)' : 'transparent',
          border: 'none',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          color: isPreviewOpen ? 'var(--accent-violet-light)' : 'var(--text-primary)',
          transition: 'all 200ms',
        }}
        aria-label="Toggle preview"
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 500 }} className="mobile-hide">Preview</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
    </header>
  );
}
