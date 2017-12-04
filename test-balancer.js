const Speaker = require('speaker');
const process = require('process');
const oscillator = require('./oscillator');
const Balancer = require('./balancer').Balancer;

const duration = 60;
const lToRCycles = 2;
const sine = new oscillator.TriangleWaveOscillator(16, 2, 44100, 440, duration);
const balancer = new Balancer(16, 2, 0.5);
sine.pipe(balancer).pipe(new Speaker());

const time = () => {
    const timeNS = process.hrtime()[0] * 1e9 + process.hrtime()[1];
    return timeNS / 1e9;
};

const startTime = time();
const timer = setInterval(() => {
    const now = time();
    const fromStart = now - startTime;

    const angle = (fromStart / duration) * Math.PI * 2 * lToRCycles;
    const newPosition = (Math.sin(angle) + 1) / 2;
    balancer.position = newPosition;

    if (fromStart >= duration) {
        clearInterval(timer);
    }
}, 1);