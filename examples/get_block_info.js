#!/usr/bin/env node
let path = require('path'),
    Map = require('../index'),
    World = Map.World,
    printTag = require('kld-nbt').printTag;

let saves = path.join(process.env["HOME"], "Library", "Application Support", "minecraft", "saves");
let worldName = "First World";
let worldPath = path.join(saves, worldName);

let world = new World(worldPath);
let position = { x: 119, y: 62, z: 118 };
let region = world.getRegion(position);
let chunk = region.getChunkContainingPosition(position);
let blockType = chunk.getBlockInfo(position);

// printTag(chunk.data);
console.log(blockType);
