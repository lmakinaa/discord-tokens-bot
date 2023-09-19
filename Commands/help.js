
const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Displays available commands',
  execute(client, message, args) {
    const server = new ButtonBuilder()
    
    .setLabel('Our discord')
    .setURL('https://discord.gg/uUyEYBUWu7')
    .setStyle(ButtonStyle.Link)

    .setEmoji('📢');

const site = new ButtonBuilder()
   
    .setLabel('Our website')
    .setStyle(ButtonStyle.Link)
    .setURL('https://bot.inknovels.com/')
    .setEmoji('🌐');
    

    const row = new ActionRowBuilder()
    .addComponents(server, site);
  
    
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL() 
        })
      .setTitle('Available Commands')
      .setDescription("The bot prefix is `;`\n\n**;bank**: Check your/someone else's balance\n**;claim**: Claim your daily tokens\n**;give**: Transfer tokens to another user\n**;top**: Displays the top 10 users with the biggest balance\n**;services**: List the available services that you can buy with InkCoins\n**/job**: List your services on our bot")

      
    
    message.reply({ embeds: [embed], components: [row], });
  },
};


