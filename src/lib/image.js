// ==== image ====
// lastfm image helper; pick largest non-empty url or null
// entry: { site, "#text" }

function largestImage(images) {
  if (!Array.isArray(images)) return null;
  for (let i = images.length - 1; i >= 0; i--) {
    const url = images[i] && images[i]["#text"];
    if (url) return url;
  }
  return null;
}

module.exports = { largestImage };
