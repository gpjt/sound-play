const bufferAlloc = require('buffer-alloc');
const stream = require('stream');


class Oscillator extends stream.Readable {

    constructor(bitDepth, channels, sampleRate, freq, duration) {
        super();
        this.bitDepth = bitDepth;
        this.channels = channels;
        this.sampleRate = sampleRate;
        this.freq = freq;
        this.duration = duration;
        this.samplesGenerated = 0;
        this.maxAmplitude = ((Math.pow(2, this.bitDepth)) / 2) - 8;
    }


    _read(n) {
        const bytesPerSample = this.bitDepth / 8;
        const blockAlign = bytesPerSample * this.channels;
        const numSamples = n / blockAlign;
        const buf = bufferAlloc(numSamples * blockAlign);

        const t = this.freq / this.sampleRate;

        for (let i = 0; i < numSamples; i++) {
            const s = this.samplesGenerated + i;
            const val = this.maxAmplitude * this.generateAmplitude(t * s);
            for (let channel = 0; channel < this.channels; channel++) {
                const offset = (i * bytesPerSample * this.channels) + (channel * bytesPerSample);
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
