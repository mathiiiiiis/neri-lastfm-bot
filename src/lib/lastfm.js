// ==== lastfm wrapper ====
// thin Last.fm REST wrapper over fetch
// request injects API key and normalizes errors
//
// > base: https://ws.audioscrobbler.com/2.0/
// > errors: HTTP 200 error bodies are thrown as exceptions

const config = require("../config");

const BASE = "https://ws.audioscrobbler.com/2.0/";

// ==== core request ====
// builds query, applies api key and json format
// throws on api errors

async function request(method, params = {}) {
  const url = new URL(BASE);
  url.searchParams.set("method", method);
  url.searchParams.set("api_key", config.lastfmApiKey);
  url.searchParams.set("format", "json");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url);
  const body = await res.json().catch(() => null);

  if (!body) {
    throw new Error("lastfm returned unreadable response");
  }
  if (body.error) {
    const err = new Error(body.message || "lastfm error");
    err.lastfmCode = body.error;
    throw err;
  }
  return body;
}

// ==== methods ====

//returns recenttracks payload for a user
//now playing song, when present, carries @attr.nowplaying
async function getRecentSongs(username, limit = 1) {
  const body = await request("user.getRecentTracks", {
    user: username,
    limit,
  });
  return body.recenttracks;
}

//returns user payload
//used to validate username on setfm
async function getUserInfo(username) {
  const body = await request("user.getInfo", { user: username });
  return body.user;
}

//returns topartists payload for a user and period
async function getTopArtists(username, period, limit = 10) {
  const body = await request("user.getTopArtists", {
    user: username,
    period,
    limit,
  });
  return body.topartists;
}

//returns topalbum payload for a user and period
async function getTopAlbums(username, period, limit = 10) {
  const body = await request("user.getTopAlbums", {
    user: username,
    period,
    limit,
  });
  return body.topalbums;
}

//returns toptracks payload for a user and period
async function getTopSongs(username, period, limit = 10) {
  const body = await request("user.getTopTracks", {
    user: username,
    period,
    limit,
  });
  return body.toptracks;
}

//return album payload for an artist and album title
async function getAlbumInfo(artist, album) {
  const body = await request("album.getInfo", { artist, album });
  return body.album;
}

module.exports = {
  getRecentSongs,
  getUserInfo,
  getTopArtists,
  getTopAlbums,
  getTopSongs,
  getAlbumInfo,
};
