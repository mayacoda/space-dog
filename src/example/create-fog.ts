import * as THREE from 'three'
import { getDebugUi } from '../utils/debug-ui'

export function createFog(scene: THREE.Scene) {
  const params = {
    fogColor: 0x740707
  }

  const fog = new THREE.Fog(params.fogColor, 8.4, 17.4)
  scene.fog = fog

  const gui = getDebugUi()
  const fogFolder = gui.addFolder('Fog')
  fogFolder.close()
  fogFolder.addColor(params, 'fogColor').name('color').onChange(() => {
    fog.color.set(params.fogColor)
  })
  fogFolder.add(fog, 'near').min(0).max(20).step(0.1).name('near')
  fogFolder.add(fog, 'far').min(0).max(50).step(0.1).name('far')
}
