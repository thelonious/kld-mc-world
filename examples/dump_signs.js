#!/usr/bin/env node
let path = require('path'),
    Map = require('../index'),
    World = Map.World,
    Region = Map.Region,
    printTag = require('kld-nbt').printTag;


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

// Hard-coding region coordinates for now. A future revision will be
// able to query for these values
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

// build "saves" directory for macOS user
let saves = path.join(process.env["HOME"], "Library", "Application Support", "minecraft", "saves");
let worldName = "Titanic 1_7_2";
let world = new World(path.join(saves, worldName));

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
