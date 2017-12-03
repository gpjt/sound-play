const Speaker = require('speaker');
const Oscillator = require('./oscillator').Oscillator;

class SineWaveGenerator extends Oscillator {

    generateAmplitude(timeOffsetInCycles) {
        return Math.sin(Math.PI * 2 * timeOffsetInCycles);
    }

}

const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone
const duration = parseFloat(process.argv[3], 10) || 2.0;
console.log('generating a %dhz sine wave for %d seconds', freq, duration);
const sine = new SineWaveGenerator(16, 2, 44100, freq, duration);
sine.pipe(new Speaker());
