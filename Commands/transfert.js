module.exports = {
  name: 'give',
  description: 'Transfer tokens to another user',
  execute(client, message, args) {
    if (!client.db) return message.reply("Database connection is not set up.");
    const author = message.author;
    const target = message.mentions.users.first() || client.users.cache.find(user => user.username === args[0]);
    const amount = parseInt(args[1]);
    if (!target) return message.reply('Please mention a user or provide a valid username to transfer tokens to.');
    if (isNaN(amount) || amount <= 0) return message.reply('Please provide a valid amount of tokens to transfer.');
    if (author.id === target.id) return message.reply('You cannot transfer tokens to yourself.');
    const sqlSelectSender = 'SELECT * FROM users WHERE id = ?';
    client.db.query(sqlSelectSender, [author.id], (err, rows) => {
      if (err) throw err;
      if (rows.length === 0) {
        return message.reply(`You do not have a balance yet.`);
      }
      const senderBalance = rows[0].balance;
      if (senderBalance < amount) {
        return message.reply(`You do not have enough tokens to transfer ${amount} tokens.`);
      }
      const sqlSelectReceiver = 'SELECT * FROM users WHERE id = ?';
      client.db.query(sqlSelectReceiver, [target.id], (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) {
          return message.reply(`${target.username} does not have a balance yet.`);
        }
        const receiverBalance = rows[0].balance;
        const newSenderBalance = senderBalance - amount;
        const newReceiverBalance = receiverBalance + amount;
        const sqlUpdateSender = 'UPDATE users SET balance = ? WHERE id = ?';
        const sqlUpdateReceiver = 'UPDATE users SET balance = ? WHERE id = ?';
        client.db.query(sqlUpdateSender, [newSenderBalance, author.id], (err, result) => {
          if (err) throw err;
          client.db.query(sqlUpdateReceiver, [newReceiverBalance, target.id], (err, result) => {
            if (err) throw err;
            message.reply(`${amount} tokens transferred from your balance to ${target.username}'s balance. Your new balance: ${newSenderBalance}`);
          });
        });
      });
    });
  },
};