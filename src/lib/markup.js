// ==== markup ====
// nevula markup helpers. URLs are percent encoded to satisfy namedlink
// parser, while existing escapes are preserved
//
// > allowed url chars letters digits: / \ # ? = + & % @ ! ; : . _ ~ -

function safeUrl(url) {
  return url.replace(/[^A-Za-z0-9/\\#?=+&%@!;:._~-]/g, (c) =>
    encodeURIComponent(c)
  );
}

//builds nevula named link with escaoed target
function link(label, url) {
  return `[${label}](${safeUrl(url)})`;
}

module.exports = { safeUrl, link };
