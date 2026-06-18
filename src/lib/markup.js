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

const SAFE_LABEL = /^[\s*\p{L}\p{N}\u{21}-\u{2F}_]+$/u;

function isSafeLabel(label) {
  if (label.includes("]")) return false;
  return label.length === 1 || SAFE_LABEL.test(label);
}

//builds nevula named link
function link(label, url) {
  const target = safeUrl(url);
  if (isSafeLabel(label)) return `[${label}](${target})`;
  return `${label} [↗](${target})`;
}

module.exports = { safeUrl, link, isSafeLabel };
