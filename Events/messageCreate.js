const Discord = require("discord.js")
module.exports = async(client, message)=>{
    let prefix = ";"
    let messageArray = message.content.split(" ")
    let commandNmae = messageArray[0].slice(prefix.length)
    let args = messageArray.slice(1)

    if(!message.content.startsWith(prefix)) return;
    let command = require(`../Commands/${commandName}`)
    if(!command) return message.reply("There is no command !")

    command.run(client, message, args)
}