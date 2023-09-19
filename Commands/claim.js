const msPerDay = 24 * 60 * 60 * 1000; // milliseconds per day
const maxTotalBalance = 10000000; // 10 million
module.exports = {
  name: 'claim',
  description: 'Claim your daily amount of InkCoin',
  execute(client, message, args) {
    if (!client.db) return message.reply("Database connection is not set up.");
    const sqlSelectTotalBalance = 'SELECT total_balance FROM stats';
    client.db.query(sqlSelectTotalBalance, (err, rows) => {
      if (err) throw err;
      const totalBalance = rows[0].total_balance;
      if (totalBalance >= maxTotalBalance) {
        return message.reply('Sorry, the maximum total balance has been reached. No more daily rewards can be claimed.');
      }
      const sqlSelect = 'SELECT * FROM users WHERE id = ?';
      client.db.query(sqlSelect, [message.author.id], (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) {
          const sqlInsert = 'INSERT INTO users (id, balance, last_claim_time) VALUES (?, 0, ?)';
          const currentTime = new Date().getTime();
          client.db.query(sqlInsert, [message.author.id, currentTime], (err, result) => {
            if (err) throw err;
            console.log(`User with ID ${message.author.id} added to the database.`);
          });
        }
        const lastClaimTime = rows[0].last_claim_time;
        const currentTime = new Date().getTime();
        if (lastClaimTime && currentTime - lastClaimTime < msPerDay) {
          const remainingTime = msPerDay - (currentTime - lastClaimTime);
          const remainingTimeHours = Math.floor(remainingTime / (60 * 60 * 1000));
          const remainingTimeMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
          const remainingTimeSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
          return message.reply(`You can claim your daily reward again in ${remainingTimeHours}h ${remainingTimeMinutes}m ${remainingTimeSeconds}s.`);
        }
        const daily = Math.floor(Math.random() * (50 - 5) + 5); // Random number of tokens claimed
        const sqlUpdate = 'UPDATE users SET balance = balance + ?, last_claim_time = ? WHERE id = ?';
        client.db.query(sqlUpdate, [daily, currentTime, message.author.id], (err, result) => {
          if (err) throw err;
          const sqlUpdateTotalBalance = 'UPDATE stats SET total_balance = total_balance + ?';
          client.db.query(sqlUpdateTotalBalance, [daily], (err, result) => {
            if (err) throw err;
            message.reply(`Congratulations! You claimed ${daily} InkCoin.`);
          });
        });
      });
    });
  },
};

/*

const msPerDay = 24 * 60 * 60 * 1000; // milliseconds per day
const maxTotalBalance = 10000000; // 10 million
const daily = Math.floor(Math.random() * (50 - 5) + 5);

module.exports = {
  name: 'claim',
  description: 'Claim your daily amount of InkCoin',
  execute(client, message, args) {
    if (!client.db) return message.reply("Database connection is not set up.");
    const sqlSelectTotalBalance = 'SELECT total_balance FROM stats';
    client.db.query(sqlSelectTotalBalance, (err, rows) => {
      if (err) throw err;
      const totalBalance = rows[0].total_balance;
      if (totalBalance >= maxTotalBalance) {
        return message.reply('Sorry, the maximum total balance has been reached. No more daily rewards can be claimed.');
      }
      const sqlSelect = 'SELECT * FROM users WHERE id = ?';
      client.db.query(sqlSelect, [message.author.id], (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) {
          return message.reply('You do not have a balance yet.');
        }
        const lastClaimTime = rows[0].last_claim_time;
        const currentTime = new Date().getTime();
        if (lastClaimTime && currentTime - lastClaimTime < msPerDay) {
          const remainingTime = msPerDay - (currentTime - lastClaimTime);
          const remainingTimeHours = Math.floor(remainingTime / (60 * 60 * 1000));
          const remainingTimeMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
          const remainingTimeSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
          return message.reply(`You can claim your daily reward again in ${remainingTimeHours}h ${remainingTimeMinutes}m ${remainingTimeSeconds}s.`);
        }
        const sqlUpdate = 'UPDATE users SET balance = balance +' + daily +', last_claim_time = ? WHERE id = ?';
        client.db.query(sqlUpdate, [currentTime, message.author.id], (err, result) => {
          if (err) throw err;
          const sqlUpdateTotalBalance = 'UPDATE stats SET total_balance = total_balance + 10';
          client.db.query(sqlUpdateTotalBalance, (err, result) => {
            if (err) throw err;
            message.reply('Congratulations! You claimed ' + daily + ' InkCoin.');
          });
        });
      });
    });
  },
};

*/