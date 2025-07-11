import * as THREE from 'three'
import { gl } from './WebGL'

export class TCanvas {

    constructor(private container: HTMLElement) {
        this.init()
        this.createObjects()
        gl.requestAnimationFrame(this.tick)
    }

  private init() {
    gl.setup(this.container)
    gl.scene.background = new THREE.Color('#012')
    gl.camera.position.z = 1.5
  }

  private createObjects() {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const material = new THREE.LineBasicMaterial( {
        color: 0xffffff,
    } );
    const mesh = new THREE.Mesh(geometry, material)

    gl.scene.add(mesh)
  }
    /**
     * Animate
     */
    clock = new THREE.Clock()

    private tick = () =>
    {
        const elapsedTime = this.clock.getElapsedTime()

        // Update controls
        // controls.update()

        // // Render
        // renderer.render(scene, camera)

        // // Call tick again on the next frame
        // window.requestAnimationFrame(tick)
    }

    // ----------------------------------
    // dispose
    dispose() {
        gl.dispose()
    }
}
