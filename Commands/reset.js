module.exports = {
  name: 'reset',
  description: 'Reset a user\'s balance to 0',
  execute(client, message, args) {
    const allowedUsernames = ['eauthor', 'sherzman', 'drako_'];
    if (!allowedUsernames.includes(message.author.username)) {
      return;
    }
    if (!client.db) return message.reply("Database connection is not set up.");
    const target = message.mentions.users.first() || client.users.cache.find(user => user.username === args[0]);
    if (!target) return message.reply('Please mention a user or provide a valid username to reset.');
    const sqlUpdate = 'UPDATE users SET balance = ?, last_claim_time = NULL WHERE id = ?';
    client.db.query(sqlUpdate, [0, target.id], (err, result) => {
      if (err) throw err;
      message.reply({content: `${target.username}'s balance and last claim time have been reset.`, ephemeral: true});
    });
  },
};