<template>
  <div class="canvas-wrap" ref="cvsWrap">
    <canvas class="canvas" ref="cvs"></canvas>
  </div>
</template>

<style>
.canvas-wrap {
  width: 500px;
  height: 500px;
}
</style>

<script setup lang="ts">
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Fog,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
//import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect"

useHead({
  title: "舞线设计器测试页",
})

const cvsWrap = ref<HTMLElement>()
const cvs = ref<HTMLCanvasElement>()

let width = 300
let height = 150
let sizeUpdated = true

function start() {
  const PI = Math.PI
  const DEG = PI / 180
  const SQRT1_3 = 3 ** -0.5

  const disposables: { dispose(): unknown }[] = []

  const scene = new Scene()
  scene.background = new Color(0x222222)
  scene.fog = new Fog(0x222222, 50, 500)

  const camera = new PerspectiveCamera(50, 1, 0.1, 500)
  camera.position.set(-25 * SQRT1_3, 25 * SQRT1_3, -25 * SQRT1_3)
  camera.rotation.set(-0.25 * PI, 1.25 * PI, 0.25 * PI)

  const renderer = new WebGLRenderer({
    canvas: cvs.value,
    antialias: true,
    alpha: true,
    premultipliedAlpha: false,
  })
  renderer.setPixelRatio(window.devicePixelRatio || 1)
  disposables.push(renderer)

  //const effect = new OutlineEffect(renderer)

  const geoCube = new BoxGeometry(1, 1, 1)
  const geoPlane = new PlaneGeometry(1, 1)
  disposables.push(geoCube, geoPlane)

  const matLine = new MeshPhongMaterial({ color: 0xff8000 })
  disposables.push(matLine)
  const mesLine = new Mesh(geoCube, matLine)
  scene.add(mesLine)

  const matRoad = new MeshPhongMaterial({ color: 0xffffff })
  disposables.push(matRoad)
  const mesRoad = new Mesh(geoCube, matRoad)
  mesRoad.position.set(0, -1, 20)
  mesRoad.scale.set(4, 1, 44)
  scene.add(mesRoad)

  const matFloor = new MeshPhongMaterial({
    color: 0x888888,
    side: DoubleSide,
  })
  disposables.push(matFloor)
  const mesFloor = new Mesh(geoPlane, matFloor)
  mesFloor.rotation.set(-0.5 * PI, 0, 0)
  mesFloor.position.set(0, -1.505, 0)
  mesFloor.scale.set(10000, 10000, 1)
  scene.add(mesFloor)

  const ligSun = new DirectionalLight(0xffffff, 6)
  ligSun.position.set(-1, 2, 4)
  disposables.push(ligSun)
  scene.add(ligSun)

  const ligAmbient = new AmbientLight(0xffffff, 0.5)
  disposables.push(ligAmbient)
  scene.add(ligAmbient)
  /* drawing lines
  const lineMaterial = new LineBasicMaterial({ color: 0x0000ff })
  disposables.push(lineMaterial)

  const points = []
  points.push(new Vector3(-1, 0, 0))
  points.push(new Vector3(0, 1, 0))
  points.push(new Vector3(1, 0, 0))

  const lineGeometry = new BufferGeometry().setFromPoints(points)
  disposables.push(lineGeometry)

  const line = new Line(lineGeometry, lineMaterial)
  scene.add(line)
  //*/

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enableZoom = false
  controls.enablePan = false
  controls.maxPolarAngle = 85 * DEG
  disposables.push(controls)

  {
    const onResize = function () {
      ;({ width, height } = cvsWrap.value!.getBoundingClientRect())
      sizeUpdated = true
    }
    onResize()

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(cvsWrap.value!)
    disposables.push({
      dispose() {
        resizeObserver.disconnect()
      },
    })
  }

  let startTime = NaN
  let lastTime = NaN
  let animationHandle = NaN

  function animate(time: number) {
    animationHandle = requestAnimationFrame(animate)

    if (isNaN(startTime)) startTime = lastTime = time
    const deltaTime = time - lastTime
    lastTime = time

    const pos = -Math.cos((time - startTime) / 2000)
    //-Math.asin(Math.cos((time - startTime) / 2000)) / (0.5 * PI)
    mesLine.scale.z = pos * 20 + 21
    mesLine.position.z = pos * 10 + 10

    const newCenter = controls.target
      .clone()
      .lerp(new Vector3(0, 0, pos * 20 + 20), 1 - 0.5 ** (deltaTime / 500))
    camera.position.add(newCenter.clone().sub(controls.target))
    controls.target.copy(newCenter)
    controls.update()

    if (sizeUpdated) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    //effect.render(scene, camera)
    renderer.render(scene, camera)
  }

  animationHandle = requestAnimationFrame(animate)
  disposables.push({
    dispose() {
      cancelAnimationFrame(animationHandle)
    },
  })

  disposables.push({
    dispose: onPixelRatioChange(window, (devicePixelRatio) => {
      renderer.setPixelRatio(devicePixelRatio)
    }),
  })

  return () => {
    disposables.forEach((o) => o.dispose())
  }
}

onMounted(() => {
  if (process.browser) {
    const dispose = start()
    onUnmounted(dispose)
  }
})
</script>
