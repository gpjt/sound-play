const Speaker = require('speaker');
const Oscillator = require('./oscillator').Oscillator;

class SquareWaveOscillator extends Oscillator {

    generateAmplitude(timeOffsetInCycles) {
        if ((timeOffsetInCycles % 1) < 0.5) {
            return 1;
        } else {
            return -1;
        }
    }

}

const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone
const duration = parseFloat(process.argv[3], 10) || 2.0;
console.log('generating a %dhz square wave for %d seconds', freq, duration);
const square = new SquareWaveOscillator(16, 2, 44100, freq, duration);
square.pipe(new Speaker());
