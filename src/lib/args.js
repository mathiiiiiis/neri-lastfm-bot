// ==== args ====
// shared parser for top-list args: <timeframe> <username> <count>
//
// detects leading timeframe and trailing count from space-split args
//
// > timeframe: optional, defaults via timeframe module
// > count: optional int, clamped to 1..MAX_COUNT
// > username: remaining args, or null

const timeframe = require("./timeframe");

const DEFAULT_COUNT = 10;
const MAX_COUNT = 50;

function parseListArgs(args) {
  const tokens = (args || []).filter(Boolean);

  //leading timeframe word > else default
  let period;
  if (tokens.length && timeframe.isKnown(tokens[0])) {
    period = timeframe.resolve(tokens.shift());
  } else {
    period = timeframe.resolve(timeframe.DEFAULT);
  }

  //trailing integer count > else default
  let count = DEFAULT_COUNT;
  if (tokens.length && /^\d+$/.test(tokens[tokens.length - 1])) {
    const n = parseInt(tokens.pop(), 10);
    count = Math.min(Math.max(n, 1), MAX_COUNT);
  }

  const username = tokens.join(" ") || null;
  return { period, count, username };
}

module.exports = { parseListArgs, DEFAULT_COUNT, MAX_COUNT };
