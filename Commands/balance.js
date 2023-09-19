module.exports = {
  name: 'bank',
  description: 'Check your balance or the balance of another user',
  execute(client, message, args) {
    if (!client.db) return message.reply("Database connection is not set up.");
    const target = message.mentions.users.first() || message.author;
    const sqlSelect = 'SELECT balance FROM users WHERE id = ?';
    const sqlInsert = 'INSERT INTO users (id, balance) VALUES (?, 0)';
    client.db.query(sqlSelect, [target.id], (err, rows) => {
      if (err) throw err;
      if (rows.length === 0) {
        client.db.query(sqlInsert, [target.id], (err, result) => {
          if (err) throw err;
          console.log(`User with ID ${target.id} added to the database.`);
        });
      }
      const balance = rows.length === 0 ? 0 : rows[0].balance;
      message.reply(`${target.username}, your InkCoin balance is ${balance} credits.`);
    });
  },
};