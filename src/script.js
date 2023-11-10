import './main.css' //import css
import * as THREE from 'three' //import threejs
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js' //TWEEN anim incl threejs
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' //mouse controls
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' //load 3d model
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js' //compress 3d model
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'; //disp html elem
import { gsap } from "gsap"; //animation from gsap
import 'boxicons'

let sound = document.getElementById('audio');
sound.pause();


const back_btn = document.querySelector('#back_btn');
let current_3d_model = "";

// pre-loding page
const lodingManager = new THREE.LoadingManager();
const preloadingPage = document.querySelector('.loader');
lodingManager.onLoad = function() {
    preloadingPage.style.visibility = 'hidden';
}

 // visit models methods
 const jasmine_btn = document.querySelector('#jasmine_btn');
 const linnea_btn = document.querySelector('#linnea_btn');
 jasmine_btn.onclick = function() { show_jasmine_model() };
 linnea_btn.onclick = function() { show_linnea_model() };

// modals instance
//start 3d model visual
var linnea_modal = new bootstrap.Modal(document.getElementById('linnea_modal'), {
    keyboard: false
})
var jasmine_modal = new bootstrap.Modal(document.getElementById('jasmine_modal'), {
    keyboard: false
})
var club_house = new bootstrap.Modal(document.getElementById('club_house'), {
    keyboard: false
})

// draco loader to compress 3d model
const dracoLoader = new DRACOLoader()
const loader = new GLTFLoader(lodingManager)
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
dracoLoader.setDecoderConfig({ type: 'js' })
loader.setDRACOLoader(dracoLoader)

// add div to append 3d model
const container = document.createElement('div')
document.body.appendChild(container)
// setting scene cbg color
const scene = new THREE.Scene()
scene.background = new THREE.Color('#c8f0f9')

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true}) // turn on antialias
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //set pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight) // make it full screen
renderer.outputEncoding = THREE.sRGBEncoding // set color encoding
container.appendChild(renderer.domElement) // add the renderer to html div

// set camera
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 500)
camera.position.set(34,16,-20)
scene.add(camera)

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.setPixelRatio(2)
    labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight);
})

/////////////////////////////////////////////////////////////////////////
///// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, labelRenderer.domElement)

load_gltf('models/gltf/MAPY.glb', 0);
setup_lighting();
introAnimation();
setOrbitControlsLimits(1, 150, true, true);
rendeLoop();

// Global Methods
function playsound() {
    sound.play(); 
}
function setup_lighting() {
    const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82)
    scene.add(ambient)

    const sunLight = new THREE.DirectionalLight(0xe8c37b, .96)
    sunLight.position.set(-69,44,14)
    scene.add(sunLight)
}
// mouse functions
function setOrbitControlsLimits(minD, maxD, isRotate, isZoom, minAz, maxAz) {
    controls.minDistance = minD
    controls.maxDistance = maxD
    controls.enableRotate = isRotate
    controls.enableZoom = isZoom
    controls.minAzimuthAngle = minAz
    controls.maxAzimuthAngle = maxAz
    controls.maxPolarAngle = Math.PI /2.2
    controls.enableDamping = true
}
function introAnimation() {
    controls.enabled = false //disable orbit controls to animate the camera
    new TWEEN.Tween(camera.position.set(64,26,7)).to({ // from camera position
        x: -65, //desired x position to go
        y: 17, //desired y position to go
        z: -41 //desired z position to go
    }, 6500) // time take to animate
    .delay(3000).easing(TWEEN.Easing.Quartic.InOut).start() // define delay, easing
    .onComplete(function () { //on finish animation
        controls.enabled = true //enable orbit controls
        //setOrbitControlsLimits() //enable controls limits
        TWEEN.remove(this) // remove the animation from memory
        renderButtons();
        playsound()
    })
    
}
function rendeLoop() {
    labelRenderer.render(scene, camera);
    TWEEN.update()
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(rendeLoop)
}
function load_gltf(path, Ypos, name) {
    loader.load(path, function (gltf) {
        scene.add(gltf.scene);
        gltf.scene.name = name;
        gltf.scene.position.setY(Ypos);
    })
}
function remove_current_model() {
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
}
function remove_specific_model(name) {
    for (let i = 0; scene.children.length > 0; i++) {
        if (scene.children[i].name === name) {
            scene.remove(scene.children[i])
            break;
        }
    }
}
function lookAtCurrent3dModel() {
    switch (current_3d_model) {
        case 'jasmine_default':
            remove_specific_model('jasmine_default');
            break
        case 'jasmine_1stfloor':
            remove_specific_model('jasmine_1stfloor');
            break
        case 'jasmine_2ndfloor':
            remove_specific_model('jasmine_2ndfloor');
            break
        case 'jasmine_interior':
            remove_specific_model('jasmine_interior');
            break
        case 'linnea_default':
            remove_specific_model('linnea_default');
            break
        case 'linnea_1stfloor':
            remove_specific_model('linnea_1stfloor');
            break
        case 'linnea_2ndfloor':
            remove_specific_model('linnea_2ndfloor');
            break
        case 'linnea_interior':
            remove_specific_model('linnea_interior');
            break
    }
}

