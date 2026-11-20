import React, { useEffect, useRef, useState } from 'react'
import { AudioLines, VolumeX } from 'lucide-react'
export default function AudioToggle() {
  const audio = useRef<AudioContext | null>(null),
    [playing, setPlaying] = useState(false),
    [failed, setFailed] = useState(false)
  useEffect(
    () => () => {
      void audio.current?.close()
    },
    [],
  )
  async function toggle() {
    try {
      if (!audio.current) {
        const ac = new AudioContext()
        audio.current = ac
        const master = ac.createGain()
        master.gain.value = 0.12
        master.connect(ac.destination)
        const noise = ac.createBuffer(1, ac.sampleRate * 5, ac.sampleRate),
          wave = noise.getChannelData(0)
        let previous = 0
        for (let i = 0; i < wave.length; i++) {
          previous = (previous + 0.023 * (Math.random() * 2 - 1)) / 1.023
          wave[i] = previous * 4
        }
        const surf = ac.createBufferSource()
        surf.buffer = noise
        surf.loop = true
        const filter = ac.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.value = 820
        surf.connect(filter)
        filter.connect(master)
        surf.start()
        const swell = ac.createOscillator(),
          gain = ac.createGain()
        swell.frequency.value = 0.105
        gain.gain.value = 290
        swell.connect(gain)
        gain.connect(filter.frequency)
        swell.start()
        for (const f of [110, 164.81, 207.65, 246.94]) {
          const osc = ac.createOscillator(),
            level = ac.createGain()
          osc.type = 'sine'
          osc.frequency.value = f
          level.gain.value = 0.045
          osc.connect(level)
          level.connect(master)
          osc.start()
        }
      }
      if (playing) await audio.current.suspend()
      else await audio.current.resume()
      setPlaying(!playing)
    } catch {
      setFailed(true)
    }
  }
  return (
    <button
      className={'sound control ' + (playing ? 'on' : '')}
      aria-label={playing ? 'Mute ambient sound' : 'Enable ambient sound'}
      aria-pressed={playing}
      disabled={failed}
      onClick={toggle}
    >
      {playing ? <AudioLines size={17} /> : <VolumeX size={17} />}
      <span>{failed ? 'Unavailable' : playing ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}
