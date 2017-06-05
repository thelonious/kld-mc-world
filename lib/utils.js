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

module.exports = {
    regionFilenameFromPosition: regionFilenameFromPosition,
    chunkIndexFromPosition: chunkIndexFromPosition
};
