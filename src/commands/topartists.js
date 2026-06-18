// ==== topartists ====
// lists users most played artist for timeframe
//
// > name: topartists
// > args: timeframe, username, count

const db = require("../lib/db");
const lastfm = require("../lib/lastfm");
const markup = require("../lib/markup");
const timeframe = require("../lib/timeframe");
const { parseListArgs } = require("../lib/args");

async function topartists(message) {
  const { period, count, username: arg } = parseListArgs(message.command.args);
  const username = arg || db.getUsername(message.user.id);

  if (!username) {
    await message.reply(`[#37a0fc]Link your account first with '**/setfm <username>**'`);
    return;
  }

  // ==== fetch ====
  let top;
  try {
    top = await lastfm.getTopArtists(username, period, count);
  } catch (err) {
    if (err.lastfmCode === 6) {
      await message.reply(`[#cf1717]No Last.fm user named **${username}**!`);
      return;
    }
    throw err;
  }

  // ==== format ====
  // artist is an array or single onject when only one result is returned
  const raw = top && top.artist;
  const artists = Array.isArray(raw) ? raw : raw ? [raw] : [];

  if (!artists.length) {
    await message.reply(
      `[#37a0fc]**${username}** has no top artists for ${timeframe.label(period)}`
    );
    return;
  }

  const lines = artists.map((a, i) => {
    const plays = Number(a.playcount).toLocaleString();
    return `${i + 1}. ${markup.link(a.name, a.url)} – ${plays} play(s)`;
  });

  const head = `**Top artists** • ${timeframe.label(period)} • ${username}`;
  await message.reply([head, ...lines].join("\n"));
}

module.exports = topartists;
