#!/usr/bin/env node
let path = require('path'),
    Map = require('./index'),
    World = Map.World;

let home = process.env["HOME"];
let saves = path.join(home, "Library", "Application Support", "minecraft", "saves");
let worldName = "First World";
let worldPath = path.join(saves, worldName);

let world = new World(worldPath);
let position = { x: 119, y: 63, z: 118 };
let region = world.getRegion(position);
let chunk = region.getChunkContainingPosition(position);

console.log(chunk);
