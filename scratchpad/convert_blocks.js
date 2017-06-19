#!/usr/bin/env node

let fs = require('fs');

let text = fs.readFileSync("blocks.txt", { encoding: "utf-8" });
let lines = text.split(/\r\n?|\n/);

console.log("module.exports = [");

for (var i = 0; i < lines.length; i += 3) {
    let [type, data] = lines[i].trim().split(":");
    let name = lines[i + 2];

    let result = {
        type: parseInt(type, 10),
        data: (data !== undefined) ? parseInt(data, 10) : 0,
        description: lines[i + 1],
        name: name.substr(1, name.length - 2)
    }

    let comma = i !== lines.length - 3 ? "," : "";

    console.log(`  ${JSON.stringify(result)}${comma}`);
}

console.log("];");
