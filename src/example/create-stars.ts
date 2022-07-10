import * as THREE from 'three'
import { getDebugUi } from '../utils/debug-ui'
import vertexShader from './shaders/stars/vertex.glsl'
import fragmentShader from './shaders/stars/fragment.glsl'

export function createStars(scene: THREE.Scene, pixelRatio: number): THREE.Points | null {
  const starParams = {
    numOfPoints: 3000,
    size: 20,
    outerRadius: 7,
    innerRadius: 2,
  }
  let stars: THREE.Points | null = null

  const textureLoader = new THREE.TextureLoader()
  const starTexture = textureLoader.load('/space_dog/star_01.png')

  const generateStars = () => {
    if (stars !== null) {
      scene.remove(stars)
      stars.geometry.dispose()
      Array.isArray(stars.material) ? stars.material.forEach(mat => mat.dispose()) : stars.material.dispose()
    }

    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.ShaderMaterial({
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      vertexShader,
      fragmentShader,
      uniforms: {
        uSize: { value: starParams.size * pixelRatio },
        uTexture: { value: starTexture },
        uTime: { value: 0 }
      }
    })

    const itemSize = 3
    const positions = new Float32Array(starParams.numOfPoints * itemSize)
    const scales = new Float32Array(starParams.numOfPoints)

    for (let i = 0; i < starParams.numOfPoints; i++) {
      const { x, y, z } = getRandomPointInSphere(starParams)

      const index = i * itemSize

      positions[index] = x
      positions[index + 1] = y
      positions[index + 2] = z

      scales[i] = Math.random()
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, itemSize))
    starGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
  }

  const gui = getDebugUi()

  const starsFolder = gui.addFolder('Stars')
  starsFolder.close()

  starsFolder.add(
    starParams,
    'numOfPoints'
  ).min(100).max(10000).step(10).name('number of stars').onFinishChange(generateStars)
  starsFolder.add(
    starParams,
    'size'
  ).min(1).max(50).step(0.1).name('star size').onFinishChange(
    generateStars)
  starsFolder.add(
    starParams,
    'outerRadius'
  ).min(1).max(10).step(0.1).name('galaxy size').onFinishChange(
    generateStars)
  starsFolder.add(
    starParams,
    'innerRadius'
  ).min(2).max(8).step(0.1).name('inner radius').onFinishChange(
    generateStars)

  generateStars()

  return stars
}

function getRandomPointInSphere(params: { outerRadius: number; innerRadius: number }) {
  const u = Math.random()
  const v = Math.random()
  const theta = u * 2.0 * Math.PI
  const phi = Math.acos(2.0 * v - 1.0)
  const radius = Math.cbrt(Math.random()) * params.outerRadius + params.innerRadius
  const sinTheta = Math.sin(theta)
  const cosTheta = Math.cos(theta)
  const sinPhi = Math.sin(phi)
  const cosPhi = Math.cos(phi)
  const x = radius * sinPhi * cosTheta
  const y = radius * sinPhi * sinTheta
  const z = radius * cosPhi
  return { x, y, z }
}
