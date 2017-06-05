let util = require('util');

function regionFilenameFromPosition(position) {
    let xz = regionXZFromPosition(position);

    return util.format("r.%d.%d.mca", xz.x, xz.z);
}

function regionXZFromPosition(position) {
    return {
        x: position.x >> 9,
        z: position.z >> 9
    };
}

function chunkIndexFromPosition(position) {
    let chunkX = position.x >> 4;
    let chunkZ = position.z >> 4;

    return (chunkX & 31) + (chunkZ & 31) * 32;
}

function blockOffsetFromPosition(position) {
    let cx = ((position.x % 16) + 16) % 16;
    let cy = position.y % 16;
    let cz = ((position.z % 16) + 16) % 16;

    return cy*16*16 + cz*16 + cx;
}

module.exports = {
    regionFilenameFromPosition: regionFilenameFromPosition,
    chunkIndexFromPosition: chunkIndexFromPosition,
    blockOffsetFromPosition: blockOffsetFromPosition,
    regionXZFromPosition: regionXZFromPosition
};
