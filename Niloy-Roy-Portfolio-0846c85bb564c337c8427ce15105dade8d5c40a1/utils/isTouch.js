export function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches)
}
