let blocks = require('./blocks');

var by_name;
var by_description;

class BlockInfo {
    static findName(name) {
        if (by_name === undefined) {
            by_name = {};

            blocks.forEach(entry => {
                by_name[entry.name] = entry;
            });
        }

        return by_name[name];
    }

    static findDescription(description) {
        if (by_description === undefined) {
            by_description = {};

            blocks.forEach(entry => {
                by_description[entry.description.toLowerCase()] = entry;
            })
        }

        return by_description[description.toLowerCase()];
    }
}

module.exports = BlockInfo;
