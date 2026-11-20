import React, { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react'
import { cars, regions, trailers, people } from './data'
import Photo from './Photo'
export type Overlay = { kind: 'trailer' | 'gallery' | 'region'; index: number } | null
export const frames = [
  { id: 'hero', name: 'Ocean Drive at dusk' },
  ...regions.map((r) => ({ id: r.id, name: r.id === 'kalaga' ? 'Mount Kalaga National Park' : r.name })),
  ...people.map((p) => ({ id: p.id, name: p.name })),
  { id: 'waterfront-sunset', name: 'The waterfront at sunset' },
  { id: 'waterfront-night', name: 'The waterfront at night' },
  { id: 'skyline-night', name: 'Vice City after hours' },
  ...cars.flatMap((car) =>
    ['front', 'rear'].map((angle) => ({
      id: car.id + '-' + angle,
      name: car.name + ' · ' + angle + ' view',
    })),
  ),
]
export default function Dialog({
  value,
  close,
  change,
}: {
  value: NonNullable<Overlay>
  close: () => void
  change: (v: NonNullable<Overlay>) => void
}) {
  const { kind, index } = value,
    dlg = useRef<HTMLDialogElement>(null),
    touch = useRef(0),
    [zoom, setZoom] = useState(false),
    [loaded, setLoaded] = useState(false)
  const count = kind === 'region' ? regions.length : kind === 'gallery' ? frames.length : trailers.length
  function step(dir: number) {
    change({ kind, index: (index + dir + count) % count })
  }
  useEffect(() => {
    const e = dlg.current!,
      old = document.body.style.overflow
    e.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      e.close()
      document.body.style.overflow = old
    }
  }, [])
  useEffect(() => {
    setZoom(false)
    setLoaded(false)
  }, [index, kind])
  const title =
    kind === 'region' ? regions[index].name : kind === 'gallery' ? frames[index].name : trailers[index].name
  return (
    <dialog
      ref={dlg}
      className={'viewer ' + kind}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          step(-1)
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          step(1)
        }
      }}
    >
      <div className="viewer-inner">
        <div className="viewer-top">
          <span className="eyebrow">
            {kind === 'region' ? 'Location guide' : kind === 'trailer' ? 'Official trailer' : 'Gallery'}
          </span>
          <button className="icon-btn" onClick={close} aria-label="Close viewer" autoFocus>
            <X />
          </button>
        </div>
        <div
          className={'viewer-media ' + (zoom ? 'zoomed' : '')}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touch.current
            if (!zoom && Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
          }}
        >
          {kind === 'trailer' ? (
            <>
              <iframe
                key={index}
                src={'https://www.youtube-nocookie.com/embed/' + trailers[index].id + '?autoplay=1&rel=0'}
                title={'Grand Theft Auto VI — ' + title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setLoaded(true)}
              />
              {!loaded && <span className="loading-video">Connecting to player…</span>}
            </>
          ) : kind === 'gallery' ? (
            <>
              <Photo photo={frames[index].id} alt={title} loading="eager" />
              <button
                className="icon-btn zoom-btn"
                onClick={() => setZoom(!zoom)}
                aria-label={zoom ? 'Zoom out' : 'Zoom in'}
              >
                {zoom ? <ZoomOut /> : <ZoomIn />}
              </button>
            </>
          ) : (
            <Photo photo={regions[index].id} alt={title} loading="eager" />
          )}
        </div>
        <div className="viewer-bottom">
          <div>
            <h2>{title}</h2>
            {kind === 'region' && <p>{regions[index].desc}</p>}
            {kind === 'trailer' && (
              <a
                className="inline-link"
                href={'https://www.youtube.com/watch?v=' + trailers[index].id}
                target="_blank"
                rel="noreferrer"
              >
                Watch on YouTube <ExternalLink size={14} />
              </a>
            )}
          </div>
          <div className="pager">
            <button className="icon-btn" aria-label="Previous item" onClick={() => step(-1)}>
              <ChevronLeft />
            </button>
            <span>
              {index + 1} / {count}
            </span>
            <button className="icon-btn" aria-label="Next item" onClick={() => step(1)}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
