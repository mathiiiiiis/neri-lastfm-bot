// ==== timeframe ====
// maps friendly timeframe names to lastfm period tokens and labels
//
// > week: 7day
// > month: 1month
// > 3month: 3month
// > 6month: 6month
// > year: 12month
// > all: overall

const config = require("../config");

const PERIODS = {
  week: "7day",
  month: "1month",
  "3month": "3month",
  "6month": "6month",
  year: "12month",
  all: "overall",
};

const ALIASES = {
  weekly: "week",
  monthly: "month",
  yearly: "year",
  alltime: "all",
  overall: "all",
  "7day": "week",
  "1month": "month",
  "12month": "year",
};

const LABELS = {
  "7day": "past week",
  "1month": "past month",
  "3month": "past 3 months",
  "6month": "past 6 months",
  "12month": "past year",
  overall: "all time",
};

const DEFAULT = "all";

// ==== api ====

function normalise(word) {
  if (!word) return null;
  const key = String(word).toLowerCase();
  if (PERIODS[key]) return key;
  if (ALIASES[key]) return ALIASES[key];
  return null;
};

//repots wether word is a recognised timeframe
function isKnown(word) {
  return normalise(word) !== null;
}

//returns lastfm period token, defaulting on an unknown word
function resolve(word) {
  return PERIODS[normalise(word) || DEFAULT];
}

//returns readable phrase for period token
function label(period) {
  return LABELS[period] || period;
}

module.exports = { resolve, isKnown, label, DEFAULT };
