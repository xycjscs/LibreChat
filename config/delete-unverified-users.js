const path = require('path');
const mongoose = require(path.resolve(__dirname, '..', 'api', 'node_modules', 'mongoose'));
const {
  User,
  Agent,
  Assistant,
  Balance,
  Transaction,
  ConversationTag,
  Conversation,
  Message,
  File,
  Key,
  MemoryEntry,
  PluginAuth,
  Prompt,
  PromptGroup,
  Preset,
  Session,
  SharedLink,
  ToolCall,
  Token,
} = require('@librechat/data-schemas').createModels(mongoose);
require('module-alias')({ base: path.resolve(__dirname, '..', 'api') });
const { askQuestion, silentExit } = require('./helpers');
const connect = require('./connect');

async function gracefulExit(code = 0) {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error disconnecting from MongoDB:', err);
  }
  silentExit(code);
}

(async () => {
  await connect();

  /**
   * 显示欢迎信息
   */
  console.purple('--------------------------------');
  console.purple('删除所有未验证邮箱的用户账号');
  console.purple('--------------------------------');

  const users = await User.find({ emailVerified: false });

  if (users.length === 0) {
    console.green('没有找到未验证的用户账号');
    return gracefulExit(0);
  }

  console.yellow(`找到 ${users.length} 个未验证的用户账号`);

  // 显示所有将被删除的用户
  for (const user of users) {
    const balance = await Balance.findOne({ user: user._id });
    const balanceAmount = balance ? balance.tokenCredits : 0;
    console.yellow(`- 邮箱: ${user.email} (${user._id})`);
    console.yellow(`  姓名: ${user.name || '未设置'}`);
    console.yellow(`  余额: ${balanceAmount} credits`);
    console.yellow('  --------------------------------');
  }

  // 询问是否继续删除
  const confirm = (await askQuestion('是否删除以上所有未验证用户及其所有数据？(y/N): '))
    .trim()
    .toLowerCase();

  if (confirm !== 'y') {
    console.yellow('操作已取消');
    return gracefulExit(0);
  }

  const finalConfirm = (
    await askQuestion(
      `此操作将永久删除 ${users.length} 个用户及其所有数据，且无法恢复。\n请输入 "yes" 确认:`,
    )
  )
    .trim()
    .toLowerCase();

  if (finalConfirm !== 'yes') {
    console.yellow('操作已取消');
    return gracefulExit(0);
  }

  console.green('最终确认完毕，开始执行删除...');

  for (const user of users) {
    const uid = user._id.toString();
    console.green(`正在删除用户: ${user.email}`);
    try {
      const tasks = [
        Agent.deleteMany({ author: uid }),
        Assistant.deleteMany({ user: uid }),
        Balance.deleteMany({ user: uid }),
        ConversationTag.deleteMany({ user: uid }),
        Conversation.deleteMany({ user: uid }),
        Message.deleteMany({ user: uid }),
        File.deleteMany({ user: uid }),
        Key.deleteMany({ userId: uid }),
        MemoryEntry.deleteMany({ userId: uid }),
        PluginAuth.deleteMany({ userId: uid }),
        Prompt.deleteMany({ author: uid }),
        PromptGroup.deleteMany({ author: uid }),
        Preset.deleteMany({ user: uid }),
        Session.deleteMany({ user: uid }),
        SharedLink.deleteMany({ user: uid }),
        ToolCall.deleteMany({ user: uid }),
        Token.deleteMany({ userId: uid }),
        Transaction.deleteMany({ user: uid }),
      ];
      await Promise.all(tasks);
      const deletedUser = await User.findOneAndDelete({ _id: user._id });
      if (deletedUser) {
        console.green(`✔ 已成功删除用户: ${user.email} 及其所有数据`);
      }
    } catch (error) {
      console.red(`删除用户 ${user.email} 时发生错误: ${error.message}`);
      console.error(error);
    }
  }

  console.purple('--------------------------------');
  console.green('清理完成！');
  return gracefulExit(0);
})().catch(async (err) => {
  if (!err.message.includes('fetch failed')) {
    console.error('发生未捕获的错误:');
    console.error(err);
    await mongoose.disconnect();
    process.exit(1);
  }
});
