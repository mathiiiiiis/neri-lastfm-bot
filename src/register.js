// ==== register commands ====
//
// When COMMAND_DEFS get changed run this.
// YOU DO NOT need to run this every time the bot starts
//
// Usage:
// > NERIMITY_TOKEN=<your_token> node src/register.js
// > or: npm run register

const { Client } = require("@nerimity/nerimity.js");
const config = require("./config.js");

const commands = [
  { name: "ping", description: "How fast do I reply?", args: "" },
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
