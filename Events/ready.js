const Discord = require("discord.js");
const loadSlashCommands = require("../Loader/loadSlashCommands");

module.exports = async client =>{
    await loadSlashCommands(bot)
    console.log(`${client.user.tag} is online !`);
}