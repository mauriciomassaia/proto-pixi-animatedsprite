import { Graphics } from 'pixi.js'

export function createCircle (x, y, radius, color = 0x000000, alpha = 1) {
  const r = new Graphics()
  r.beginFill(color, alpha)
  r.drawCircle(x, y, radius)
  r.endFill()
  return r
}

export function createRect (x, y, width, height, color = 0x000000, alpha = 1) {
  const r = new Graphics()
  r.beginFill(color, alpha)
  r.drawRect(x, y, width, height)
  r.endFill()
  return r
}

export function createCross (x, y, size, color = 0xff0000, alpha = 1, thickeness = 1) {
  const r = new Graphics()
  const s = size * 0.5
  const t = thickeness * 0.5
  r.beginFill(color, alpha)
  r.drawRect(x - s, y - t, size, thickeness)
  r.drawRect(x - t, y - s, thickeness, size)
  r.endFill()
  return r
}

export default {
  createRect
}
