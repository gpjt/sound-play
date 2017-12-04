const assert = require('assert');
const bufferAlloc = require('buffer-alloc');
const stream = require('stream');

class Balancer extends stream.Transform {

    constructor(bitDepth, channels, position) {
        super();
        assert.ok(channels === 2, "Can only balance with two channels!");
        this.bitDepth = bitDepth;
        this.channels = channels;
        this.position = position;
        this.bytesPerSamplePerChannel = this.bitDepth / 8;
        this.bytesPerSample = this.bytesPerSamplePerChannel * this.channels;
    }

    _transform(chunk, encoding, callback) {
        const newChunk = bufferAlloc(chunk.length);

        for (let offset=0; offset < chunk.length; offset+=this.bytesPerSample) {
            const sampleLeft = chunk[`readInt${this.bitDepth}LE`](offset);
            const sampleRight = chunk[`readInt${this.bitDepth}LE`](offset + this.bytesPerSamplePerChannel);
            const newSampleLeft = sampleLeft * (1 - this.position);
            const newSampleRight = sampleRight * this.position;
            newChunk[`writeInt${this.bitDepth}LE`](newSampleLeft, offset);
            newChunk[`writeInt${this.bitDepth}LE`](newSampleRight, offset + this.bytesPerSamplePerChannel);
        }

        this.push(newChunk);
        callback();
    }

}
module.exports.Balancer = Balancer;
