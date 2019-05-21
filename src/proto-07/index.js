import Stats from 'stats.js'
import { Application, AnimatedSprite, Spritesheet } from 'pixi.js'
import spritesheetJson from '../assets/spritesheet/animation-02-64x64.json'
import spritesheetImage from '../assets/spritesheet/animation-02-64x64.png'
import '../utils/reset.css'
// downloaded from soundcloud as example
import AUDIO_URL from './The 13th Tribe-Terra y Moto Dub.mp3'

const stats = new Stats()
document.body.appendChild(stats.dom)

const COLORS = [
  0xfefefe, // white
  0x7a7a78, // grey
  0xfbcb00, // yellow
  0xFF6B6B, // red
  0xFF9999, // pink
  0xBDB4F0,
  0xC9BFBF
]

const sprites = []

const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  backgroundColor: 0xf7f7f7
})

if (!spritesheetJson.hasOwnProperty('animations')) {
  // Adobe Animate doesnt create the animations object
  // so inject it manually befora creating Spritesheet
  const keys = Object.keys(spritesheetJson.frames).sort()
  spritesheetJson.animations = { default: keys }
}

app.loader
  .add('image', spritesheetImage)
  .load(onAssetsLoaded)

function onAssetsLoaded (loader, resources) {
  const sprSheet = new Spritesheet(resources.image.texture.baseTexture, spritesheetJson)
  sprSheet.parse(() => createAnimations(sprSheet))
}

function createAnimations (sprSheet) {
  const frames = sprSheet.animations['default']
  const size = 32

  const w = Math.ceil(window.innerWidth / size)
  const h = Math.ceil(window.innerHeight / size)

  for (var i = 0; i < h; i++) {
    for (var j = 0; j < w; j++) {
      const anim = new AnimatedSprite(frames)
      anim.currentColor = 0
      anim.col = j
      anim.row = i
      anim.x = j * size
      anim.y = i * size
      app.stage.addChild(anim)
      anim.stop()
      anim.animationSpeed = 0.5
      sprites.push(anim)
    }
  }
}

app.ticker.add(() => {
  stats.update()
})

window.onload = () => {
  document.body.appendChild(app.view)
  app.start()
}

function startAudio () {
  const context = new window.AudioContext()
  const audio = new window.Audio()
  audio.autoplay = true
  audio.loop = true
  audio.preload = 'auto'
  audio.src = AUDIO_URL
  const source = context.createMediaElementSource(audio)

  source.mediaElement.play()
  const analyser = context.createAnalyser()
  analyser.fftSize = 2048
  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  const max = 400

  source.connect(analyser)
  analyser.connect(context.destination)

  document.body.removeEventListener('mousedown', startAudio)
  document.body.style.cursor = 'auto'

  sprites.forEach(s => s.play())

  app.ticker.add(() => {
    let c = 0
    const inc = bufferLength / sprites.length
    analyser.getByteFrequencyData(dataArray)

    for (var i = 0; i < sprites.length; i++) {
      const v = Math.abs(dataArray[c >> 0] + 128 || 0)
      const sprite = sprites[i]
      const speed = v * 0.01
      const frame = (v / 255 * sprite.totalFrames) >> 0

      if (sprite.currentFrame < frame) {
        sprite.gotoAndStop(frame)
      } else if (sprite.currentFrame > frame) {
        sprite.gotoAndStop(sprite.currentFrame - 1)
      }

      sprite.tint = COLORS[(sprite.currentFrame / sprite.totalFrames * COLORS.length) >> 0]
      // sprite.tint = COLORS[(v / max * COLORS.length) >> 0]
      c += inc
    }
  })
}

// click to start
document.body.addEventListener('mousedown', startAudio)
document.body.style.cursor = 'pointer'
