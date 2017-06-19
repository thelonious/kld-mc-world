#!/usr/bin/env node
let path = require('path'),
    Map = require('../index'),
    World = Map.World,
    BlockInfo = Map.BlockInfo;

// build "saves" directory for macOS user
let saves = path.join(process.env["HOME"], "Library", "Application Support", "minecraft", "saves");
let worldName = "Forge Lucky Block";
let world = new World(path.join(saves, worldName));
let blockInfo = BlockInfo.findDescription("Gold Block");
let blockCount = {};
var blockTotal = 0;

world.forEachRegion(region => {
    process.stdout.write(".");

    region.forEachBlock(blockType => {
        blockTotal++;

        let info = BlockInfo.findTypeAndData(blockType.type, blockType.data);
        let longName = (info !== null)
            ? info.description
            : `${blockType.type}:${blockType.data}`;

        if (longName in blockCount) {
            blockCount[longName]++;
        }
        else {
            blockCount[longName] = 1;
        }
    });
});

console.log();
console.log("Total Blocks = %d", blockTotal);
Object.keys(blockCount).sort().forEach(name => {
    console.log("%s: %d", name, blockCount[name]);
});
