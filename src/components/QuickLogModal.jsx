'use client'

import { useEffect, useRef, useState } from 'react'
import { getLocalDateString, getMealTimeFromHour } from '@/lib/timezone-utils'

const MEAL_OPTIONS = [
  { label: 'Breakfast', value: 'BREAKFAST', icon: '☀️', sub: 'Morning fuel' },
  { label: 'Lunch',     value: 'LUNCH',     icon: '🌤', sub: 'Midday meal'  },
  { label: 'Snack',     value: 'SNACK',     icon: '🍃', sub: 'Between meals' },
  { label: 'Dinner',    value: 'DINNER',    icon: '🌙', sub: 'Evening meal'  },
]

function clampServings(v) {
  return Math.min(10, Math.max(0.5, Math.round(v * 2) / 2))
}

function AnimatedCheck({ play }) {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: '#DCFCE7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 16,
      transform: play ? 'scale(1)' : 'scale(0)',
      transition: 'transform 0.42s cubic-bezier(0.34,1.56,0.64,1)',
    }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <polyline
          points="6,16 13,23 26,9"
          stroke="#16A34A" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            strokeDasharray: 32,
            strokeDashoffset: play ? 0 : 32,
            transition: play
              ? 'stroke-dashoffset 0.45s 0.18s cubic-bezier(0.4,0,0.2,1)'
              : 'none',
          }}
        />
      </svg>
    </div>
  )
}

