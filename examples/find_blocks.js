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

for (let region of world.getRegions()) {
    console.log(region.xz);

    for (let blockType of region.getBlockInfos()) {
        if (blockType.type === blockInfo.type && blockType.data === blockInfo.data) {
            console.log(JSON.stringify(blockType));
        }
    }
}
