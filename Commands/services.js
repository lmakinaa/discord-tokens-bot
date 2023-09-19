const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'services',
  description: 'List the available services that you can buy with InkCoins',
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
      .setTitle('Available Services')
      .setDescription('The available services now are:\n\n' +
        '**design:** List the available designers and their services\n' +
        '**dev:** List the available developers and their services\n' +
        '**translate:** List the available translators and their services\n' +
        '**others:** List other services');

    message.reply({ embeds: [embed], components: [row] });
  },
};