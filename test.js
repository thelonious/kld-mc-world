#!/usr/bin/env node
let path = require('path'),
    Map = require('./index'),
    World = Map.World,
    printTag = require('kld-nbt').printTag;

let home = process.env["HOME"];
let saves = path.join(home, "Library", "Application Support", "minecraft", "saves");
let worldName = "First World";
let worldPath = path.join(saves, worldName);

let world = new World(worldPath);
let position = { x: 119, y: 62, z: 118 };
let region = world.getRegion(position);
let chunk = region.getChunkContainingPosition(position);

// printTag(chunk.data);

let blockType = chunk.getBlockType(position);

console.log(blockType);
