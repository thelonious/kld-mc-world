let zlib = require('zlib'),
    NBT = require('kld-nbt'),
    Tag = NBT.Tag,
    ReadBuffer = NBT.ReadBuffer,
    utils = require('./utils');

module.exports = class Chunk {
    constructor() {
        this.data = null;
    }

    get xPos() {
        let level = this.data.findTag("Level");
        
        return level.findTag("xPos").intValue;
    }

    get zPos() {
        let level = this.data.findTag("Level");

        return level.findTag("zPos").intValue;
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

    getBlockInfo(position) {
        let section = this.getSection(position);
        var result = null;

        if (section !== null) {
            let blocks = section.findTag("Blocks");
            let data = section.findTag("Data");

            if (blocks !== null && data != null) {
                let blockOffset = utils.blockOffsetFromPosition(position);

                let type = blocks.byteValues[blockOffset];
                let dataByte = data.byteValues[blockOffset >> 1];
                let blockData = (blockOffset % 2 == 0) ? dataByte & 0x0F : (dataByte >> 4) & 0x0F;
                
                result = {
                    type: type,
                    data: blockData,
                    position: position
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

    getSections() {
        let level = this.data.findTag("Level");
        let sections = level.findTag("Sections");

        return sections.elements;
    }

    getBlockInfos() {
        var result = [];
        var chunkX = this.xPos;
        var chunkZ = this.zPos;

        this.getSections().forEach(section => {
            let blocks = section.findTag("Blocks");
            let data = section.findTag("Data");
            let yIndex = section.findTag("Y");
            let y = yIndex.byteValue << 4;

            if (blocks !== null && data != null) {
                for (var offset = 0; offset < 4096; offset++) {
                    let type = blocks.byteValues[offset];
                    let dataByte = data.byteValues[offset >> 1];
                    let blockData = (offset % 2 == 0) ? dataByte & 0x0F : (dataByte >> 4) & 0x0F;
                    
                    result.push({
                        type: type,
                        data: blockData,
                        position: {
                            x: (chunkX * 16) + (offset & 0x0F),
                            y: y + ((offset & 0xF00) >> 8),
                            z: (chunkZ * 16) + ((offset & 0xF0) >> 4)
                        }
                    });
                }
            }
        });

        return result;
    }
};
