const { MessageEmbed, MessageAttachment } = require("discord.js");
const Colors = require("../Colors.json");
const Config = require('../config.json');
const download = require('download'); /*npm install download*/

const JavaScriptObfuscator = require('javascript-obfuscator'); /*npm install javascript-obfuscator*/

let request = require(`request`);
let fs = require(`fs`);

const menprotect = require('../menprotect/menprotect');
const obfuscator = new menprotect()

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.run = async(client, message, args) => {}
let MutationsEnabled = false;

module.exports = {
    name: "lua",
    description: "Obfuscate lua scripts",
    run: async(client, message, args) => {
        console.log("what")
        const filterReaction = (reaction, user) => {
            return ['🇦'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        const filterMessage = response => {
            return response;
        };

        let fuck = Date.now();

        let embed = new MessageEmbed()
            .setTitle("DaWae")
            .setDescription("Obfuscating Settings")
            .addField(":regional_indicator_a: Enable mutations", "Makes your code look different but makes it work the same.")
            .setColor(Colors.lightblue)

        message.channel.send(embed).then(msg => {
            msg.react('🇦')

            msg.awaitReactions(filterReaction, { max: 1, time: 60000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected;

                    if (reaction.first()._emoji.name === '🇦') {
                        MutationsEnabled = true;
                    } else {}
                })

            message.channel.awaitMessages(filterMessage, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    let attachment = collected.first().attachments.first();

                    if (attachment) {
                        let removedlol = attachment.name.replace('.txt', '')
                        request.get(attachment.url)
                            .on('error', console.error)
                            .pipe(fs.createWriteStream(`file-${fuck}.lua`));

                        sleep(5000);

                        let yesyesembed = new MessageEmbed().setTitle("DaWae").setDescription("Obfuscating...").setColor(Colors.lightblue)
                        msg.edit(yesyesembed).then(lmao => {
                            obfuscator.obfuscate({
                                script: fs.readFileSync(`file-${fuck}.lua`, { encoding: "binary" }),

                                callback: function(data) {
                                    fs.writeFileSync(`file-${fuck}-obfuscated.lua`, data.script)
                                },

                                options: {
                                    mutations: {
                                        enabled: MutationsEnabled,
                                        max: {
                                            enabled: MutationsEnabled,
                                            amount: 50,
                                        },
                                    },
                                },
                                debug: false
                            })

                            setTimeout(() => {
                                const buffer = fs.readFileSync(`file-${fuck}-obfuscated.lua`);

                                message.channel.send(`${message.author}, Obfuscated:`, new MessageAttachment(buffer, `${removedlol}-obfuscated.lua`));

                                fs.unlinkSync(`file-${fuck}-obfuscated.lua`);
                                fs.unlinkSync(`file-${fuck}.lua`)
                                lmao.edit(new MessageEmbed().setTitle("DaWae").setDescription("Done!").setColor(Colors.lightblue))
                            }, 5000);

                        })
                    } else {
                        message.channel.send("Send a file u oompa loompa");
                    }
                })
        })
    }
}