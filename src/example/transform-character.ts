import * as THREE from 'three'

export const rotateCharacter = (spaceDog: THREE.Object3D) => {
  spaceDog.rotation.set(0, -Math.PI / 4, 0)
}
export const animateCharacter = (spaceDog: THREE.Object3D, elapsedTime: number) => {
  spaceDog.position.y = Math.sin(elapsedTime)
}
