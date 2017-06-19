let fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    Region = require('./Region');

module.exports = class World {
    constructor(worldPath) {
        this.worldPath = worldPath;
        this.regionPath = path.join(worldPath, "region");
        this.playerPath = path.join(worldPath, "playerdata");
        this.regions = {};
    }

    getRegion(position) {
        let regionFilename = utils.regionFilenameFromPosition(position);

        if (regionFilename in this.regions === false) {
            let fullpath = path.join(this.regionPath, regionFilename);
            
            this.regions[regionFilename] = Region.fromFile(fullpath, utils.regionXZFromPosition(position));
        }

        return this.regions[regionFilename];
    }

    getRegions() {
        return fs.readdirSync(this.regionPath)
            .filter(file => /^r\.-?\d+\.-?\d+\.mca$/.test(file))
            .map(file => {
                let fullPath = path.join(this.regionPath, file);
                let parts = file.split(".");
                let x = parseInt(parts[1], 10);
                let z = parseInt(parts[2], 10);

                // TODO: use regions cache
                return Region.fromFile(fullPath, {x: x, z: z});
            });
    }

    forEachRegion(cb) {
        let regions = this.getRegions();

        for (var i = 0; i < regions.length; i++) {
            cb(regions[i]);
        } 
    }

    forEachChunk(cb) {
        let regions = this.getRegions();

        for (var i = 0; i < regions.length; i++) {
            let region = regions[i];
            let chunks = region.getChunks();

            for (var j = 0; j < chunks.length; j++) {
                cb(chunks[j]);
            }
        }
    }

    forEachBlock(cb) {
        let regions = this.getRegions();

        for (var i = 0; i < regions.length; i++) {
            let region = regions[i];
            let chunks = region.getChunks();

            for (var j = 0; j < chunks.length; j++) {
                let chunk = chunks[j];
                let blockInfos = chunk.getBlockInfos();

                for (var k = 0; k < blockInfos.length; k++) {
                    cb(blockInfos[k]);
                }
            }
        }
    }
};
