import type { Toast } from '../types';
import { useEffect, useRef } from 'react';

interface Props {
  toast: Toast | null;
  onClose: () => void;
}

export default function ToastNotification({ toast, onClose }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!toast) return;
    timerRef.current = setTimeout(onClose, 4000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const color = isSuccess ? 'var(--accent-success)' : 'var(--accent-danger)';
  const bgColor = isSuccess ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)';
  const borderColor = isSuccess ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)';

  return (
    <div
      className="animate-slide-in-bottom"
      style={{
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px', borderRadius: '12px', overflow: 'hidden',
        background: bgColor, border: `1px solid ${borderColor}`,
        boxShadow: 'var(--shadow-xl)', minWidth: '288px',
        backdropFilter: 'blur(8px)',
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Dot */}
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />

      {/* Message */}
      <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>
        {toast.message}
      </p>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
          padding: '2px', borderRadius: '4px', transition: 'color 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, height: '2px',
          background: color, animation: 'toast-progress 4s linear forwards',
        }}
      />
      <style>{`@keyframes toast-progress { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}
