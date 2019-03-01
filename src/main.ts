import {vec3, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
import LSystem from './LSystem';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  iterations: 1,
  Coral_Color: [255.0, 120.0, 110.0],
  Fish_Color: [41.0, 178.0, 173.0],
};

let screenQuad: ScreenQuad;
let time: number = 0.0;
let tubeFile: string = readTextFile('./src/tube.obj');
let tube: Mesh;
let fishFile: string = readTextFile('./src/fish.obj');
let fish: Mesh;
let iterations: number = 0;
let prevColor = [255.0, 120.0, 110.0];
let prevFishColor = [41.0, 178.0, 173.0];

function loadScene(iterations: number) {
  tube = new Mesh(tubeFile, vec3.fromValues(0, 0, 0));
  tube.create();

  fish = new Mesh(fishFile, vec3.fromValues(0, 0, 0));
  fish.create();

  screenQuad = new ScreenQuad();
  screenQuad.create();

  // LSystem initialization
  let lsystem: LSystem = new LSystem("A", iterations);
  lsystem.expandGrammar();
  let transforms: mat4[] = lsystem.transforms;
  let fishTransforms: mat4[] = lsystem.fishTransforms;
  lsystem.draw();

  // All Coral VBO Stuff
  let col1Arr = [];
  let col2Arr = [];
  let col3Arr = [];
  let col4Arr = [];
  let colorsArr = [];
  let n: number = transforms.length;

  for (let i = 0; i < n; i++) {
    let transform: mat4 = transforms[i];

    col1Arr.push(transform[0]);
    col1Arr.push(transform[1]);
    col1Arr.push(transform[2]);
    col1Arr.push(transform[3]);

    col2Arr.push(transform[4]);
    col2Arr.push(transform[5]);
    col2Arr.push(transform[6]);
    col2Arr.push(transform[7]);

    col3Arr.push(transform[8]);
    col3Arr.push(transform[9]);
    col3Arr.push(transform[10]);
    col3Arr.push(transform[11]);

    col4Arr.push(transform[12]);
    col4Arr.push(transform[13]);
    col4Arr.push(transform[14]);
    col4Arr.push(transform[15]);

    colorsArr.push(prevColor[0] / 255.0);
    colorsArr.push(prevColor[1] / 255.0);
    colorsArr.push(prevColor[2] / 255.0);
    colorsArr.push(1.0);

  }

  let colOne: Float32Array = new Float32Array(col1Arr);
  let colTwo: Float32Array = new Float32Array(col2Arr);
  let colThree: Float32Array = new Float32Array(col3Arr);
  let colFour: Float32Array = new Float32Array(col4Arr);
  let colors: Float32Array = new Float32Array(colorsArr);
  tube.setInstanceVBOs(colOne, colTwo, colThree, colFour, colors);
  tube.setNumInstances(n);

  // All Fish VBO Stuff
  let col1ArrFish = [];
  let col2ArrFish = [];
  let col3ArrFish = [];
  let col4ArrFish = [];
  let colorsArrFish = [];
  let nFish: number = fishTransforms.length;
  console.log(nFish);
  for (let i = 0; i < nFish; i++) {
    let transformFish: mat4 = fishTransforms[i];
    col1ArrFish.push(transformFish[0]);
    col1ArrFish.push(transformFish[1]);
    col1ArrFish.push(transformFish[2]);
    col1ArrFish.push(transformFish[3]);

    col2ArrFish.push(transformFish[4]);
    col2ArrFish.push(transformFish[5]);
    col2ArrFish.push(transformFish[6]);
    col2ArrFish.push(transformFish[7]);

    col3ArrFish.push(transformFish[8]);
    col3ArrFish.push(transformFish[9]);
    col3ArrFish.push(transformFish[10]);
    col3ArrFish.push(transformFish[11]);

    col4ArrFish.push(transformFish[12]);
    col4ArrFish.push(transformFish[13]);
    col4ArrFish.push(transformFish[14]);
    col4ArrFish.push(transformFish[15]);

    colorsArrFish.push(prevFishColor[0] / 255.0);
    colorsArrFish.push(prevFishColor[1] / 255.0);
    colorsArrFish.push(prevFishColor[2] / 255.0);
    colorsArrFish.push(1.0);
  }

  let colOneFish: Float32Array = new Float32Array(col1ArrFish);
  let colTwoFish: Float32Array = new Float32Array(col2ArrFish);
  let colThreeFish: Float32Array = new Float32Array(col3ArrFish);
  let colFourFish: Float32Array = new Float32Array(col4ArrFish);
  let colorsFish: Float32Array = new Float32Array(colorsArrFish);
  fish.setInstanceVBOs(colOneFish, colTwoFish, colThreeFish, colFourFish, colorsFish);
  fish.setNumInstances(nFish);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'iterations', 0, 6).step(1);
  gui.addColor(controls, 'Coral_Color');
  gui.addColor(controls, 'Fish_Color');

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene(iterations);

  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));
  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    if (controls.iterations != iterations) {
      iterations = controls.iterations;
      loadScene(iterations);
    }

    if (controls.Coral_Color != prevColor) {
      prevColor = controls.Coral_Color;
      loadScene(iterations);
    }
    
    if (controls.Fish_Color != prevFishColor) {
      prevFishColor = controls.Fish_Color;
      loadScene(iterations);
    }

    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      tube, fish,
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