// Map Page Methods
function gotoLinnea() {
    gsap.to(controls.target,{x: -40, y: 2, z: -5, duration: 2, ease: 'power3.inOut'})
    gsap.to(camera.position,{x: -48, y: 9, z: -21, duration: 2, ease: 'power3.inOut'})
}
function gotoJasmine() {
    gsap.to(controls.target,{x: -15, y: 9, z: -20, duration: 2, ease: 'power3.inOut'})
    gsap.to(camera.position,{x: -25, y: 9, z: -20, duration: 2, ease: 'power3.inOut'})
}
function gotoClubhouse() {
    gsap.to(controls.target,{x: -15, y: 2, z: -10, duration: 2, ease: 'power3.inOut'})
    gsap.to(camera.position,{x: -46, y: 6, z: -22, duration: 2, ease: 'power3.inOut'})
}
function renderButtons() {
    // linnea btn
    const linnea_p = document.createElement('p');
    linnea_p.className = 'tooltip show';
    linnea_p.textContent = 'Linnea Model'
    const linnea_Container = document.createElement('div');
    linnea_Container.appendChild(linnea_p);
    linnea_Container.style.cursor = "pointer";
    const linnea_PointLabel = new CSS2DObject(linnea_Container);
    linnea_PointLabel.position.set(-41, 6, -13.5);
    scene.add(linnea_PointLabel);
    linnea_Container.addEventListener('pointerdown', () => { 
        linnea_modal.toggle();
        gotoLinnea();
    })

    // jasmine btn
    const jasmine_p = document.createElement('p');
    jasmine_p.className = 'tooltip show';
    jasmine_p.textContent = 'Jasmine Model'
    const jasmine_Container = document.createElement('div');
    jasmine_Container.appendChild(jasmine_p);
    jasmine_Container.style.cursor = "pointer";
    const jasmine_PointLabel = new CSS2DObject(jasmine_Container);
    jasmine_PointLabel.position.set(-4, 6, -22);
    scene.add(jasmine_PointLabel);
    jasmine_Container.addEventListener('pointerdown', () => { 
        jasmine_modal.toggle();
        gotoJasmine();
    })

    // clubhouse btn
    const cb_p = document.createElement('p');
    cb_p.className = 'tooltip show';
    cb_p.textContent = 'CPR Information'
    const cb_Container = document.createElement('div');
    cb_Container.appendChild(cb_p);
    cb_Container.style.cursor = "pointer";
    const cb_PointLabel = new CSS2DObject(cb_Container);
    cb_PointLabel.position.set(-33, 6, -19);
    scene.add(cb_PointLabel);
    cb_Container.addEventListener('pointerdown', () => { 
        club_house.toggle();
        gotoClubhouse();
    })
}

// Specific model Page Methods
function renderBackButton() {
    back_btn.style.display = "block";
    back_btn.addEventListener("click", goBack);
}
function goBack() {
    current_3d_model = '';
    back_btn.style.display = "none";
    remove_current_model();
    setup_lighting();
    controls.reset(); //reset camera rotation
    preloadingPage.style.visibility = 'visible';
    load_gltf('models/gltf/MAPY.glb', 0);
    introAnimation();
}

