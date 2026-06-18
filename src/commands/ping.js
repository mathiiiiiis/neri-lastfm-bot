// ==== ping ====
// replies with pong, then edits to show latency
//
// > name ping
// > args none

async function ping(message) {
  const start = Date.now();
  const reply = await message.reply("PONG");
  await reply.edit(reply.content + ` (${Date.now() - start}ms)`);
}

module.exports = ping;
