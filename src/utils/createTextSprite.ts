import * as THREE from 'three'

export function createTextSprite(
  text: string,
  color: string,
  size = 32
): THREE.Sprite {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return new THREE.Sprite()

  const fontSize = size
  ctx.font = `600 ${fontSize}px "Segoe UI", system-ui, sans-serif`
  const metrics = ctx.measureText(text)
  const w = Math.max(64, metrics.width + 24)
  const h = fontSize + 16

  canvas.width = w
  canvas.height = h

  ctx.fillStyle = 'rgba(27, 27, 31, 0.92)'
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(0, 0, w, h, 6)
  } else {
    ctx.rect(0, 0, w, h)
  }
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = color
  ctx.font = `600 ${fontSize}px "Segoe UI", system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  })

  const sprite = new THREE.Sprite(material)
  sprite.scale.set(w * 0.15, h * 0.15, 1)
  return sprite
}
