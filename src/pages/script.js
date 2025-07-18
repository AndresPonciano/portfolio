
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Test mesh
 */
const geometry = new THREE.BufferGeometry();

// test with only two levels at first
const levels = 3

// per each level, we will multiple 3 by 4 everytime
// therefore, per each level get a new multiple of 4
let levelsSize = 1
for(let i = 0; i < levels; i++) levelsSize *= 4

// initialize array to full size that we will want/need
const numberOfPoints = 3 * levelsSize
const fullSize = numberOfPoints * 3
const vertices = new Float32Array(fullSize)
let indices = []

/**
 * 
 * @param firstPoint - initial point of the koch curve
 * @param lastPoint - last point of the koch curve
 * @param length - distance between the first and last point
 * @param degree - angle for the initial point which will help determin the angle for the 2nd, 3rd, and 4th point
 * @param level - current level of the koch iteration, will go down by 1 each time until reaches 0
 * @param startIndex - index for the position at which @firstPoint will be stored in the vertices array 
 * @param endIndex - index for the position at which @lastPoint will be stored in the vertices array
 * @param index - temp index for where we are in the vertices array given the new points??? not sure yet
 * @returns {type} Description of the return value.
 */
let testIndex = 0
// NEXT ACTION: FIX INDICES WHEN RECURSING 
function kochSnowflake(firstPoint, lastPoint, length, degree, level, startIndex, endIndex, index) {    
    if (level == 0) {
        console.log(testIndex, numberOfPoints - 1)
        vertices[startIndex] = firstPoint.x
        vertices[startIndex+1] = firstPoint.y
        vertices[startIndex+2] = 0
        if (testIndex == numberOfPoints-1) {   
            console.log("here")     
            indices.push(testIndex, 0)
        } else {
            indices.push(testIndex, testIndex + 1)
        }
        testIndex += 1
        
        return
    }

    let test = new THREE.Vector3().subVectors(lastPoint, firstPoint)
    test.multiplyScalar(1/3)
    let point1dot1 = firstPoint.clone()
    point1dot1.add(test)

    let increment = (endIndex - startIndex)/4
    kochSnowflake(firstPoint, point1dot1, length/3, degree, level-1, startIndex, startIndex + (increment * 1), index)

    let test2 = new THREE.Vector3()
    let new_degree = degree - (Math.PI / 3)
    test2.setX(point1dot1.x + ((length/3) * Math.cos(new_degree)))
    test2.setY(point1dot1.y + ((length/3) * Math.sin(new_degree)))
    // this should become from point 1.1 to point 1.2
    kochSnowflake(point1dot1, test2, length/3, degree - (Math.PI/3), level-1, startIndex + (increment * 1), startIndex + (increment * 2), index)

    let test3 = new THREE.Vector3()
    let new_degree3 = degree + (Math.PI / 3)
    test3.setX(test2.x + ((length/3) * Math.cos(new_degree3)))
    test3.setY(test2.y + ((length/3) * Math.sin(new_degree3)))
    // this should be from point 1.2 to point 1.3
    kochSnowflake(test2, test3, length/3, degree + (Math.PI/3), level-1, startIndex + (increment * 2), startIndex + (increment * 3), index)
    
    // this should be from point 1.3 to lastPoint
    kochSnowflake(test3, lastPoint, length/3, degree, level-1, startIndex + (increment * 3), endIndex, index)
}


let start = 0
let point1 = new THREE.Vector3( 2 * Math.cos(0), 2 * Math.sin(0))
let point2 = new THREE.Vector3( 2 * Math.cos(2*Math.PI / 3), 2 * Math.sin(2*Math.PI / 3))
let point3 = new THREE.Vector3( 2 * Math.cos(-2*Math.PI / 3), 2 * Math.sin(-2*Math.PI / 3))

// TODO: Actual degrees if we want to the use stanford method are: 
// 150, = 5pi/6
// 150 + 120 = 270, = 3pi/2
// 150 + 120 + 120 = 390 = 30 = 13pi/6
kochSnowflake(point1, point2, point1.distanceTo(point2), (5*Math.PI) / 6, levels, start, start + numberOfPoints, testIndex)
kochSnowflake(point2, point3, point2.distanceTo(point3), (3*Math.PI) / 2, levels, start + numberOfPoints, start + numberOfPoints * 2, testIndex)
kochSnowflake(point3, point1, point3.distanceTo(point1), (13*Math.PI) / 6, levels, start + numberOfPoints * 2, start + numberOfPoints * 3, testIndex)

console.log(point1.distanceTo(point2))
console.log(vertices)
console.log(indices)

// // Create the attribute and name it 'position'
const positionsAttribute = new THREE.Float32BufferAttribute(vertices, 3)
geometry.setAttribute('position', positionsAttribute)
geometry.setIndex(indices)

// // Material
const material = new THREE.LineBasicMaterial( {
	color: 0xffffff,
} );

// // Mesh
const lineSegments = new THREE.LineSegments( geometry, material );
scene.add(lineSegments)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.75, - 0.75, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()