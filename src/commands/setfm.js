// ==== setfm ====
// stores callers lastfm username after validating it exists
//
// > name: setfm
// > args: username

const db = require("../lib/db");
const lastfm = require("../lib/lastfm");

async function setfm(message) {
  const username = message.command.args[0];

  if (!username) {
    await message.reply("Usage: `/setfm <username>`");
    return;
  }

  //confirm account exists before storing
  //lastfm code 6 is user not found
  try {
    await lastfm.getUserInfo(username);
  } catch (err) {
    if (err.lastfmCode === 6) {
      await message.reply(`[#cf1717]No Last.fm user named **${username}**!`)
      return;
    }
    throw err;
  }

  db.setUsername(message.user.id, username);
  await message.reply(`[#10ac1a]Linked your Last.fm account: **${username}**`);
}

module.exports = setfm;
