// ==== register commands ====
//
// When COMMAND_DEFS get changed run this.
// YOU DO NOT need to run this every time the bot starts
//
// Usage:
// > NERIMITY_TOKEN=<your_token> node src/register.js
// > or: npm run register

const { Client } = require("@nerimity/nerimity.js");
const config = require("./config");

const commands = [
  { name: "ping", description: "How fast do I reply?", args: "" },
  { name: "setfm", description: "Set your Last.fm username.", args: "<username>" },
  { name: "fm", description: "Shows what you're currently playing.", args: "<username>" },
  { name: "topartists", description: "List of your most played artists.", args: "<timeframe> <username> <count>" },
  { name: "topalbums", description: "List of your most played albums.", args: "<timeframe> <username> <count>" },
  { name: "topsongs", description: "List of your most played songs.", args: "<timeframe> <username> <count>" },
  { name: "cover", description: "Retunrs cover art for last played album or custom query.", args: "<album>" },
];

const client = new Client();

client
  .updateCommands(config.nerimityToken, commands)
  .then((res) => {
    console.log("done: commands registered");
    console.log(res);
    process.exit(0);
  })
  .catch((err) => {
    console.error("failed to register commands", err);
    process.exit(1);
  });
