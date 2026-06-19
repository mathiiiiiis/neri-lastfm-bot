// ==== entry ====
// boots client, authenticates, routes slash commands to handlers

const { Client, Events } = require("@nerimity/nerimity.js");
const config = require("./config");

const ping = require("./commands/ping");
const setfm = require("./commands/setfm");
const fm = require("./commands/fm");
const topartists = require("./commands/topartists");
const topalbums = require("./commands/topalbums");
const topsongs = require("./commands/topsongs");
const cover = require("./commands/cover");

const client = new Client();

// ==== command router ====
const commands = {
  ping,
  setfm,
  fm,
  topartists,
  topalbums,
  topsongs,
  cover,
};

// ==== lifecycle ====

client.on(Events.Ready, () => {
  console.log(`connected as ${client.user?.username}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.user.id === client.user?.id) return;

  const name = message.command?.name;
  if (!name) return;

  const handler = commands[name];
  if (!handler) return;

  try {
    await handler(message, client);
  } catch (err) {
    console.error(`command ${name} failed`, err);
    await message.reply("Something went wrong X[").catch(() => { });
  }
});

client.login(config.nerimityToken);
