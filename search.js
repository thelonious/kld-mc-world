#!/usr/bin/env node
let path = require('path'),
    Map = require('./index'),
    World = Map.World,
    Region = Map.Region,
    printTag = require('kld-nbt').printTag;


function showChunkInfo(chunk) {
    if (chunk !== null) {
        let level    = chunk.data.findTag("Level");
        let xPos     = level.findTag("xPos").intValue;
        let zPos     = level.findTag("zPos").intValue;
        let sections = level.findTag("Sections");

        let startX = xPos * 16;
        let endX   = startX + 15;
        let startZ = zPos * 16;
        let endZ   = startZ + 15;

        if (startX <= position.x && position.x <= endX && startZ <= position.z && position.z <= endZ) {
            console.log(
                "chunk x=[%d,%d], z=[%d,%d], xPos=%d, zPos=%d",
                startX, endX, startZ, endZ, xPos, zPos);
            printTag(chunk.data);
        }
    }
}

function signText(text) {
    return text === "null" ? "" : text;
}

function printSigns(chunk) {
    if (chunk !== null) {
        let level = chunk.data.findTag("Level");
        let tileEntities = level.findTag("TileEntities");

        tileEntities.elements.forEach(item => {
            let id = item.findTag("id");

            if (id.stringValue === "Sign") {
                let x = item.findTag("x").intValue;
                let y = item.findTag("y").intValue;
                let z = item.findTag("z").intValue;
                let t1 = signText(item.findTag("Text1").stringValue);
                let t2 = signText(item.findTag("Text2").stringValue);
                let t3 = signText(item.findTag("Text3").stringValue);
                let t4 = signText(item.findTag("Text4").stringValue);

                console.log("sign at (%d,%d,%d) = %s", x, y, z, [t1, t2, t3, t4].join("\\n"));
            }
        });
    }
}

let regions = [
    { x: -1, z: -1 },
    { x: -1, z:  0 },
    { x: -1, z:  1 },
    { x:  0, z:  0 },
    { x:  0, z:  1 },
    { x:  0, z:  2 },
    { x:  1, z:  1 },
    { x:  1, z:  2 },
    { x:  2, z:  1 },
    { x:  2, z:  2 },
    { x:  3, z:  1 },
    { x:  3, z:  2 }
];
  

let home = process.env["HOME"];
let saves = path.join(home, "Library", "Application Support", "minecraft", "saves");
let worldName = "Titanic 1_7_2";
let worldPath = path.join(saves, worldName);
let world = new World(worldPath);

if (false) {
    let position = { x: 1251, y: 122, z: 1129 };
    let region = world.getRegion(position);
    let chunk = region.getChunkContainingPosition(position);

    console.log("position=(%d,%d,%d)", position.x, position.y, position.z);
    showChunkInfo(chunk);
    let block = chunk.getBlockType(position);
    console.log(JSON.stringify(block));
}
else {
    regions.forEach(regionCoordinate => {
        let filename = `r.${regionCoordinate.x}.${regionCoordinate.z}.mca`;
        let fullpath = path.join(world.regionPath, filename);
        let region = Region.fromFile(fullpath, regionCoordinate);

        console.log("Checking %s", filename);

        for (var i = 0; i < 1024; i++) {
            let chunk = region.getChunk(i);

            printSigns(chunk);
        }
    });
}