// Jasmine Model Methods
function show_jasmine_model() {
    current_3d_model = 'jasmine_default';
    jasmine_modal.toggle();
    remove_current_model();
    setup_lighting();
    preloadingPage.style.visibility = 'visible';
    load_gltf('models/gltf/plane.glb', 8, 'plane')
    load_gltf('models/gltf/jasmine_default.glb', 8.6, 'jasmine_default')
    // new TWEEN.Tween(camera.position).to({
    //     x: 25,
    //     y: 12,
    //     z: 22
    // }, 5000)
    // .delay(500).easing(TWEEN.Easing.Quartic.InOut).start()
    // .onComplete(function () {
    //     renderBackButton()
    //     renderButtons_jasmine();
    // })
    gsap.to(camera.position,{x: 25, y: 8, z: 22, duration: 5, ease: 'power3.inOut'})
    gsap.to(controls.target,{
        x: 0,
        y: 10,
        z: 0,
        duration: 2,
        ease: 'power3.inOut',
        onComplete() {
            renderBackButton()
        renderButtons_jasmine();
        }
    })
}
function renderButtons_jasmine() {
    // jasmine btn
    const interior_p = document.createElement('p');
    interior_p.className = 'tooltip show';
    interior_p.textContent = 'See Interior'
    const interior_container = document.createElement('div');
    interior_container.appendChild(interior_p);
    interior_container.style.cursor = "pointer";
    const interior_Pointlabel = new CSS2DObject(interior_container);
    interior_Pointlabel.position.set(-3, 15, -2);
    scene.add(interior_Pointlabel);
    interior_container.addEventListener('pointerdown', () => {
        gsap.to(camera.position,{x: 0, y: 7, z: -18, duration: 2, ease: 'power3.inOut'})
        gsap.to(controls.target,{
            x: 0,
            y: 10,
            z: 10,
            duration: 2,
            ease: 'power3.inOut',
            onComplete() {
                lookAtCurrent3dModel()
                current_3d_model = 'jasmine_interior';
                load_gltf('models/gltf/jasmine_interior.glb', 8, 'jasmine_interior')
            }
        })
    })

    const lookAround_p = document.createElement('p');
    lookAround_p.className = 'tooltip show';
    lookAround_p.textContent = 'Look Around'
    const lookAround_Container = document.createElement('div');
    lookAround_Container.appendChild(lookAround_p);
    lookAround_Container.style.cursor = "pointer";
    const lookAround_PointLabel = new CSS2DObject(lookAround_Container);
    lookAround_PointLabel.position.set(5, 10, 4);
    scene.add(lookAround_PointLabel);
    lookAround_Container.addEventListener('pointerdown', () => {
        gsap.to(camera.position,{x: 25, y: 8, z: 22, duration: 5, ease: 'power3.inOut'})
        gsap.to(controls.target,{
            x: 0,
            y: 10,
            z: 0,
            duration: 2,
            ease: 'power3.inOut',
            onComplete() {
                lookAtCurrent3dModel()
                current_3d_model = 'jasmine_default';
                load_gltf('models/gltf/jasmine_default.glb', 8.6, 'jasmine_default')
            }
        })
    })

    const floor_1st_p = document.createElement('p');
    floor_1st_p.className = 'tooltip show';
    floor_1st_p.textContent = '1st Floor'
    const floor_1st_conatiner = document.createElement('div');
    floor_1st_conatiner.appendChild(floor_1st_p);
    floor_1st_conatiner.style.cursor = "pointer";
    const floor_1st_PointLabel = new CSS2DObject(floor_1st_conatiner);
    floor_1st_PointLabel.position.set(0, 11, 6);
    scene.add(floor_1st_PointLabel);
    floor_1st_conatiner.addEventListener('pointerdown', () => {
        gsap.to(camera.position,{x: 0, y: 30, z: 0, duration: 5, ease: 'power3.inOut'})
        gsap.to(controls.target,{
            x: 0,
            y: 10,
            z: 2,
            duration: 2,
            ease: 'power3.inOut',
            onComplete() {
                lookAtCurrent3dModel()
                current_3d_model = 'jasmine_1stfloor';
                load_gltf('models/gltf/jasmine_1stfloor.glb', 8.6, 'jasmine_1stfloor')
            }
        })
    })

    const floor_2nd_p = document.createElement('p');
    floor_2nd_p.className = 'tooltip show';
    floor_2nd_p.textContent = '2nd Floor'
    const floor_2nd_conatiner = document.createElement('div');
    floor_2nd_conatiner.appendChild(floor_2nd_p);
    floor_2nd_conatiner.style.cursor = "pointer";
    const floor_2nd_PointLabel = new CSS2DObject(floor_2nd_conatiner);
    floor_2nd_PointLabel.position.set(0, 15, 6);
    scene.add(floor_2nd_PointLabel);
    floor_2nd_conatiner.addEventListener('pointerdown', () => {
        gsap.to(camera.position,{x: 0, y: 30, z: 0, duration: 5, ease: 'power3.inOut'})
        gsap.to(controls.target,{
            x: 0,
            y: 10,
            z: 2,
            duration: 2,
            ease: 'power3.inOut',
            onComplete() {
                lookAtCurrent3dModel()
                current_3d_model = 'jasmine_2ndfloor';
                load_gltf('models/gltf/jasmine_2ndfloor.glb', 8.6, 'jasmine_2ndfloor')
            }
        })
    })
}

