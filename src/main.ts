import {vec3, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
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
  iterations: 1
};

let screenQuad: ScreenQuad;
let time: number = 0.0;
let tubeFile: string = readTextFile('./src/tube.obj');
let tube: Mesh;
let iterations: number = 0;

function loadScene(iterations: number) {
  tube = new Mesh(tubeFile, vec3.fromValues(0, 0, 0));
  tube.create();

  // square = new Square();
  // square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();

  // LSystem initialization
  let lsystem: LSystem = new LSystem("A", iterations);
  lsystem.expandGrammar();
  let transforms: mat4[] = lsystem.transforms;
  lsystem.draw();

  let col1Arr = [];
  let col2Arr = [];
  let col3Arr = [];
  let col4Arr = [];
  let colorsArr = [];
  let n: number = transforms.length;
  console.log(n);

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

    colorsArr.push(23.0/255.0);
    colorsArr.push(150.0/255.0);
    colorsArr.push(19.0/255.0);
    colorsArr.push(1.0);

  }

  let colOne: Float32Array = new Float32Array(col1Arr);
  let colTwo: Float32Array = new Float32Array(col2Arr);
  let colThree: Float32Array = new Float32Array(col3Arr);
  let colFour: Float32Array = new Float32Array(col4Arr);
  let colors: Float32Array = new Float32Array(colorsArr);
  tube.setInstanceVBOs(colOne, colTwo, colThree, colFour, colors);
  tube.setNumInstances(n);
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
    
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      tube,
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
