const Speaker = require('speaker');
const Oscillator = require('./oscillator').Oscillator;

class TriangleWaveGenerator extends Oscillator {

    generateAmplitude(timeOffsetInCycles) {
        const wavePortion = (timeOffsetInCycles % 1) * 4;
        if (wavePortion <= 1) {
            return wavePortion;
        } else if (wavePortion <= 3) {
            return 2 - wavePortion;
        } else {
            return wavePortion - 4;
        }
    }

}

const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone
const duration = parseFloat(process.argv[3], 10) || 2.0;
console.log('generating a %dhz triangle wave for %d seconds', freq, duration);
const triangle = new TriangleWaveGenerator(16, 2, 44100, freq, duration);
triangle.pipe(new Speaker());
