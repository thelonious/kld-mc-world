let zlib = require('zlib'),
    NBT = require('kld-nbt'),
    Tag = NBT.Tag,
    ReadBuffer = NBT.ReadBuffer;

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
};
