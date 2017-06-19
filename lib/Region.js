let fs = require('fs'),
    ReadBuffer = require('kld-nbt').ReadBuffer,
    utils = require('./utils'),
    Chunk = require('./Chunk');

let MAX_CHUNK_COUNT = 1024;

module.exports = class Region {
    constructor(filename) {
        this.filename = filename;
        this.xz = null;
        this.timestamps = new Array(MAX_CHUNK_COUNT);
        this.locations = new Array(MAX_CHUNK_COUNT);
        this.sectors = new Array(MAX_CHUNK_COUNT);
        this.chunks = new Array(MAX_CHUNK_COUNT);
        this.chunks.fill(null);
    }

    static fromFile(path, xz) {
        let region = new Region(path);

        region.xz = xz;

        let buffer = fs.readFileSync(path);
        let readBuffer = new ReadBuffer(buffer);
        var i;

        for (i = 0; i < MAX_CHUNK_COUNT; i++) {
            var value = readBuffer.readUInt32();

            region.locations[i] = (value & 0xFFFFFF00) >> 8;
            region.sectors[i] = value & 0x000000FF;
        }

        for (i = 0; i < MAX_CHUNK_COUNT; i++) {
            region.timestamps[i] = readBuffer.readUInt32();
        }

        return region;
    }

    getChunkContainingPosition(position) {
        let chunkIndex = utils.chunkIndexFromPosition(position);

        return this.getChunk(chunkIndex);
    }

    getChunk(index) {
        var result = null;

        if (0 <= index && index < MAX_CHUNK_COUNT) {
            if (this.chunks[index] !== null) {
                result = this.chunks[index];
            }
            else {
                let sectorNumber = this.locations[index];

                if (sectorNumber !== 0) {
                    let buffer = fs.readFileSync(this.filename);
                    let readBuffer = new ReadBuffer(buffer);

                    readBuffer.seek(sectorNumber * 4096);

                    let compressedChunkSize = readBuffer.readUInt32();
                    let compressionType = readBuffer.readUInt8();
                    let chunkData = readBuffer.readBytes(compressedChunkSize);

                    result = Chunk.loadCompressedChunk(chunkData, compressionType);
                    result.timestamp = this.timestamps[index];
                    result.location = sectorNumber;
                    result.sectors = this.sectors[index];
                    result.compressionType = compressionType;
                    result.compressedSize = compressedChunkSize;
                }
            }
        }

        return result;
    }

    getChunks() {
        var chunks = [];

        for (var i = 0; i < MAX_CHUNK_COUNT; i++) {
            let chunk = this.getChunk(i);

            if (chunk !== null) {
                chunks.push(chunk);
            }
        }

        return chunks;
    }
};
