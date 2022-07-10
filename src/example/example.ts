import './example.scss'
import * as THREE from 'three'
import { loadCharacter } from './load-character'
import { createLights } from './create-lights'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { calculateCanvasSize } from '../utils/calculate-canvas-size'
import { animateCharacter, rotateCharacter } from './transform-character'
import { createStars } from './create-stars'
import { createPlanet } from './create-planet'
import { createFog } from './create-fog'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { getDebugUi } from '../utils/debug-ui'

/**
 * Creates an example scene with a bouncing character.
 */
export const runExample = async () => {
  // Canvas
  const canvas = document.querySelector<HTMLDivElement>('#canvas')!
  const canvasAspectRatio = window.innerWidth / window.innerHeight
  let size = calculateCanvasSize(canvasAspectRatio)

  // Scene
  const scene = new THREE.Scene()

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x010024, 1)
  createFog(scene)

  // Camera
  const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
  camera.position.z = 6
  scene.add(camera)

  // Scene elements
  createLights(scene)
  const stars = createStars(scene, renderer.getPixelRatio())
  createPlanet(scene)

  const spaceDog = await loadCharacter()
  scene.add(spaceDog)
  rotateCharacter(spaceDog)

  // Bloom Post-Processing
  const renderScene = new RenderPass( scene, camera );

  const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
  bloomPass.threshold = 0.9;
  bloomPass.radius = 1;
  bloomPass.strength = 1;

  const gui = getDebugUi()
  const bloomFolder = gui.addFolder('Bloom')
  bloomFolder.close()
  bloomFolder.add(bloomPass, 'threshold').min(0).max(10).step(0.01).name('threshold')
  bloomFolder.add(bloomPass, 'strength').min(0).max(10).step(0.01).name('strength')
  bloomFolder.add(bloomPass, 'radius').min(0).max(10).step(0.01).name('radius')

  const composer = new EffectComposer( renderer );
  composer.addPass( renderScene );
  composer.addPass( bloomPass );

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableZoom = false
  controls.enableDamping = true
  // controls.autoRotate = true

  // Render loop
  const clock = new THREE.Clock()

  const animate = () => {
    requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()
    animateCharacter(spaceDog, elapsedTime)
    if (stars && stars.material instanceof THREE.ShaderMaterial) {
      stars.material.uniforms.uTime.value = elapsedTime
    }
    controls.update()
    // renderer.render(scene, camera)
    composer.render();
  }

  animate()

  // Resizing
  window.addEventListener('resize', () => {
    size = calculateCanvasSize(canvasAspectRatio)

    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width, size.height)
    composer.setSize(size.width, size.height)
  })
}
