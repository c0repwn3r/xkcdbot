const Discord = require("discord.js");
const client = new Discord.Client();

const bot_options = require("../options/bot_options.json");

const prefix = "x!";

const commands = [
    'get',
    'help',
    'ping',
    'pwr'
];

class BotError {
    constructor(name, description, code) {
        this.name = name;
        this.description = description;
        this.code = code;
    }
}

function getErrorEmbed(error) {
    return new Discord.MessageEmbed()
    .setTitle(`Internal Error - ${error.name}`)
    .setDescription(`Something went wrong :(\nAn internal bot error with code of ${error.code} was thrown, here's the description:\n\`\`\`${error.description}\`\`\``)
    .setColor('#ff0000')
}

function parseCommand(commandArray, msg) {
    if (!(commandArray instanceof Array)) {
        msg.channel.send(getErrorEmbed(new BotError("Invalid command array", "Non-array value passed to command parser as commandArray paramater.", "2")));
        msg.delete();
    }
}

client.on("message", (msg) => {
    if (msg.author.bot) return;

    if (!msg.content.content.startsWith(prefix)) return;

    // parse using array

    let commandArray = msg.content.split(" ");

    parseCommand(commandArray, msg);
});
client.login(bot_options.token);