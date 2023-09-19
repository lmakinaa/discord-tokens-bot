module.exports = {
  name: 'add',
  description: 'Add tokens to a user',
  execute(client, message, args) {
    const allowedUsernames = ['eauthor', 'sherzman', 'drako_'];
    if (!allowedUsernames.includes(message.author.username)) {
      return;
    }
    if (!client.db) return message.reply("Database connection is not set up.");
    const target = message.mentions.users.first() || client.users.cache.find(user => user.username === args[0]);
    const amount = parseInt(args[1]);
    if (!target) return message.reply('Please mention a user or provide a valid username to add tokens to.');
    if (isNaN(amount) || amount <= 0) return message.reply('Please provide a valid amount of tokens to add.');
    const sqlSelect = 'SELECT * FROM users WHERE id = ?';
    client.db.query(sqlSelect, [target.id], (err, rows) => {
      if (err) throw err;
      if (rows.length === 0) {
        return message.reply(`${target.username} does not have a balance yet.`);
      }
      const balance = rows[0].balance;
      const newBalance = balance + amount;
      const sqlUpdate = 'UPDATE users SET balance = ? WHERE id = ?';
      client.db.query(sqlUpdate, [newBalance, target.id], (err, result) => {
        if (err) throw err;
        message.reply(`${amount} tokens added to ${target.username}'s balance. New balance: ${newBalance}`);
      });
    });
  },
};