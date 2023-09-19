module.exports = {
    name: 'users',
    description: 'Show the number of users in the bot database',
    execute(client, message, args) {
      const allowedUsernames = ['eauthor', 'sherzman', 'drako_'];
      if (!allowedUsernames.includes(message.author.username)) {
        return;
      }
      if (!client.db) return message.reply("Database connection is not set up.");
      const sqlSelectCount = 'SELECT COUNT(*) AS userCount FROM users';
      client.db.query(sqlSelectCount, (err, rows) => {
        if (err) throw err;
        const userCount = rows[0].userCount;
        message.reply(`Total number of InkBank users is: ${userCount}`);
      });
    },
  };