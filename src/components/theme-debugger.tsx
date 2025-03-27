'use client'

import { useEffect, useState } from 'react'

export function ThemeDebugger() {
  const [vars, setVars] = useState<Record<string, string>>({})

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement)
    const keys = [
      '--primary',
      '--primary-foreground',
      '--ring',
      '--radius',
      '--background',
      '--foreground',
    ]

    const extracted: Record<string, string> = {}
    keys.forEach((key) => {
      extracted[key] = computed.getPropertyValue(key).trim()
    })

    setVars(extracted)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace',
        maxWidth: '300px',
        lineHeight: '1.5',
      }}
    >
      <strong style={{ fontSize: '13px', display: 'block', marginBottom: 4 }}>
        🎨 Theme Debugger
      </strong>
      {Object.entries(vars).map(([key, value]) => (
        <div key={key}>
          <span style={{ color: '#9f9' }}>{key}</span>: {value}
        </div>
      ))}
    </div>
  )
}
