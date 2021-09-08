const Discord = require('discord.js'); /*npm install discord.js*/
const Client = new Discord.Client();

const { Collection } = require("discord.js");
const Config = require('./config.json');
const fs = require('fs'); /*npm install fs*/

let prefix = Config.prefix;
/*Very simple base, but it does it job :D*/
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        Client.on(eventName, event.bind(null, Client));
    });
});

Client.commands = new Discord.Collection();
Client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let cmd = require(`./commands/${file}`);
        let cmdFileName = file.split(".")[0];
        Client.commands.set(cmd.help.name, cmd);
        if (cmd.help.aliases) {
            cmd.help.aliases.forEach(alias => {
                Client.aliases.set(alias, cmd.help.name);
            });
        };
    });
});


Client.commands = new Collection();
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(Client);
});

Client.on("message", async message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) {
        command.run(client, message, args);
    }
});

Client.on("ready", () => {
    console.log(`Bot is ready to use!`);
});

Client.login(Config.token)