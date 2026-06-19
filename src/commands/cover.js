// ==== cover ====
// shows album cover as html embed
// no args: use last scrobbles
// else: use album.getInfo, resolve "artist - album"
//
// > name: cover
// > args: album (optional, when format == artist - album)

const db = require("../lib/db");
const lastfm = require("../lib/lastfm");
const embed = require("../lib/embed");
const { largestImage } = require("../lib/image");

// ==== build ====
// builds album embed html: style block + card markup
function buildCard({ name, artist, url, cover }) {
  const css = `
    .cover-card { display:flex; flex-direction:column; width:200px; background:#1a1a1a; border-radius:12px; overflow:hidden; }
    .cover-img { width:200px; height:200px; object-fit:cover; display:block; }
    .cover-meta { display:flex; flex-direction:column; gap:2px; padding:12px 14px; }
    .cover-title { font-weight:600; font-size:15px; color:#fff; text-decoration:none; }
    .cover-artist { font-size:14px; color:#aaa; }
  `;

  const safeName = embed.escape(name);
  const title = url
    ? embed.el("a", { class: "cover-title", href: url }, [safeName])
    : embed.el("div", { class: "cover-title" }, [safeName]);

  const card = embed.el("div", { class: "cover-card" }, [
    embed.el("img", { class: "cover-img", src: cover }),
    embed.el("div", { class: "cover-meta" }, [
      title,
      embed.el("div", { class: "cover-artist" }, [embed.escape(artist)]),
    ]),
  ]);

  return embed.el("style", {}, [css]) + card;
}

// ==== resolve ====
// custom: split "artist - album"
// default: last scrobble > album.getInfo, fallback to scrobble cover
async function resolveCustom(query) {
  const sep = query.indexOf(" - ");
  if (sep === -1) return { error: "[#37a0fc]Use the format `artist - album`" };

  const artist = query.slice(0, sep).trim();
  const album = query.slice(sep + 3).trim();
  if (!artist || !album) return { error: "[#37a0fc]Use the format `artist - album`" };

  let info;
  try {
    info = await lastfm.getAlbumInfo(artist, album);
  } catch (err) {
    if (err.lastfmCode === 6) return { error: "[#cf1717]Couldn't find that album :/" };
    throw err;
  }

  const cover = largestImage(info.image);
  if (!cover) return { error: `[#37a0fc]No cover art for **${info.name}**` };
  return { album: { name: info.name, artist: info.artist, url: info.url, cover } };
}

async function resolveLastPlayed(userId) {
  const username = db.getUsername(userId);
  if (!username) {
    return { error: `[#37a0fc]Link your account first with '**/setfm <username>**'` };
  }

  const recent = await lastfm.getRecentSongs(username, 1);
  const raw = recent && recent.track;
  const song = Array.isArray(raw) ? raw[0] : raw;
  if (!song) return { error: `[#37a0fc]**${username}** has no recent scrobbles` };

  const artist = song.artist && song.artist["#text"];
  const album = song.album && song.album["#text"];
  if (!album) return { error: "[#37a0fc]Your last song has no album info" };

  //pick largest art or scrobble image fallback
  let cover, url, name = album;
  try {
    const info = await lastfm.getAlbumInfo(artist, album);
    cover = largestImage(info.image);
    url = info.url;
    name = info.name;
  } catch (err) {
    if (err.lastfmCode !== 6) throw err;
  }
  if (!cover) cover = largestImage(song.image);
  if (!url) url = song.url;
  if (!cover) return { error: `[#37a0fc]No cover art for **${album}**` };

  return { album: { name, artist, url, cover } };
}

async function cover(message) {
  const query = message.command.args.join(" ").trim();

  const resolved = query
    ? await resolveCustom(query)
    : await resolveLastPlayed(message.user.id);

  if (resolved.error) {
    await message.reply(resolved.error);
    return;
  }

  const htmlEmbed = buildCard(resolved.album);
  await message.reply(undefined, { htmlEmbed });
}

module.exports = cover;
