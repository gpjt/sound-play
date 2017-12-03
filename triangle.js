const Readable = require('stream').Readable;
const bufferAlloc = require('buffer-alloc');
const Speaker = require('speaker');

// the frequency to play
const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone

// seconds worth of audio data to generate before emitting "end"
const duration = parseFloat(process.argv[3], 10) || 2.0;

console.log('generating a %dhz triangle wave for %d seconds', freq, duration);

class TriangleWaveGenerator extends Readable {

    constructor(bitDepth, channels, sampleRate) {
        super();
        this.bitDepth = bitDepth;
        this.channels = channels;
        this.sampleRate = sampleRate;
        this.samplesGenerated = 0;
    }


    _read(n) {
        const sampleSize = this.bitDepth / 8;
        const blockAlign = sampleSize * this.channels;
        const numSamples = n / blockAlign | 0;
        const buf = bufferAlloc(numSamples * blockAlign);
        const amplitude = 32760; // Max amplitude for 16-bit audio

        // the "angle" used in the function, adjusted for the number of
        // channels and sample rate. This value is like the period of the wave.
        const t = freq / this.sampleRate;

        for (let i = 0; i < numSamples; i++) {
            // fill with a simple triangle wave at max amplitude
            for (let channel = 0; channel < this.channels; channel++) {
                const s = this.samplesGenerated + i;
                let val;
                let angle = (t * s) % 1;
                if (angle <= 0.25) {
                    val = 4 * angle;
                } else if (angle <= 0.75) {
                    val = 2 - (4 * angle);
                } else {
                    val = (4 * angle) - 4;
                }
                val *= amplitude;
                const offset = (i * sampleSize * this.channels) + (channel * sampleSize);
                buf[`writeInt${this.bitDepth}LE`](val, offset);
            }
        }

        this.push(buf);

        this.samplesGenerated += numSamples;
        if (this.samplesGenerated >= this.sampleRate * duration) {
            // after generating "duration" second of audio, emit "end"
            this.push(null);
        }
    }


}

// A TriangleWaveGenerator readable stream
const triangle = new TriangleWaveGenerator(16, 2, 44100);

// create a TriangleWaveGenerator instance and pipe it to the speaker
triangle.pipe(new Speaker());
