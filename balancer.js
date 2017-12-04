const stream = require('stream');
const Speaker = require('speaker');
const SineWaveOscillator = require('./oscillator').SineWaveOscillator;

class Balancer extends stream.Transform {

    constructor(position) {
        super();
        this.position = position;
    }

    _transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
    }

}


const freq = parseFloat(process.argv[2], 10) || 440.0; // Concert A, default tone
const duration = parseFloat(process.argv[3], 10) || 2.0;
console.log('generating a %dhz sine wave for %d seconds', freq, duration);
const sine = new SineWaveOscillator(16, 2, 44100, freq, duration);
sine.pipe(new Balancer(1)).pipe(new Speaker());