// Linnea Model Methods
function show_linnea_model() {
    current_3d_model = 'linnea_default';
    linnea_modal.toggle();
    remove_current_model();
    setup_lighting();
    preloadingPage.style.visibility = 'visible';
    load_gltf('models/gltf/plane.glb', 8, 'plane')
    load_gltf('models/gltf/linnea_default.glb', 8, 'linnea_default')
    // new TWEEN.Tween(camera.position).to({
    //     x: 25,
    //     y: 12,
    //     z: 22
    // }, 5000)
    // .delay(500).easing(TWEEN.Easing.Quartic.InOut).start()
    // .onComplete(function () {
    //     renderBackButton()
    //     renderButtons_linnea();
    // })
    gsap.to(camera.position,{x: 25, y: 8, z: 22, duration: 5, ease: 'power3.inOut'})
    gsap.to(controls.target,{
        x: 0,
        y: 10,
        z: 0,
        duration: 2,
        ease: 'power3.inOut',
        onComplete() {
            renderBackButton()
            renderButtons_linnea();
        }
    })
}
function renderButtons_linnea() {
    // linnea btn
    const interior_p = document.createElement('p');
    interior_p.className = 'tooltip show';
    interior_p.textContent = 'See Interior'
    const interior_container = document.createElement('div');
    interior_container.appendChild(interior_p);
    interior_container.style.cursor = "pointer";
    const interior_Pointlabel = new CSS2DObject(interior_container);
    interior_Pointlabel.position.set(-3, 15, -2);
    scene.add(interior_Pointlabel);
    interior_container.addEventListener('pointerdown', () => {
        gsap.to(camera.position,{x: 0, y: 7, z: -18, duration: 2, ease: 'power3.inOut'})
        gsap.to(controls.target,{
            x: 0,
            y: 0,
            z: 100,
            duration: 2,
            ease: 'power3.inOut',
            onComplete() {
                lookAtCurrent3dModel()
                current_3d_model = 'linnea_interior';
                load_gltf('models/gltf/linnea_interior.glb', 8, 'linnea_interior')
            }
        })
    })

    const lookAround_p = document.createElement('p');
    lookAround_p.className = 'tooltip show';
    lookAround_p.textContent = 'Look Around'
    const lookAround_Container = document.createElement('div');
    lookAround_Container.appendChild(lookAround_p);
    lookAround_Container.style.cursor = "pointer";
    const lookAround_PointLabel = new CSS2DObject(lookAround_Container);
    lookAround_PointLabel.position.set(5, 10, 4);
    scene.add(lookAround_PointLabel);
    lookAround_Container.addEventListener('pointerdown', () => {
        gsap.to(camera.position,{x: 25, y: 8, z: 22, duration: 5, ease: 'power3.inOut'})
        gsap.to(controls.target,{
            x: 0,
            y: 10,
            z: 0,
            duration: 2,
            ease: 'power3.inOut',
            onComplete() {
                lookAtCurrent3dModel()
                current_3d_model = 'linnea_default';
                load_gltf('models/gltf/linnea_default.glb', 8, 'linnea_default')
            }
        })
    })

    const floor_1st_p = document.createElement('p');
    floor_1st_p.className = 'tooltip show';
    floor_1st_p.textContent = '1st Floor'
    const floor_1st_conatiner = document.createElement('div');
    floor_1st_conatiner.appendChild(floor_1st_p);
    floor_1st_conatiner.style.cursor = "pointer";
    const floor_1st_PointLabel = new CSS2DObject(floor_1st_conatiner);
    floor_1st_PointLabel.position.set(0, 11, 6);
    scene.add(floor_1st_PointLabel);
    floor_1st_conatiner.addEventListener('pointerdown', () => {
        gsap.to(camera.position,{x: 0, y: 30, z: 0, duration: 5, ease: 'power3.inOut'})
        gsap.to(controls.target,{
            x: 0,
            y: 10,
            z: 2,
            duration: 2,
            ease: 'power3.inOut',
            onComplete() {
                lookAtCurrent3dModel()
                current_3d_model = 'linnea_1stfloor';
                load_gltf('models/gltf/linnea_1stfloor.glb', 8.5, 'linnea_1stfloor')
            }
        })
    })

    const floor_2nd_p = document.createElement('p');
    floor_2nd_p.className = 'tooltip show';
    floor_2nd_p.textContent = '2nd Floor'
    const floor_2nd_conatiner = document.createElement('div');
    floor_2nd_conatiner.appendChild(floor_2nd_p);
    floor_2nd_conatiner.style.cursor = "pointer";
    const floor_2nd_PointLabel = new CSS2DObject(floor_2nd_conatiner);
    floor_2nd_PointLabel.position.set(0, 15, 6);
    scene.add(floor_2nd_PointLabel);
    floor_2nd_conatiner.addEventListener('pointerdown', () => {
        gsap.to(camera.position,{x: 0, y: 30, z: 0, duration: 5, ease: 'power3.inOut'})
        gsap.to(controls.target,{
            x: 0,
            y: 10,
            z: 2,
            duration: 2,
            ease: 'power3.inOut',
            onComplete() {
                lookAtCurrent3dModel()
                current_3d_model = 'linnea_2ndfloor';
                load_gltf('models/gltf/linnea_2ndfloor.glb', 8.5, 'linnea_2ndfloor')
            }
        })
    })
}