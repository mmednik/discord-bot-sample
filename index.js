const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "%";

client.on("messageCreate", function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  switch (command) {
    case "viva":
      const timeTaken = Date.now() - message.createdTimestamp;
      message.reply(`Perón! La latencia fue de ${timeTaken}ms.`);
      break;
    case "sumar":
      const numArgs = args.map((x) => parseFloat(x));
      const sum = numArgs.reduce((counter, x) => (counter += x));
      message.reply(`La suma de los números es ${sum}!`);
  }
});

client.login(config.BOT_TOKEN);
