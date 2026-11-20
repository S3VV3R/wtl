declare global {
  interface Window {
    LEONIDA_ART?: Record<string, string>
  }
}
export const art = (id: string) => window.LEONIDA_ART?.[id] || './art/' + id + '.webp'
export const mark = () => window.LEONIDA_ART?.mark || './mark.svg'
