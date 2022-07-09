import * as THREE from 'three'
import { getDebugUi } from '../utils/debug-ui'

export function createStars(scene: THREE.Scene) {
  const starParams = {
    numOfPoints: 3000,
    size: 0.1,
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
    const starMaterial = new THREE.PointsMaterial({
      size: starParams.size,
      sizeAttenuation: true,
      alphaMap: starTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const itemSize = 3
    const points = new Float32Array(starParams.numOfPoints * itemSize)

    for (let i = 0; i < starParams.numOfPoints; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const radius = Math.cbrt(Math.random()) * starParams.outerRadius + starParams.innerRadius
      const sinTheta = Math.sin(theta)
      const cosTheta = Math.cos(theta)
      const sinPhi = Math.sin(phi)
      const cosPhi = Math.cos(phi)
      const x = radius * sinPhi * cosTheta
      const y = radius * sinPhi * sinTheta
      const z = radius * cosPhi

      const index = i * itemSize


      points[index] = x
      points[index + 1] = y
      points[index + 2] = z
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(points, itemSize))

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
  ).min(0.001).max(1).step(0.001).name('star size').onFinishChange(
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
}
