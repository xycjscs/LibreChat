const path = require('path');
require('module-alias')({ base: path.resolve(__dirname, '..', 'api') });
const { askQuestion, silentExit } = require('./helpers');
const User = require('~/models/User');
const Balance = require('~/models/Balance');
const connect = require('./connect');

(async () => {
  await connect();

  /**
   * 显示欢迎信息
   */
  console.purple('--------------------------------');
  console.purple('删除所有未验证邮箱的用户账号');
  console.purple('--------------------------------');

  let users = await User.find({ emailVerified: false });

  if (users.length === 0) {
    console.green('没有找到未验证的用户账号');
    silentExit(0);
    return;
  }

  console.yellow(`找到 ${users.length} 个未验证的用户账号`);

  // 显示所有将被删除的用户
  for (const user of users) {
    const balance = await Balance.findOne({ user: user._id });
    const balanceAmount = balance ? balance.tokenCredits : 0;
    console.yellow(`- 邮箱: ${user.email}`);
    console.yellow(`  姓名: ${user.name || '未设置'}`);
    console.yellow(`  余额: ${balanceAmount} credits`);
    console.yellow('  --------------------------------');
  }

  // 询问是否继续删除
  const confirm = (await askQuestion('是否删除以上所有未验证用户？(y/N): ')).trim().toLowerCase();

  if (confirm !== 'y') {
    console.yellow('操作已取消');
    silentExit(0);
    return;
  }

  for (const user of users) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: user._id });
      if (deletedUser) {
        console.green(`已删除用户: ${user.email}`);
      }
    } catch (error) {
      console.red(`删除用户 ${user.email} 时发生错误: ${error.message}`);
      console.error(error);
    }
  }

  console.purple('--------------------------------');
  console.green('清理完成！');
  silentExit(0);
})();

process.on('uncaughtException', (err) => {
  if (!err.message.includes('fetch failed')) {
    console.error('发生未捕获的错误:');
    console.error(err);
  }

  if (!err.message.includes('fetch failed')) {
    process.exit(1);
  }
});
