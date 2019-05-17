import Stats from 'stats.js'
import { Application, AnimatedSprite, Spritesheet } from 'pixi.js'
import spritesheetJson from '../assets/spritesheet/motion-32x32.json'
import spritesheetImage from '../assets/spritesheet/motion-32x32.png'
import '../utils/reset.css'

const stats = new Stats()
document.body.appendChild(stats.dom)

const app = new Application({
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  backgroundColor: 0xf7f7f7
})

app.loader
  .add('image', spritesheetImage)
  .load(onAssetsLoaded)

function onAssetsLoaded (loader, resources) {
  const sprSheet = new Spritesheet(resources.image.texture.baseTexture, spritesheetJson)
  sprSheet.parse(() => createAnimations(sprSheet))
}

function createAnimations (sprSheet) {
  const frames = sprSheet.animations['motion-32x']
  const size = 32

  const w = Math.ceil(window.innerWidth / size)
  const h = Math.ceil(window.innerHeight / size)

  for (var i = 0; i < h; i++) {
    for (var j = 0; j < w; j++) {
      const anim = new AnimatedSprite(frames);
      anim.x = j * size
      anim.y = i * size
      anim.gotoAndPlay(((i + 1) * (j + 1)) % frames.length)
      app.stage.addChild(anim);
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
