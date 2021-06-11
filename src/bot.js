const Discord = require("discord.js");
const client = new Discord.Client();

const bot_options = require("../options/bot_options.json");

const axios = require('axios');

const prefix = "x!";

const commands = [
    'get',
    'help',
    'test-internal',
    'test-general'
];

class BotError {
    constructor(name, description, code) {
        this.name = name;
        this.description = description;
        this.code = code;
    }
}

class XKCD {
    constructor(num, safe_title, title, alt, month, day, year, url) {
        this.num = num;
        this.safe_title = safe_title;
        this.title = title;
        this.alt = alt;
        this.month = month;
        this.day = day;
        this.year = year;
        this.url = url;
    }
}

function getXKCDEmbed(xkcd) {
    return new Discord.MessageEmbed()
    .setAuthor(`XKCD #${xkcd.num}`)
    .setTitle(xkcd.title)
    .setURL(`https://xkcd.com/${xkcd.num}/`)
    .setDescription(`*${xkcd.alt}*`)
    .setImage(xkcd.url)
    .setFooter(`Written with <3 by c0repwn3r - Images by XKCD`)
    .setColor("#7703fc")
    .setTimestamp();
}

function getBotError(error) {
    return new Discord.MessageEmbed()
    .setTitle(`Internal Error - ${error.name}`)
    .setDescription(`Something went wrong :(\nAn internal bot error with code of ${error.code} was thrown, here's the description:\n\`\`\`${error.description}\`\`\`\n*This message will self destruct in 10 seconds.*`)
    .setColor('#ff0000')
    .setFooter('Made with <3 by c0repwn3r - Images by XKCD')
    .setTimestamp();
}

function getError(error) {
    return new Discord.MessageEmbed()
    .setTitle(`${error.name}`)
    .setDescription(`Something went wrong :(\nAn error with the code of ${error.code} was thrown, here's the description:\n\`\`\`${error.description}\`\`\`\n*This message will self destruct in 10 seconds.*`)
    .setColor('#ff0000')
    .setFooter('Made with <3 by c0repwn3r - Images by XKCD')
    .setTimestamp();
}

function getHelp() {
    return new Discord.MessageEmbed()
    .setTitle('XKCDBot Help')
    .setDescription('Prefix: x!\nCurrent Commands:')
    .addFields(
        { name: 'x!get <latest|random|[numeric id]>', value: 'Get an XKCD, either the latest, a random XKCD, or get one by numeric ID.'},
        { name: 'x!help', value: 'Display this help message.'}
    )
    .setColor("#00ff00")
    .setFooter("Written with <3 by c0repwn3r - Images by XKCD")
    .setTimestamp();
}

const ingest = 'https://xkcd.com/'

async function parseCommand(commandArray, msg) {
    if (!(commandArray instanceof Array)) {
        let error = msg.channel.send(
            getBotError(
                new BotError(
                    "Invalid command array", // Name
                    "Non-array value passed to command parser as commandArray paramater.", // Description
                    "2" // Code
                )
            )
        ).then(msg => {
            setTimeout(() => msg.delete(), 10000);
        });
        msg.delete();
    }

    let seperator = commandArray[0].replace(prefix, '');
    if (!commands.includes(seperator)) {
        let error = msg.channel.send(
            getError(
                new BotError(
                    "Invalid command", // Name
                    `No command by the name of '${seperator}' was found. Maybe a typo?`, // Description
                    "1" // Code
                )
            )
        ).then(msg => {
            setTimeout(() => msg.delete(), 10000);
        });
        msg.delete();
    }

    switch (seperator.toLowerCase()) {
        case 'help':
            msg.channel.send(getHelp());
            msg.delete();
            break;
        case 'test-internal':
            var error = msg.channel.send(
                getBotError(
                    new BotError(
                        "Test! - Invalid command array", // Name
                        "Non-array value passed to command parser as commandArray paramater. Manually initiated error.", // Description
                        "3" // Code
                    )
                )
            ).then(msg => {
                setTimeout(() => msg.delete(), 10000);
            });
            msg.delete();
            break;
        case 'test-general':
            var error = msg.channel.send(
                getError(
                    new BotError(
                        "Manually initiated error.", // Name
                        `User-initiated general error. For testing purposes.`, // Description
                        "4" // Code
                    )
                )
            ).then(msg => {
                setTimeout(() => msg.delete(), 10000);
            });
            msg.delete();
            break;
        case 'get':
            let sc_id = /[0-9]+/g;

            if (commandArray.length < 2) {
                var error = msg.channel.send(
                    getError(
                        new BotError(
                            "Not enough arguments.", // Name
                            `x!get command requires at least 1 argument.`, // Description
                            "5" // Code
                        )
                    )
                ).then(msg => {
                    setTimeout(() => msg.delete(), 10000);
                });
                msg.delete();
                break;
            }

            if (commandArray[1] === "latest") {
                console.log("get latest")
                axios.get(ingest + 'info.0.json')
                .then(response => {
                    let data = response.data;
                    let xkcd = new XKCD(data.num, data.safe_title, data.title, data.alt, data.month, data.day, data.year, data.img);
                    msg.channel.send(getXKCDEmbed(xkcd));
                    msg.delete();
                })
                .catch(error => {
                    console.log(error);
                });
            } else if (commandArray[1] === "random") {
                console.log("get random");
                axios.get(ingest + 'info.0.json')
                .then(response => {
                    let data = response.data;
                    let num = Math.floor(Math.random() * (data.num - 1)) + 1;
                    console.log("Chosen XKCD " + num);
                    axios.get(ingest + num + '/info.0.json')
                    .then(response => {
                        let data = response.data;
                        let xkcd = new XKCD(data.num, data.safe_title, data.title, data.alt, data.month, data.day, data.year, data.img);
                        msg.channel.send(getXKCDEmbed(xkcd));
                        msg.delete();
                    })
                    .catch(error => {
                        console.log(error);
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            } else if (sc_id.test(commandArray[1])) {
                console.log("get id " + commandArray[1]);
                axios.get(ingest + commandArray[1] + '/info.0.json')
                .then(response => {
                    let data = response.data;
                    let xkcd = new XKCD(data.num, data.safe_title, data.title, data.alt, data.month, data.day, data.year, data.img);
                    msg.channel.send(getXKCDEmbed(xkcd));
                    msg.delete();
                })
                .catch(error => {
                    console.log(error);
                });
            } else {
                var error = msg.channel.send(
                    getError(
                        new BotError(
                            "Invalid subcommand", // Name
                            `x!get \`${commandArray[1]}\` is not a command. The valid values are <latest|random|numeric id>`, // Description
                            "6" // Code
                        )
                    )
                ).then(msg => {
                    setTimeout(() => msg.delete(), 10000);
                });
                msg.delete();
                break;
            }
    }
}

async function commandHandler(msg) {
    if (msg.author.bot) return;

    if (!msg.content.startsWith(prefix)) return;

    // parse using array

    let commandArray = msg.content.split(" ");

    await parseCommand(commandArray, msg);
}

client.on("message", (msg) => commandHandler(msg));

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({ activity: { name: 'with XKCD | x!help' }, status: 'online' });
});

client.login(bot_options.token);