module.exports = {
    name: 'top',
    description: 'Displays the top 10 users with the biggest balance',
    execute(client, message, args) {
      if (!client.db) return message.reply("Database connection is not set up.");
      const sql = 'SELECT id, balance FROM users ORDER BY balance DESC LIMIT 10';
      client.db.query(sql, (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) {
          return message.reply(`No users found.`);
        }
        const topUsers = rows.map((row, index) => {
          const user = client.users.cache.get(row.id);
          const position = index + 1;
          const name = user ? user.username : row.id;
          const balance = row.balance;
          return `#${position} | ${name.padEnd(20)} | ${balance.toString().padStart(10)}`;
        });
        const header = `#   | Name                | InkCoin\n${'-'.repeat(38)}`;
        message.channel.send(`\`\`\`${header}\n${topUsers.join('\n')}\`\`\``);
      });
    },
  };