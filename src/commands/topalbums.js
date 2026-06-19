// ==== topalbums ====
// lists users most played albums for timeframe
//
// > name: topalbums
// > args: timeframe, username, count

const db = require("../lib/db");
const lastfm = require("../lib/lastfm");
const markup = require("../lib/markup");
const timeframe = require("../lib/timeframe");
const { parseListArgs } = require("../lib/args");

async function topalbums(message) {
  const { period, count, username: arg } = parseListArgs(message.command.args);
  const username = arg || db.getUsername(message.user.id);

  if (!username) {
    await message.reply(`[#37a0fc]Link your account first with '**/setfm <username>**'`);
    return;
  }

  // ==== fetch ====
  let top;
  try {
    top = await lastfm.getTopAlbums(username, period, count);
  } catch (err) {
    if (err.lastfmCode === 6) {
      await message.reply(`[#cf1717]No Last.fm user named **${username}**!`);
      return;
    }
    throw err;
  }

  // ==== format ====
  // album is an array or single onject when only one result is returned
  // artist is shown as plain text after linked album title
  const raw = top && top.album;
  const albums = Array.isArray(raw) ? raw : raw ? [raw] : [];

  if (!albums.length) {
    await message.reply(
      `[#37a0fc]**${username}** has no top albums for ${timeframe.label(period)}`
    );
    return;
  }

  const lines = albums.map((a, i) => {
    const plays = Number(a.playcount).toLocaleString();
    const artist = a.artist && a.artist.name;
    return `${i + 1}. ${markup.link(a.name, a.url)} – ${artist} • ${plays} play(s)`;
  });

  const head = `**Top albums** • ${timeframe.label(period)} • ${username}`;
  await message.reply([head, ...lines].join("\n"));
}

module.exports = topalbums;
