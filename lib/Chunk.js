let zlib = require('zlib'),
    NBT = require('kld-nbt'),
    Tag = NBT.Tag,
    ReadBuffer = NBT.ReadBuffer,
    utils = require('./utils');

module.exports = class Chunk {
    constructor() {
        this.data = null;
    }
    
    static loadCompressedChunk(compressedData, compressionFormat) {
        var data;

        if (compressionFormat == 1) {
            data = zlib.gunzipSync(compressedData);
        }
        else if (compressionFormat == 2) {
            data = zlib.unzipSync(compressedData);
        }
        else {
            throw new Error("Unrecognized chunk compression format: " + compressionFormat);
        }

        let readBuffer = new ReadBuffer(data);
        let result = new Chunk();

        result.data = Tag.readFromBuffer(readBuffer);
        result.data.loadFromBuffer(readBuffer);

        return result;
    }

    getBlockType(position) {
        let section = this.getSection(position);
        var result = null;

        if (section !== null) {
            let blocks = section.findTag("Blocks");
            let data = section.findTag("Data");

            if (blocks !== null && data != null) {
                let blockOffset = utils.blockOffsetFromPosition(position);

                let type = blocks.byteValues[blockOffset];
                let dataByte = blocks.byteValues[blockOffset >> 1];
                let data = (blockOffset % 2 == 0) ? dataByte & 0x0F : (dataByte >> 4) & 0x0F;
                
                result = {
                    type: type,
                    data: data
                };
            }
        }

        return result;
    }

    getSection(position) {
        var result = null;

        if (this.data !== null && 0 <= position.y && position.y < 256) {
            let chunkY = position.y >> 4;
            let level = this.data.findTag("Level");
            let sections = level.findTag("Sections");

            for (var i = 0; i < sections.elements.length; i++) {
                let candidate = sections.elements[i];
                let yIndex = candidate.findTag("Y");

                if (yIndex !== null && yIndex.byteValue === chunkY) {
                    result = candidate;
                    break;
                }
            }
        }

        // TODO: generate new empty section for y index

        return result;
    }
};
