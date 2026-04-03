import { useState, useEffect } from 'react'

/**
 * FIX-4 (PERF-2): Isolated session timer.
 * Moving sessionTime state here means the 1-second setInterval only
 * re-renders this tiny component — not the entire App tree.
 */
export default function SessionTimer() {
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <span>Session Active: {sessionTime}s</span>
}
