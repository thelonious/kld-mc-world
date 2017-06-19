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

// Use the following to visit all blocks in the world
// world.forEachBlock(blockType => {
//     if (blockType.type === blockInfo.type && blockType.data === blockInfo.data) {
//         console.log(JSON.stringify(blockType));
//     }
// });

// However, we use this version so we can indicate which region we are visiting
world.forEachRegion(region => {
    console.log(region.xz);
    
    region.forEachBlock(blockType => {
        if (blockType.type === blockInfo.type && blockType.data === blockInfo.data) {
            console.log(JSON.stringify(blockType));
        }
    });
});
