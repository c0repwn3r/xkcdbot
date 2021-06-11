const Discord = require("discord.js");
const client = new Discord.Client();

const bot_options = require("../bot_options.json");

const prefix = "x!";

const commands = [

];

client.on("msg")

client.login(bot_options.token);