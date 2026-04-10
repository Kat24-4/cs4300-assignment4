import { default as seagulls } from 'https://cbcdn.githack.com/charlieroberts/gulls/raw/branch/main/gulls.js'
import {Pane} from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';

const sg      = await seagulls.init(),
      frag    = await seagulls.import( './frag.wgsl' ),
      compute = await seagulls.import( './compute.wgsl' ),
      render  = seagulls.constants.vertex + frag,
      size    = (window.innerWidth * window.innerHeight),
      state   = new Float32Array( size * 2 ),
      pane = new Pane()

var even = sessionStorage.getItem('symmetry') === 'true'

if (sessionStorage.getItem('symmetry') === null) {
  even = true
}

console.log(even)

for( let i = 0; i < size; i++ ) {
  state[ i * 2 + 0 ] = 1 // a
  state[ i * 2 + 1 ] = 0 // b 
}


if (even) {
  const width = window.innerWidth
  const height = window.innerHeight

  for (let y = height/2 - 20; y < height/2 + 20; y++) {
    for (let x = width/2 - 20; x < width/2 + 20; x++) {
      const i = y * width + x
      state[i * 2 + 1] = 1
    }
  }
} else {
  // this produces something cool but I am still not sure how to get something centered
  for( let j = size / 2; j < (size / 2) + (size / 4); j++) {
    state[ j * 2 + 1 ] = 1 // b = 1
  }
}

const statebuffer1 = sg.buffer( state )
const statebuffer2 = sg.buffer( state )
const res = sg.uniform([ window.innerWidth, window.innerHeight ])
const dA = sg.uniform( 1.0 ),
      dB = sg.uniform( .5 ),
      feed = sg.uniform( .055),
      k = sg.uniform( .062 )

const examples = {
  spotsStripesAndCoral: "Feed: 0.035-0.055\nKill: 0.05-0.07",
  mitosisCellDivision: "Feed: 0.0367\nKill: 0.0649",
  fingerprintCoral: "Feed: 0.0545\nKill: 0.062"
}

pane.addBinding( dA, 'value', { min: 0.1, max: 1.0, label:'Diffusion A'} )
pane.addBinding( dB, 'value', { min: 0.05, max: 0.5, label:'Diffusion B'} )
pane.addBinding( feed, 'value', { min: 0.01, max: 0.1, label:'Feed Rate'} )
pane.addBinding( k, 'value', { min: 0.030, max: 0.070, label:'Kill Rate'} )
const sym = pane.addButton({
  title: 'Switch',
  label: 'Change Symmetry'
})

sym.on('click', () => {
  sessionStorage.setItem('symmetry', !even)
  location.reload()  
})

const patterns = pane.addFolder({
  title: 'Example Patterns To Try',
  expanded: false,
})
patterns.addBinding( examples, 'spotsStripesAndCoral', { 
  readonly: true, 
  multiline: true,
  rows: 2,
  label:'Spots, Stripes, Coral'
})
patterns.addBinding( examples, 'mitosisCellDivision', { 
  readonly: true, 
  multiline: true,
  rows: 2,
  label:'Mitosis Cell Division'
})
patterns.addBinding( examples, 'fingerprintCoral', { 
  readonly: true, 
  multiline: true,
  rows: 2,
  label:'Fingerprint Coral'
})


const renderPass = await sg.render({
  shader: render,
  data: [
    res,
    sg.pingpong( statebuffer1, statebuffer2 )
  ]
})

const computePass = sg.compute({
  shader: compute,
  data: [ res, sg.pingpong( statebuffer1, statebuffer2 ), dA, dB, feed, k],
  dispatchCount:  [Math.round(seagulls.width / 8), Math.round(seagulls.height/8), 1],
  time: 3
})

sg.run( computePass, renderPass ) 