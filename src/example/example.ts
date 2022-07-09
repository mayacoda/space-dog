import './example.scss'
import * as THREE from 'three'
import { loadCharacter } from './load-character'
import { createLights } from './create-lights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { calculateCanvasSize } from '../utils/calculate-canvas-size'
import { animateCharacter, rotateCharacter } from './transform-character'
import fragment from './glsl-import-example/main.frag'
import { createStars } from './create-stars'
import { createPlanet } from './create-planet'
import { createFog } from './create-fog'

/**
 * Creates an example scene with a bouncing character.
 */
export const runExample = async () => {
  console.log(fragment)
  // Canvas
  const canvas = document.querySelector<HTMLDivElement>('#canvas')!

  // Scene
  const scene = new THREE.Scene()
  const canvasAspectRatio = window.innerWidth / window.innerHeight

  let size = calculateCanvasSize(canvasAspectRatio)

  // Scene elements
  createLights(scene)
  createStars(scene)
  createPlanet(scene)

  const spaceDog = await loadCharacter()
  scene.add(spaceDog)
  rotateCharacter(spaceDog)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  createFog(renderer, scene)

  // Camera
  const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
  camera.position.z = 6
  scene.add(camera)

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableZoom = false
  controls.enableDamping = true
  // controls.autoRotate = true

  // Render loop
  const clock = new THREE.Clock()

  const animate = () => {
    requestAnimationFrame(animate)
    animateCharacter(spaceDog, clock.getElapsedTime())
    controls.update()
    renderer.render(scene, camera)
  }

  animate()

  // Resizing
  window.addEventListener('resize', () => {
    size = calculateCanvasSize(canvasAspectRatio)

    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width, size.height)
  })
}
