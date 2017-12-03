const Speaker = require('speaker');
const Oscillator = require('./oscillator').Oscillator;

class TriangleWaveGenerator extends Oscillator {

    generateAmplitude(timeOffsetInCycles) {
        const angle = timeOffsetInCycles % 1;
        if (angle <= 0.25) {
            return 4 * angle;
        } else if (angle <= 0.75) {
            return 2 - (4 * angle);
        } else {
            return (4 * angle) - 4;
        }
    }

}

const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone
const duration = parseFloat(process.argv[3], 10) || 2.0;
console.log('generating a %dhz triangle wave for %d seconds', freq, duration);
const triangle = new TriangleWaveGenerator(16, 2, 44100, freq, duration);
triangle.pipe(new Speaker());
