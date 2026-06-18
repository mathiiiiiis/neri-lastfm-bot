// ==== fm ====
// shows current song or last scrobble
// resolbed username from arg or stored link
//
// > name: fm
// > args: username (optional), linked account (fallback)

const db = require("../lib/db");
const lastfm = require("../lib/lastfm");
const markup = require("../lib/markup");

async function fm(message) {
  const arg = message.command.args[0];
  const username = arg || db.getUsername(message.user.id);

  if (!username) {
    await message.reply(`[#37a0fc]Link your account first with '**/setfm <username>**'`);
    return;
  }

  // ==== fetch ====
  // one song is enough
  let recent;
  try {
    recent = await lastfm.getRecentSongs(username, 1);
  } catch (err) {
    if (err.lastfmCode === 6) {
      await message.reply(`[#cf1717]No Last.fm user named **${username}**!`);
      return;
    }
    throw err;
  }

  const songs = recent && recent.track;
  const song = Array.isArray(songs) ? songs[0] : songs;

  if (!song) {
    await message.reply(`[#37a0fc]**${username}** has no recent scrobbles`);
    return;
  }

  // ==== format ====
  // nowplaying carrues @attr.nowplaying
  // album is dropped when empty
  const nowPlaying = song["@attr"] && song["@attr"].nowplaying === "true";
  const header = nowPlaying ? "Now Playing" : "Last scrobbled";
  const name = song.name;
  const artist = song.artist && song.artist["#text"];
  const album = song.album && song.album["#text"];
  const url = song.url;

  const lines = [
    `**${header}** • ${username}`,
    `**${name}** by ${artist}`,
  ];
  if (album) lines.push(`on //${album}//`);
  if (url) lines.push(markup.link("View on Last.fm", url));

  await message.reply(lines.join("\n"));
}

module.exports = fm;
