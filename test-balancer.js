const Speaker = require('speaker');
const SineWaveOscillator = require('./oscillator').SineWaveOscillator;
const Balancer = require('./balancer').Balancer;

const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone
const duration = parseFloat(process.argv[3], 10) || 2.0;
console.log('generating a %dhz sine wave for %d seconds', freq, duration);
const sine = new SineWaveOscillator(16, 2, 44100, freq, duration);
const balancer = new Balancer(16, 2, 0)
sine.pipe(balancer).pipe(new Speaker());