function ServingRing({ servings }) {
  const CIRC = 2 * Math.PI * 20
  const dash  = Math.min(servings / 4, 1) * CIRC
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" style={{ flexShrink: 0 }}>
      <circle cx="27" cy="27" r="20" fill="none" stroke="#EDE9FE" strokeWidth="4.5" />
      <circle cx="27" cy="27" r="20" fill="none" stroke="#7C3AED" strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${CIRC}`}
        transform="rotate(-90 27 27)"
        style={{ transition: 'stroke-dasharray 0.35s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x="27" y="32" textAnchor="middle" fontSize="10" fontWeight="700"
        fill="#5B21B6" fontFamily="DM Mono,monospace">{servings}×</text>
    </svg>
  )
}

function Dots() {
  return (
    <span style={{ display: 'flex', gap: 4 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)', display: 'inline-block',
          animation: `qlDot 1.2s ${i * 0.2}s infinite`,
        }} />
      ))}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════ */
export default function QuickLogModal({ dish, isOpen, onClose, onSuccess }) {
  const [servings,  setServings]  = useState(1)
  const [mealTime,  setMealTime]  = useState(getMealTimeFromHour())
  const [notes,     setNotes]     = useState('')
  const [showNotes, setShowNotes] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // phase: 'closed' | 'entering' | 'open' | 'success' | 'exiting'
  const [phase, setPhase] = useState('closed')
  const noteRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setPhase('entering')
      const t = setTimeout(() => setPhase('open'), 20)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    if (showNotes) noteRef.current?.focus()
  }, [showNotes])

  useEffect(() => {
    if (phase === 'closed') {
      setServings(1)
      setMealTime(getMealTimeFromHour())
      setNotes('')
      setShowNotes(false)
      setLoading(false)
      setError('')
    }
  }, [phase])

  const dismiss = () => {
    setPhase('exiting')
    setTimeout(() => {
      setPhase('closed')
      onClose?.()
    }, 400)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/meal-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishId: dish.id,
          logDate: getLocalDateString(),
          mealTime, servings,
          notes: notes.trim() || undefined,
        }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Failed to log meal')
      onSuccess?.(payload.data)
      setPhase('success')
      setTimeout(() => dismiss(), 2800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (phase === 'closed') return null

  const isExiting = phase === 'exiting'
  const isSuccess = phase === 'success'

  const totalKcal = Math.round((dish.calories || 0) * servings)
  const totalProt = Math.round((dish.protein  || 0) * servings)
  const totalCarb = Math.round((dish.carbs    || 0) * servings)
  const totalFat  = Math.round((dish.fat      || 0) * servings)
  const mealLabel = MEAL_OPTIONS.find(m => m.value === mealTime)?.label ?? mealTime

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@800&family=DM+Mono:wght@500&display=swap');
        @keyframes qlDot { 0%,80%,100%{opacity:0} 40%{opacity:1} }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={!isSuccess ? dismiss : undefined}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(10,6,4,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          transition: 'opacity 0.35s ease',
          opacity: isExiting ? 0 : 1,
        }}
      />

      {/* Bottom sheet — full width on mobile, max 480px centered */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%', maxWidth: 480,
          background: '#FDFAF7',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          pointerEvents: 'auto',
          position: 'relative',
          transform: isExiting || phase === 'entering'
            ? 'translateY(100%)'
            : 'translateY(0)',
          opacity: isExiting || phase === 'entering' ? 0 : 1,
          transition: isExiting
            ? 'transform 0.38s cubic-bezier(0.4,0,1,1), opacity 0.3s ease'
            : 'transform 0.44s cubic-bezier(0.34,1.2,0.64,1), opacity 0.32s ease',
        }}>

          <div style={{ height: 3, background: 'linear-gradient(90deg,#7C3AED,#A855F7,#C084FC)' }} />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 2px' }}>
            <div style={{ width: 38, height: 4, borderRadius: 99, background: '#DDD6FE' }} />
          </div>

          <div style={{ padding: '18px 20px 36px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: '#EDE9FE', borderRadius: 99, padding: '3px 9px', marginBottom: 7,
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7C3AED' }} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: '#5B21B6',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    fontFamily: '"DM Mono", monospace',
                  }}>Quick Log</span>
                </div>
                <h2 style={{
                  margin: 0, fontSize: 20, fontWeight: 800, color: '#1C1110',
                  fontFamily: '"Playfair Display", Georgia, serif', lineHeight: 1.2,
                }}>{dish.name}</h2>
                {dish.nameUrdu && (
                  <p style={{ fontSize: 13, color: '#A8A29E', direction: 'rtl', lineHeight: 1.8, margin: '2px 0 0' }}>
                    {dish.nameUrdu}
                  </p>
                )}
              </div>
              <button
                onClick={!isSuccess ? dismiss : undefined}
                style={{
                  width: 30, height: 30, borderRadius: '50%', border: 'none',
                  background: '#F5F0EB', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#78716C', fontSize: 14, flexShrink: 0, marginLeft: 10,
                }}
              >✕</button>
            </div>

            {/* Nutrition strip — updates live as servings change */}
            <div style={{
              display: 'flex', gap: 6, padding: '12px 0', marginBottom: 18,
              borderTop: '1px solid #F0EBE5', borderBottom: '1px solid #F0EBE5',
            }}>
              {[
                { val: totalKcal,       lbl: 'kcal',    color: '#7C3AED' },
                { val: `${totalProt}g`, lbl: 'protein', color: '#0891B2' },
                { val: `${totalCarb}g`, lbl: 'carbs',   color: '#D97706' },
                { val: `${totalFat}g`,  lbl: 'fat',     color: '#DC2626' },
              ].map(n => (
                <div key={n.lbl} style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  background: n.color + '12', border: `1px solid ${n.color}22`,
                  borderRadius: 10, padding: '7px 4px',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: n.color, fontFamily: '"DM Mono",monospace', transition: 'all 0.25s' }}>{n.val}</span>
                  <span style={{ fontSize: 8, color: '#8B7E74', marginTop: 2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{n.lbl}</span>
                </div>
              ))}
            </div>

            {/* Form (fades/shrinks away when success) */}
            <form onSubmit={handleSubmit} style={{
              transition: 'opacity 0.28s ease, transform 0.28s ease',
              opacity:    isSuccess ? 0 : 1,
              transform:  isSuccess ? 'scale(0.96)' : 'scale(1)',
              pointerEvents: isSuccess ? 'none' : 'auto',
            }}>

              {/* Servings */}
              <span style={secLblStyle}>Servings</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <ServingRing servings={servings} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <button type="button" onClick={() => setServings(v => clampServings(v - 0.5))} style={stepStyle}>−</button>
                  <input
                    type="number" min="0.5" max="10" step="0.5" value={servings}
                    onChange={e => setServings(clampServings(Number(e.target.value) || 0.5))}
                    style={numInputStyle}
                  />
                  <button type="button" onClick={() => setServings(v => clampServings(v + 0.5))} style={stepStyle}>+</button>
                </div>
              </div>

              {/* Meal time */}
              <span style={secLblStyle}>Meal time</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 16 }}>
                {MEAL_OPTIONS.map(opt => {
                  const sel = mealTime === opt.value
                  return (
                    <button key={opt.value} type="button" onClick={() => setMealTime(opt.value)} style={{
                      borderRadius: 14, padding: '10px 11px',
                      border: `1.5px solid ${sel ? '#7C3AED' : '#E7E5E4'}`,
                      background: sel ? '#7C3AED' : '#FFFEF9',
                      cursor: 'pointer', textAlign: 'left',
                      boxShadow: sel ? '0 4px 14px rgba(124,58,237,0.28)' : 'none',
                      transform: sel ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s cubic-bezier(0.34,1.4,0.64,1)',
                    }}>
                      <div style={{ fontSize: 16, marginBottom: 2 }}>{opt.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: sel ? '#fff' : '#44403C' }}>{opt.label}</div>
                      <div style={{ fontSize: 9, color: sel ? 'rgba(255,255,255,0.7)' : '#A8A29E', marginTop: 1 }}>{opt.sub}</div>
                    </button>
                  )
                })}
              </div>

              {/* Notes */}
              <div style={{ marginBottom: 16 }}>
                {!showNotes ? (
                  <button type="button" onClick={() => setShowNotes(true)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#7C3AED', fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 5, padding: 0,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round">
                      <line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" />
                    </svg>
                    Add a note
                  </button>
                ) : (
                  <input
                    ref={noteRef} type="text" value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="e.g. homemade, less salt…"
                    style={{
                      width: '100%', height: 42, borderRadius: 13,
                      border: '1.5px solid #DDD6FE', background: '#F5F3FF',
                      padding: '0 14px', fontSize: 13, color: '#1C1110', outline: 'none',
                    }}
                  />
                )}
              </div>

              {error && (
                <div style={{
                  background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 11,
                  padding: '9px 13px', fontSize: 12, color: '#B91C1C', marginBottom: 13,
                }}>⚠ {error}</div>
              )}

              <div style={{ display: 'flex', gap: 9 }}>
                <button type="button" onClick={dismiss} style={cancelStyle}>Cancel</button>
                <button type="submit" disabled={loading} style={{
                  ...submitStyle,
                  background: loading ? '#A78BFA' : '#7C3AED',
                  boxShadow: loading ? 'none' : '0 4px 18px rgba(124,58,237,0.38)',
                  cursor: loading ? 'default' : 'pointer',
                }}>
                  {loading ? (
                    <><Dots /><span style={{ marginLeft: 6 }}>Saving…</span></>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                        <line x1="7" y1="1" x2="7" y2="13" /><line x1="1" y1="7" x2="13" y2="7" />
                      </svg>
                      Log meal
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* ── SUCCESS STATE ─────────────────────────────────
                Absolutely covers the form area; slides up into view.
                The sheet itself stays open — it only slides out after
                the user taps Done or the 2.8 s auto-dismiss fires.     */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: '#FDFAF7',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '32px 24px 40px',
              zIndex: 10,
              opacity:    isSuccess ? 1 : 0,
              transform:  isSuccess ? 'translateY(0)' : 'translateY(28px)',
              pointerEvents: isSuccess ? 'auto' : 'none',
              transition: 'opacity 0.38s ease, transform 0.4s cubic-bezier(0.34,1.2,0.64,1)',
            }}>
              <AnimatedCheck play={isSuccess} />

              <p style={{
                fontSize: 20, fontWeight: 800, color: '#15803D',
                fontFamily: '"Playfair Display", serif', margin: '0 0 6px',
              }}>Meal logged!</p>

              <p style={{
                fontSize: 12, color: '#78716C', textAlign: 'center',
                lineHeight: 1.6, margin: '0 0 16px', maxWidth: 220,
              }}>
                {dish.name} · {servings} serving{servings !== 1 ? 's' : ''} · {mealLabel}
              </p>

              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
                {[
                  { txt: `+${totalKcal} kcal`,   bg: '#DCFCE7', color: '#15803D' },
                  { txt: `${totalProt}g protein`, bg: '#E0F2FE', color: '#0369A1' },
                  { txt: mealLabel,               bg: '#EDE9FE', color: '#5B21B6' },
                ].map(c => (
                  <span key={c.txt} style={{
                    borderRadius: 99, padding: '5px 12px',
                    background: c.bg, color: c.color,
                    fontSize: 12, fontWeight: 700, fontFamily: '"DM Mono",monospace',
                  }}>{c.txt}</span>
                ))}
              </div>

              <div style={{ width: '100%', marginBottom: 8 }}>
                <div style={{ background: '#F5F0EB', borderRadius: 99, height: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    background: 'linear-gradient(90deg,#7C3AED,#A855F7)',
                    width: isSuccess ? '68%' : '0%',
                    transition: 'width 1.1s 0.3s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
                <p style={{ fontSize: 10, color: '#A8A29E', textAlign: 'center', marginTop: 6, letterSpacing: '0.04em' }}>
                  68% of daily calorie goal
                </p>
              </div>

              <button onClick={dismiss} style={{ ...submitStyle, marginTop: 18, width: '100%', flex: 'none' }}>
                Done
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

const stepStyle = {
  width: 44, height: 44, borderRadius: 13,
  border: '1.5px solid #DDD6FE', background: '#F5F3FF',
  color: '#7C3AED', fontSize: 20, fontWeight: 300,
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, transition: 'all 0.15s',
}
const numInputStyle = {
  flex: 1, height: 44, borderRadius: 13,
  border: '1.5px solid #E7E5E4', background: '#fff',
  textAlign: 'center', fontSize: 18, fontWeight: 700,
  color: '#1C1110', fontFamily: '"DM Mono",monospace', outline: 'none',
}
const secLblStyle = {
  display: 'block', fontSize: 9, fontWeight: 700, color: '#A8A29E',
  letterSpacing: '0.14em', textTransform: 'uppercase',
  fontFamily: '"DM Mono",monospace', marginBottom: 9,
}
const cancelStyle = {
  flex: 1, height: 50, borderRadius: 15,
  border: '1.5px solid #E7E5E4', background: '#fff',
  fontSize: 13, fontWeight: 600, color: '#57534E', cursor: 'pointer',
  transition: 'all 0.15s',
}
const submitStyle = {
  flex: 2, height: 50, borderRadius: 15, border: 'none',
  background: '#7C3AED', color: '#fff',
  fontSize: 13, fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  boxShadow: '0 4px 18px rgba(124,58,237,0.38)',
  letterSpacing: '0.02em', transition: 'all 0.2s',
}
