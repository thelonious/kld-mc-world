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

    * getRegions() {
        let files = fs.readdirSync(this.regionPath)
            .filter(file => /^r\.-?\d+\.-?\d+\.mca$/.test(file));

        for (var i = 0; i < files.length; i++) {
            let file = files[i];
            let fullPath = path.join(this.regionPath, file);
            let parts = file.split(".");
            let x = parseInt(parts[1], 10);
            let z = parseInt(parts[2], 10);

            // TODO: use regions cache
            yield Region.fromFile(fullPath, {x: x, z: z});
        }
    }

    * getBlockInfos() {
        for (let region of this.getRegions()) {
            yield* region.getBlockInfos();
        }
    }
};
