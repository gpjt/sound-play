const Speaker = require('speaker');
const Oscillator = require('./oscillator').Oscillator;

// the frequency to play
const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone

// seconds worth of audio data to generate before emitting "end"
const duration = parseFloat(process.argv[3], 10) || 2.0;

console.log('generating a %dhz sine wave for %d seconds', freq, duration);

class SineWaveGenerator extends Oscillator {

    generateAmplitude(timeOffsetInCycles) {
        return Math.sin(Math.PI * 2 * timeOffsetInCycles);
    }

}

// A SineWaveGenerator readable stream
const sine = new SineWaveGenerator(16, 2, 44100, freq, duration);

// create a SineWaveGenerator instance and pipe it to the speaker
sine.pipe(new Speaker());
