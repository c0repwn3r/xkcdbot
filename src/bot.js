const Discord = require("discord.js");
const client = new Discord.Client();

const bot_options = require("../options/bot_options.json");

const prefix = "x!";

const commands = [
    'get',
    'help',
    'ping',
    'pwr',
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

async function getLatest() {

}

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
                console.log("get latest");
            } else if (commandArray[1] === "random") {
                console.log("get random");
            } else if (sc_id.test(commandArray[1])) {
                console.log("get id " + commandArray[1]);
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
    console.log(`Logged in as ${client.user.tag}`)
});

client.login(bot_options.token);