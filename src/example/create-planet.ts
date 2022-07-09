import * as THREE from 'three'
import { getDebugUi } from '../utils/debug-ui'

export function createPlanet(scene: THREE.Scene) {
  const textureLoader = new THREE.TextureLoader()
  const params = {
    radius: 12
  }

  const planetMatcap = textureLoader.load('/space_dog/planet_matcap.png')
  const planet = new THREE.Mesh(
    new THREE.SphereBufferGeometry(params.radius, 32, 32),
    new THREE.MeshMatcapMaterial({ matcap: planetMatcap })
  )
  planet.position.set(2.8, -14, -10)

  const gui = getDebugUi()
  const planetFolder = gui.addFolder('Planet')
  planetFolder.close()
  planetFolder.add(planet.position, 'x').min(-20).max(20).name('x')
  planetFolder.add(planet.position, 'y').min(-20).max(20).name('y')
  planetFolder.add(planet.position, 'z').min(-20).max(20).name('z')
  planetFolder.add(params, 'radius').name('radius').min(1).max(20).onFinishChange(() => {
    const radius = params.radius
    const scale = radius * 0.1
    planet.scale.setScalar(scale)
  })
  scene.add(planet)
}
