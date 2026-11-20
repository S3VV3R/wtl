import { create } from 'zustand'
export type Preset = 'Low' | 'High' | 'Ultra'
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const auto = (): Preset => {
  const connection = (navigator as Navigator & { connection?: { saveData: boolean } }).connection
  return connection?.saveData ? 'Low' : innerWidth <= 760 ? 'High' : 'Ultra'
}
function initial(): Preset {
  try {
    const p = localStorage.getItem('leonida.graphics')
    if (p === 'Low' || p === 'High' || p === 'Ultra') return p
  } catch {}
  return auto()
}
export const usePreferences = create<{ preset: Preset; setPreset: (p: Preset) => void }>((set) => ({
  preset: initial(),
  setPreset: (p) => {
    try {
      localStorage.setItem('leonida.graphics', p)
    } catch {}
    set({ preset: p })
  },
}))
