const { readdirSync } = require("fs");

const ascii = require("ascii-table");

module.exports = (client) => {
    readdirSync("./Commands1/").forEach(dir => {
        const commands = readdirSync(`./Commands1/`).filter(file => file.endsWith(".js"));

        for (let file of commands) {
            let pull = require(`../Commands1/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
            } else {
                console.log("Couldnt load file")
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });
}