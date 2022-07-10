import * as THREE from 'three'
import { getDebugUi } from '../utils/debug-ui'

/**
 * Creates one purple ambient light and two golden point lights and adds them to the scene.
 */
export function createLights(scene: THREE.Scene) {

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xb7b6c9, 1.4)

  // First point light
  const planetLight = new THREE.PointLight(0xf9ca48, 2.4)
  planetLight.position.set(2.8, -14, -10)

  const gui = getDebugUi()

  const lightsFolder = gui.addFolder('Lights')
  lightsFolder.close()

  lightsFolder.addColor(ambientLight, 'color').name('ambient light color')
  lightsFolder.add(ambientLight, 'intensity').min(0).max(2).step(0.01).name('ambient light intensity')
  lightsFolder.addColor(planetLight, 'color').name('planet light color')
  lightsFolder.add(planetLight, 'intensity').min(0).max(5).step(0.01).name('planet light intensity')

  scene.add(ambientLight, planetLight)
}
