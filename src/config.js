// ==== config ====
// loads runtime config from env
// fail fast on missing required values

const config = {
  nerimityToken: process.env.NERIMITY_TOKEN,
  lastfmApiKey: process.env.LASTFM_API_KEY,
};

// ==== validation ====

if (!config.nerimityToken) {
  console.error("missing NERIMITY_TOKEN!!");
  process.exit(1);
}

if (!config.lastfmApiKey) {
  console.error("missing LASTFM_API_KEY!!");
  process.exit(1);
}

module.exports = config;
