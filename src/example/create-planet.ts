import * as THREE from 'three'
import { getDebugUi } from '../utils/debug-ui'
import vertexShader from './shaders/planet/vertex.glsl'
import fragmentShader from './shaders/planet/fragment.glsl'

export function createPlanet(scene: THREE.Scene) {
  const textureLoader = new THREE.TextureLoader()
  const params = {
    radius: 12
  }

  const planetGroup = new THREE.Group()

  const sphereGeometry = new THREE.SphereBufferGeometry(params.radius, 64, 64)

  const planetMatcap = textureLoader.load('/space_dog/planet_matcap.png')
  const planet = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshMatcapMaterial({ matcap: planetMatcap })
  )

  const aRandom = new Float32Array(sphereGeometry.attributes.position.count)
  for (let i = 0; i < sphereGeometry.attributes.position.count; i++) {
    aRandom[i] = Math.random()
  }
  sphereGeometry.setAttribute('aRandom', new THREE.BufferAttribute(aRandom, 1))

  const planetGlow = new THREE.Mesh(
    sphereGeometry,
    new THREE.ShaderMaterial({
      vertexShader,
      depthWrite: false,
      fragmentShader,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      uniforms: {
        uPower: { value: 0.5 }
      }
    })
  )
  planetGlow.scale.setScalar(1.3)

  planetGroup.add(planet, planetGlow)
  planetGroup.position.set(6, -15, -10)
  scene.add(planetGroup)

  const gui = getDebugUi()
  const planetFolder = gui.addFolder('Planet')
  planetFolder.close()
  planetFolder.add(planetGroup.position, 'x').min(-50).max(50).name('x')
  planetFolder.add(planetGroup.position, 'y').min(-50).max(50).name('y')
  planetFolder.add(planetGroup.position, 'z').min(-50).max(50).name('z')
  planetFolder.add(params, 'radius').name('radius').min(1).max(20).onFinishChange(() => {
    const radius = params.radius
    const scale = radius * 0.1
    planet.scale.setScalar(scale)
  })
}
