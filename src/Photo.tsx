import React, { type ImgHTMLAttributes } from 'react'
import { art } from './artwork'
import { usePreferences } from './store'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'id'> & { photo: string; alt: string }

export default function Photo({ photo, alt, loading = 'lazy', ...props }: Props) {
  const preset = usePreferences((state) => state.preset)
  const suffix = preset === 'Low' ? '-lite' : preset === 'High' ? '-balanced' : ''
  return <img {...props} alt={alt} loading={loading} decoding="async" src={art(photo + suffix)} />
}
