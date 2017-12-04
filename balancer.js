const stream = require('stream');

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
module.exports.Balancer = Balancer;
