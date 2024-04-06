const path = require('path');
require('module-alias')({ base: path.resolve(__dirname, '..', 'api') });
const { silentExit } = require('./helpers');
const Balance = require('~/models/Balance');
const User = require('~/models/User');
const { Transaction } = require('~/models/Transaction');
const connect = require('./connect');

(async () => {
  await connect();

  /**
   * Show the welcome / help menu
   */
  console.purple('-----------------------------');
  console.purple('Show the balance of all users');
  console.purple('-----------------------------');

  let users = await User.find({});
  for (const user of users) {
    let balance = await Balance.findOne({ user: user._id });
    if (balance !== null) {
      console.green(`User ${user.email} has a balance of ${balance.tokenCredits}`);
      if (balance.tokenCredits < 100000) {
        const amount = 100000 - balance.tokenCredits;
        try {
          await Transaction.create({
            user: user._id,
            tokenType: 'credits',
            context: 'admin',
            rawAmount: +amount,
          });
        } catch (error) {
          console.red('Error: ' + error.message);
          console.error(error);
          silentExit(1);
        }
        console.green(`User ${user.email}'s balance has been increased to 100000`);
      }
    } else {
      console.yellow(`User ${user.email} has no balance`);
      try {
        await Transaction.create({
          user: user._id,
          tokenType: 'credits',
          context: 'admin',
          rawAmount: 100000,
        });
      } catch (error) {
        console.red('Error: ' + error.message);
        console.error(error);
        silentExit(1);
      }
      console.green(`User ${user.email}'s balance has been set to 100000`);
    }
  }

  silentExit(0);
})();

process.on('uncaughtException', (err) => {
  if (!err.message.includes('fetch failed')) {
    console.error('There was an uncaught error:');
    console.error(err);
  }

  if (!err.message.includes('fetch failed')) {
    process.exit(1);
  }
});
