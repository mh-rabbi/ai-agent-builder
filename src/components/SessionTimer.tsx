import { useState, useEffect } from 'react'

/** FIX-4 + FIX-11: Timer isolated from App tree; no inline styles. */
export default function SessionTimer() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setT(p => p + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const m = Math.floor(t / 60), s = t % 60
  return <>{m > 0 ? `${m}m ${s}s` : `${s}s`}</>
}
