let path = require('path'),
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
};
