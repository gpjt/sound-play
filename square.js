/**
 * Code adapted from:
 * http://blogs.msdn.com/b/dawate/archive/2009/06/24/intro-to-audio-programming-part-3-synthesizing-simple-wave-audio-using-c.aspx
 */

const Readable = require('stream').Readable;
const bufferAlloc = require('buffer-alloc');
const Speaker = require('speaker');

// the frequency to play
const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone

// seconds worth of audio data to generate before emitting "end"
const duration = parseFloat(process.argv[3], 10) || 2.0;

console.log('generating a %dhz square wave for %d seconds', freq, duration);

class SquareWaveGenerator extends Readable {

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
        const t = (2 * freq) / this.sampleRate;

        for (let i = 0; i < numSamples; i++) {
            // fill with a simple square wave at max amplitude
            for (let channel = 0; channel < this.channels; channel++) {
                const s = this.samplesGenerated + i;
                let val;
                if (((t * s) % (2)) < 1) {
                    val = amplitude;
                } else {
                    val = -amplitude;
                }
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

// A SquareWaveGenerator readable stream
const square = new SquareWaveGenerator(16, 2, 44100);

// create a SquareWaveGenerator instance and pipe it to the speaker
square.pipe(new Speaker());
