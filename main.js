require('dotenv').config();
const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799);
const client = new Discord.Client({ intents });
const mysql = require('mysql');
const {ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');






const loadCommands = require("./Loader/loadCommands")
client.commands = new Discord.Collection()

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'v14'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

client.db = db;

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const commands = [
      {
          name: 'help',
          description: 'Displays available commands'
      },
      {
          name: 'job',
          description: 'Create a new service',
          options: [
            {
              name: 'service_type',
              description: "Type of service ('design', 'development', or 'others')",
              type: 3,
              required: true,
            },
            {
              name: 'service_name',
              description: 'Name of service',
              type: 3,
              required: true,
            },
            {
              name: 'service_description',
              description: 'Description of service',
              type: 3,
              required: true,
            },
            {
              name: 'service_price',
              description: 'Price of service (numbers only)',
              type: 4,
              required: true,
            },
          ],
      }
  ];

  await client.application.commands.set(commands);
  console.log(`Registered ${commands.length} application commands`);

    const dis = new ButtonBuilder()
    .setLabel('Our discord')
    .setURL('https://discord.gg/uUyEYBUWu7')
    .setStyle(ButtonStyle.Link)

    .setEmoji('📢');

    const web = new ButtonBuilder()
    .setLabel('Our website')
    .setStyle(ButtonStyle.Link)
    .setURL('https://bot.inknovels.com/')
    .setEmoji('🌐');

    const row1 = new ActionRowBuilder()
      .addComponents(dis, web);

    const embed1 = new EmbedBuilder()
      .setColor('#0099ff')
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL() 
      })
      .setTitle('Available Commands')
      .setDescription("The bot prefix is `;`\n\n**;bank**: Check your/someone else's balance\n**;claim**: Claim your daily tokens\n**;give**: Transfer tokens to another user\n**;top**: Displays the top 10 users with the biggest balance\n**;services**: List the available services that you can buy with InkCoins\n**/job**: List your services on our bot")

    client.on('interactionCreate', async interaction => {
      if (!interaction.isCommand()) return;

      if (interaction.commandName === 'help') {
        await interaction.reply({ embeds: [embed1], components: [row1], });
      } else  if (interaction.commandName === 'job') {
        const userId = interaction.user.id;
        const serviceType = interaction.options.getString('service_type');
        const serviceName = interaction.options.getString('service_name');
        const serviceDescription = interaction.options.getString('service_description');
        const servicePrice = interaction.options.getInteger('service_price');

        if (!['design', 'development', 'others'].includes(serviceType)) {
          return interaction.reply({ content: 'Please enter a valid service type (`design`, `development`, or `others`).', ephemeral: true });
        }
    
        const sqlInsert = 'INSERT INTO services (user_id, service_type, service_name, service_description, service_price, accepted) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [userId, serviceType, serviceName, serviceDescription, servicePrice, 'no'];
        const sqlSelect = 'SELECT balance FROM users WHERE id = ?';
        const SERVICE_FEE = 50;
db.query(sqlSelect, [userId], (err, rows) => {
  if (err) throw err;
  if (rows.length > 0) {
    const currentBalance = rows[0].balance;
    if (currentBalance < SERVICE_FEE) {
      return interaction.reply({ content: 'You do not have enough balance to create a new service.', ephemeral: true });
    }
    const newBalance = currentBalance - SERVICE_FEE;
    const sqlUpdate = 'UPDATE users SET balance = ? WHERE id = ?';
    db.query(sqlUpdate, [newBalance, userId], (err, result) => {
      if (err) throw err;
      console.log(`User with ID ${userId} balance updated: ${newBalance}`);
      db.query(sqlInsert, values, (err, result) => {
        if (err) throw err;
        console.log(`Service added to database: ${serviceName}`);
        interaction.reply({ content: `The ${serviceName} service has been created. It will be displayed once approved`, ephemeral: true});
      });
    });
  } else {
    return interaction.reply({ content: 'An error occurred while retrieving your balance.', ephemeral: true });
  }
});
        
      }
    });
    
  } catch (error) {
    console.error(error);
  }
});

client.on('guildCreate', (guild) => {
  console.log(`Joined new guild: ${guild.name}`);
  guild.members.fetch().then(members => {
    // Get the list of user IDs from the fetched members
    const memberIDs = members.map(member => member.user.id);

    // Query the database to get the list of user IDs
    const sqlSelect = 'SELECT id FROM users';
    db.query(sqlSelect, (err, rows) => {
      if (err) throw err;

      // Get the list of user IDs from the database rows
      const dbUserIDs = rows.map(row => row.id);

      // Find the user IDs that are in the guild but not in the database
      const missingUserIDs = memberIDs.filter(id => !dbUserIDs.includes(id));

      // Insert the missing users into the database
      missingUserIDs.forEach(userID => {
        const sqlInsert = 'INSERT INTO users (id, balance) VALUES (?, 0)';
        db.query(sqlInsert, [userID], (err, result) => {
          if (err) throw err;
          console.log(`User with ID ${userID} added to the database.`);
        });
      });
    });
  });
});

client.on('guildMemberAdd', (member) => {
  const sqlSelect = 'SELECT * FROM users WHERE id = ?';
  db.query(sqlSelect, [member.user.id], (err, rows) => {
    if (err) throw err;
    if (rows.length === 0) {
      const sqlInsert = 'INSERT INTO users (id, balance) VALUES (?, 0)';
      db.query(sqlInsert, [member.user.id], (err, result) => {
        if (err) throw err;
        console.log(`User with ID ${member.user.id} added to database.`);
      });
    }
  });
});

client.login(process.env.TOKEN);


// ... your existing code ...

loadCommands(client)




client.on("messageCreate", async message => {
  const prefixes = [';','?'];
  const prefixUsed = prefixes.find(p => message.content.startsWith(p));
  if (!prefixUsed || message.author.bot) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);
  if (!command) return;
  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command.');
  }
});






