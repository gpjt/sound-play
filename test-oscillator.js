const Speaker = require('speaker');
const oscillator = require('./oscillator');

const freq = parseFloat(process.argv[3], 10) || 440.0; // Concert A, default tone
const duration = parseFloat(process.argv[4], 10) || 2.0;
console.log('generating a %dhz sine wave for %d seconds', freq, duration);

let osc;
if (process.argv[2] === "sine") {
    osc = new oscillator.SineWaveOscillator(16, 2, 44100, freq, duration);
}
if (process.argv[2] === "square") {
    osc = new oscillator.SquareWaveOscillator(16, 2, 44100, freq, duration);
}
if (process.argv[2] === "triangle") {
    osc = new oscillator.TriangleWaveOscillator(16, 2, 44100, freq, duration);
}

osc.pipe(new Speaker());
