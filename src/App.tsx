import React, { useState, useEffect, useRef } from 'react'
import {
  Play,
  Compass,
  MapPin,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  Menu,
  X,
  Globe2,
  Scan,
  Sun,
  Moon,
  Maximize2,
  GalleryHorizontalEnd,
  Film,
  ExternalLink,
  Check,
  Crosshair,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { regions, people, cars, trailers, official } from './data'
import { usePreferences, Preset, reduced } from './store'
import Photo from './Photo'
import AudioToggle from './AudioToggle'
import { mark } from './artwork'
import Dialog, { frames, Overlay } from './Dialog'
gsap.registerPlugin(ScrollTrigger)
const nav = [
  ['home', 'Home'],
  ['vice', 'Vice City'],
  ['characters', 'Characters'],
  ['world', 'World'],
  ['vehicles', 'Vehicles'],
  ['media', 'Media'],
]
const slides = [
  { image: 'waterfront-sunset', place: 'Vice City', area: 'Oceanfront promenade' },
  { image: 'hero', place: 'Ocean Drive', area: 'Art Deco boulevard' },
  { image: 'keys', place: 'Leonida Keys', area: 'Southern coast' },
  { image: 'grassrivers', place: 'Grassrivers', area: 'Southern wetlands' },
]
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow">
      <b />
      {children}
    </span>
  )
}
function Round({
  prev = false,
  action,
  label,
  disabled = false,
}: {
  prev?: boolean
  action: () => void
  label: string
  disabled?: boolean
}) {
  return (
    <button className="icon-btn" onClick={action} aria-label={label} disabled={disabled}>
      {prev ? <ChevronLeft /> : <ChevronRight />}
    </button>
  )
}
function Mark() {
  return <img className="brand-mark" src={mark()} alt="VI" />
}
function Header({ active }: { active: string }) {
  const [menu, setMenu] = useState(false),
    [settings, setSettings] = useState(false),
    preset = usePreferences((s) => s.preset),
    setPreset = usePreferences((s) => s.setPreset),
    head = useRef<HTMLElement>(null)
  useEffect(() => {
    function off(e: PointerEvent) {
      if (!head.current?.contains(e.target as Node)) {
        setMenu(false)
        setSettings(false)
      }
    }
    function key(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenu(false)
        setSettings(false)
      }
    }
    document.addEventListener('pointerdown', off)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', off)
      document.removeEventListener('keydown', key)
    }
  }, [])
  return (
    <header className={'topbar ' + (active === 'home' ? 'over-hero' : '')} ref={head}>
      <div className="nav-inner">
        <a href="#home" className="brand" aria-label="Grand Theft Auto VI home">
          <Mark />
        </a>
        <nav aria-label="Main navigation" className={menu ? 'open' : ''}>
          {nav.map(([id, name]) => (
            <a
              href={'#' + id}
              key={id}
              className={id === active ? 'active' : ''}
              aria-current={id === active ? 'location' : undefined}
              onClick={() => setMenu(false)}
            >
              {name}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <AudioToggle />
          <button
            className={'icon-btn settings ' + (settings ? 'selected' : '')}
            aria-label="Image quality settings"
            aria-expanded={settings}
            onClick={() => {
              setSettings(!settings)
              setMenu(false)
            }}
          >
            <SlidersHorizontal size={17} />
          </button>
          <button
            className="icon-btn hamburger"
            aria-label="Navigation menu"
            aria-expanded={menu}
            onClick={() => {
              setMenu(!menu)
              setSettings(false)
            }}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {settings && (
        <div className="settings-panel">
          <h3>Image quality</h3>
          {(['Low', 'High', 'Ultra'] as Preset[]).map((v, i) => (
            <button key={v} onClick={() => setPreset(v)} aria-pressed={preset === v}>
              <span>
                <b>{['Data saver', 'Balanced', 'Original'][i]}</b>
                <small>
                  {['Smaller image files', 'Medium-resolution images', 'Full-resolution images'][i]}
                </small>
              </span>
              {v === preset && <Check size={17} />}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
function Hero({ open }: { open: (v: NonNullable<Overlay>) => void }) {
  const [index, setIndex] = useState(0),
    slide = slides[index]
  return (
    <section id="home" className="hero stage" aria-label="Welcome to Leonida">
      <div className="photo-frame hero-frame">
        <Photo
          key={slide.image}
          className="frame-photo"
          photo={slide.image}
          alt={slide.area + ', ' + slide.place}
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="hero-shade" />
      <div className="hero-copy">
        <Label>Grand Theft Auto VI</Label>
        <h1>
          <span>Welcome to</span>
          <strong>Leonida</strong>
        </h1>
        <p className="tagline">Paradise has a price.</p>
        <div className="actions">
          <button className="button primary" onClick={() => open({ kind: 'trailer', index: 0 })}>
            <Play size={16} fill="currentColor" /> Watch trailer
          </button>
          <a href="#world" className="button secondary">
            <Compass size={17} /> Explore the world
          </a>
        </div>
      </div>
      <div className="hero-foot">
        <div className="location-stamp">
          <MapPin size={19} />
          <div>
            <small>On location</small>
            <b>{slide.place}, Leonida</b>
          </div>
        </div>
        <a className="scroll-hint" href="#world">
          <span className="mouse" />
          Scroll to explore
        </a>
        <div className="hero-steps">
          <span className="slide-readout">
            <b>{String(index + 1).padStart(2, '0')}</b> / {String(slides.length).padStart(2, '0')}
          </span>
          <Round
            prev
            label="Previous hero scene"
            action={() => setIndex((index + slides.length - 1) % slides.length)}
          />
          <Round label="Next hero scene" action={() => setIndex((index + 1) % slides.length)} />
        </div>
      </div>
    </section>
  )
}
function World({ open }: { open: (v: NonNullable<Overlay>) => void }) {
  const track = useRef<HTMLDivElement>(null),
    [edges, setEdges] = useState([true, false])
  function update() {
    const e = track.current
    if (e) setEdges([e.scrollLeft < 4, e.scrollLeft + e.clientWidth >= e.scrollWidth - 4])
  }
  useEffect(() => {
    const e = track.current!
    const ob = new ResizeObserver(update)
    ob.observe(e)
    return () => ob.disconnect()
  }, [])
  function scroll(d: number) {
    const el = track.current!
    el.scrollBy({
      left: d * ((el.firstElementChild as HTMLElement).clientWidth + 18),
      behavior: reduced() ? 'instant' : 'smooth',
    })
  }
  return (
    <section id="world" className="world stage wrap">
      <div className="section-heading">
        <div>
          <Label>World guide</Label>
          <h2>
            Explore Leonida<span>.</span>
          </h2>
        </div>
        <div className="pager">
          <Round prev action={() => scroll(-1)} label="Previous locations" disabled={edges[0]} />
          <Round action={() => scroll(1)} label="Next locations" disabled={edges[1]} />
        </div>
      </div>
      <div className="world-track" ref={track} onScroll={update}>
        {regions.map((r, i) => (
          <button key={r.id} className="world-card" onClick={() => open({ kind: 'region', index: i })}>
            <Photo photo={r.id} alt="" />
            <div className="card-shade" />
            <span className="card-open">
              <Maximize2 size={15} />
            </span>
            <div className="card-caption">
              <small>{r.area}</small>
              <h3>{r.name}</h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
const spots = [
  {
    title: 'Oceanfront',
    desc: 'The waterfront turns rose gold as the sun goes down.',
    image: 'waterfront-sunset',
  },
  {
    title: 'Art Deco boulevard',
    desc: 'Pastel hotels switch on their neon one floor at a time.',
    image: 'vice-city',
  },
  { title: 'Downtown', desc: 'Lights come on in the towers above the bay.', image: 'skyline-night' },
]
function City() {
  const [night, setNight] = useState(0.25),
    [spot, setSpot] = useState<number | null>(null),
    manual = useRef(false),
    ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (reduced()) return
    const t = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      end: 'bottom 30%',
      onUpdate: (s) => {
        if (!manual.current) setNight(0.12 + s.progress * 0.82)
      },
    })
    return () => t.kill()
  }, [])
  return (
    <section className="city stage wrap" id="vice" ref={ref}>
      <div className="section-heading">
        <div>
          <Label>Vice City</Label>
          <h2>
            The city never sleeps<span>.</span>
          </h2>
        </div>
      </div>
      <div className="city-screen">
        <div className="photo-frame waterfront">
          <Photo className="frame-photo" photo="waterfront-sunset" alt="The Vice City waterfront at sunset" />
          <Photo
            className="frame-photo"
            photo="waterfront-night"
            alt="The same waterfront after dark"
            style={{ clipPath: 'inset(0 0 0 ' + (1 - night) * 100 + '%)' }}
          />
          {night > 0 && night < 1 && (
            <span aria-hidden="true" className="night-divider" style={{ left: (1 - night) * 100 + '%' }} />
          )}
        </div>
        <div className="city-label">
          Vice City <span> / </span> Waterfront
        </div>
        {spots.map((s, i) => (
          <div
            key={s.title}
            className={'hotspot spot' + i}
            onMouseEnter={() => setSpot(i)}
            onMouseLeave={() => setSpot(null)}
          >
            <button
              className="spot-button"
              aria-label={s.title}
              aria-expanded={spot === i}
              onClick={() => setSpot(i)}
              onFocus={() => setSpot(i)}
              onBlur={() => setSpot(null)}
            >
              <Crosshair size={19} />
            </button>
            {spot === i && (
              <div className="spot-info">
                <Photo photo={s.image} alt="" />
                <b>{s.title}</b>
                <p>{s.desc}</p>
              </div>
            )}
          </div>
        ))}
        <label className="night-slider">
          <Sun size={16} />
          <input
            aria-label="Sunset to night"
            aria-valuetext={Math.round(night * 100) + '% night view'}
            type="range"
            min="0"
            max="100"
            value={Math.round(night * 100)}
            onChange={(e) => {
              manual.current = true
              setNight(+e.target.value / 100)
            }}
          />
          <Moon size={15} />
        </label>
      </div>
    </section>
  )
}
function Characters() {
  const [id, set] = useState(0),
    p = people[id]
  return (
    <section id="characters" className="character stage">
      <div className="character-art" key={p.id}>
        <Photo className="frame-photo" photo={p.id} alt={p.name} />
      </div>
      <div className="character-mask" />
      <div className="character-copy">
        <Label>Meet the characters</Label>
        <h2 key={p.name}>
          {p.name.split(' ')[0]}
          <br />
          <em>{p.name.split(' ')[1]}</em>
        </h2>
        <p>{p.bio}</p>
        <div className="segmented">
          {people.map((q, i) => (
            <button aria-pressed={id === i} key={q.id} onClick={() => set(i)}>
              {q.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
function Vehicles({ open }: { open: (v: NonNullable<Overlay>) => void }) {
  const [id, set] = useState(0),
    [angle, setAngle] = useState<'front' | 'rear'>('front'),
    car = cars[id]
  const shot = car.id + '-' + angle
  return (
    <section id="vehicles" className="vehicles stage wrap">
      <div className="section-heading">
        <div>
          <Label>Automotive culture</Label>
          <h2>
            After hours garage<span>.</span>
          </h2>
        </div>
      </div>
      <div className="garage">
        <Photo
          key={shot}
          className="frame-photo garage-photo"
          photo={shot}
          alt={car.name + ', ' + angle + ' three-quarter view'}
        />
        <div className="garage-top">
          <span className="eyebrow">Original vehicle concept</span>
          <div className="segmented angle-picker" role="group" aria-label="Camera angle">
            {(['front', 'rear'] as const).map((a) => (
              <button key={a} aria-pressed={angle === a} onClick={() => setAngle(a)}>
                {a === 'front' ? 'Front view' : 'Rear view'}
              </button>
            ))}
          </div>
        </div>
        <div className="garage-info">
          <div>
            <p>{car.type}</p>
            <h3>{car.name}</h3>
          </div>
          <div className="pager">
            <button
              className="icon-btn"
              aria-label="Enlarge vehicle photo"
              onClick={() => open({ kind: 'gallery', index: frames.findIndex((f) => f.id === shot) })}
            >
              <Maximize2 size={16} />
            </button>
            <Round prev action={() => set((id + cars.length - 1) % cars.length)} label="Previous vehicle" />
            <Round action={() => set((id + 1) % cars.length)} label="Next vehicle" />
          </div>
        </div>
      </div>
    </section>
  )
}
function Media({ open }: { open: (v: NonNullable<Overlay>) => void }) {
  const [tab, setTab] = useState(0)
  return (
    <section className="media stage wrap" id="media">
      <div className="section-heading">
        <div>
          <Label>Media collection</Label>
          <h2>
            Screening room<span>.</span>
          </h2>
        </div>
        <div className="segmented">
          {['Trailers', 'Gallery'].map((t, i) => (
            <button key={t} aria-pressed={tab === i} onClick={() => setTab(i)}>
              {i ? <GalleryHorizontalEnd size={15} /> : <Film size={15} />} {t}
            </button>
          ))}
        </div>
      </div>
      {tab === 0 ? (
        <div className="trailer-grid">
          {trailers.map((t, i) => (
            <button className="film-card" key={t.id} onClick={() => open({ kind: 'trailer', index: i })}>
              <Photo photo={t.image} alt="" />
              <span className="film-play">
                <Play fill="currentColor" />
              </span>
              <div>
                <small>Rockstar Games</small>
                <h3>{t.name}</h3>
              </div>
              <time>{t.time}</time>
            </button>
          ))}
        </div>
      ) : (
        <div className="gallery-track">
          {frames.map((f, i) => (
            <button key={f.id} onClick={() => open({ kind: 'gallery', index: i })}>
              <Photo photo={f.id} alt={f.name} />
              <span>
                {f.name}
                <Scan size={16} />
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
export default function App() {
  const [active, setActive] = useState('home'),
    [overlay, setOverlay] = useState<Overlay>(null)
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section.stage[id]'))
    function update() {
      const y = scrollY + innerHeight * 0.34
      let current = sections[0]
      for (const el of sections) {
        if (el.offsetTop <= y) current = el
      }
      setActive(current.id)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        y: 9,
        opacity: 0.9,
        stagger: 0.07,
        duration: 0.6,
        delay: 0.04,
        ease: 'power3.out',
      })
      gsap.utils.toArray<HTMLElement>('.section-heading h2').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 97%', once: true },
          y: 16,
          duration: 0.65,
          opacity: 0.45,
        })
      })
    })
    return () => ctx.revert()
  }, [])
  return (
    <>
      <a className="skip" href="#world">
        Skip to world guide
      </a>
      <Header active={active} />
      <main>
        <Hero open={setOverlay} />
        <World open={setOverlay} />
        <City />
        <Characters />
        <Vehicles open={setOverlay} />
        <Media open={setOverlay} />
        <section className="finale">
          <Photo
            className="frame-photo"
            photo="skyline-night"
            alt="The lights of Vice City and its bay at night"
          />
          <div className="finale-tint" />
          <div className="finale-content">
            <Label>Grand Theft Auto VI</Label>
            <h2>Welcome to Leonida</h2>
            <div className="actions">
              <button className="button primary" onClick={() => setOverlay({ kind: 'trailer', index: 0 })}>
                <Play size={16} fill="currentColor" />
                Watch official trailer
              </button>
              <a className="button secondary" href={official} rel="noreferrer" target="_blank">
                <Globe2 size={16} />
                Visit official website
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <a href="#home" className="brand" aria-label="Back to top">
          <Mark />
        </a>
        <p>
          Unofficial, fan-made promotional concept. AI-generated imagery and fictional vehicle designs. Grand
          Theft Auto is a trademark of Rockstar Games.
        </p>
        <a href={official} target="_blank" rel="noreferrer">
          Rockstar Games <ExternalLink size={14} />
        </a>
      </footer>
      {overlay && <Dialog value={overlay} change={setOverlay} close={() => setOverlay(null)} />}
      <Pointer />
    </>
  )
}
function Pointer() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches || reduced()) return
    const el = ref.current!
    function move(e: PointerEvent) {
      const button = (e.target as Element).closest('.world-card,.film-card,.gallery-track button')
      el.classList.toggle('visible', !!button)
      el.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)'
    }
    document.addEventListener('pointermove', move)
    return () => document.removeEventListener('pointermove', move)
  }, [])
  return (
    <div className="pointer" ref={ref} aria-hidden="true">
      <Maximize2 size={15} />
    </div>
  )
}
