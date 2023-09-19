const fs = require("fs");

module.exports = async client => {
  const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`../Commands/${file}`);
    if (!command.name) throw new TypeError(`Command ${file} doesn't have a name.`);
    client.commands.set(command.name, command);
    console.log(`Command ${command.name} loaded.`);
  }
};