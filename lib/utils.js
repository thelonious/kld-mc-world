let util = require('util');

function regionFilenameFromPosition(position) {
    let regionX = position.x >> 9;
    let regionZ = position.z >> 9;

    return util.format("r.%d.%d.mca", regionX, regionZ);
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
    blockOffsetFromPosition: blockOffsetFromPosition
};
