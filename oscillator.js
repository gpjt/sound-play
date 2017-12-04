const bufferAlloc = require('buffer-alloc');
const stream = require('stream');


class Oscillator extends stream.Readable {

    constructor(bitDepth, channels, sampleRate, freq, duration) {
        super();
        this.bitDepth = bitDepth;
        this.bytesPerSample = this.bitDepth / 8;
        this.channels = channels;
        this.blockAlign = this.bytesPerSample * this.channels;
        this.sampleRate = sampleRate;
        this.freq = freq;
        this.duration = duration;
        this.samplesGenerated = 0;
        this.maxAmplitude = ((Math.pow(2, this.bitDepth)) / 2) - 8;
    }


    _read(n) {
        const numSamples = n / this.blockAlign;
        const buf = bufferAlloc(numSamples * this.blockAlign);

        const t = this.freq / this.sampleRate;

        for (let i = 0; i < numSamples; i++) {
            const s = this.samplesGenerated + i;
            const val = this.maxAmplitude * this.generateAmplitude(t * s);
            for (let channel = 0; channel < this.channels; channel++) {
                const offset = (i * this.bytesPerSample * this.channels) + (channel * this.bytesPerSample);
                buf[`writeInt${this.bitDepth}LE`](val, offset);
            }
        }

        this.push(buf);

        this.samplesGenerated += numSamples;
        if (this.samplesGenerated >= this.sampleRate * this.duration) {
            // after generating "duration" second of audio, emit "end"
            this.push(null);
        }
    }

}
module.exports.Oscillator = Oscillator;


class SineWaveOscillator extends Oscillator {

    generateAmplitude(timeOffsetInCycles) {
        return Math.sin(Math.PI * 2 * timeOffsetInCycles);
    }

}
module.exports.SineWaveOscillator = SineWaveOscillator;

class TriangleWaveOscillator extends Oscillator {

    generateAmplitude(timeOffsetInCycles) {
        const wavePortion = (timeOffsetInCycles % 1) * 4;
        if (wavePortion <= 1) {
            return wavePortion;
        }

        if (wavePortion <= 3) {
            return 2 - wavePortion;
        }

        return wavePortion - 4;
    }

}
module.exports.TriangleWaveOscillator = TriangleWaveOscillator;


class SquareWaveOscillator extends Oscillator {

    generateAmplitude(timeOffsetInCycles) {
        if ((timeOffsetInCycles % 1) <= 0.5) {
            return 1;
        }

        return -1;
    }

}
module.exports.SquareWaveOscillator = SquareWaveOscillator;
