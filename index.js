const AsciiTable = require("ascii-table");
const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "%";
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: `keys/${config.GOOGLE_SHEET_API}.json`,
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

let readData;

async function getSheetData() {
  const authClientObject = await auth.getClient();

  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });
  const spreadsheetId = config.SPREADSHEET_ID;

  readData = await googleSheetsInstance.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
  });
}

getSheetData();

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
    case "data":
      
      const table = new AsciiTable("");
      let i=0;
      readData.data.values.forEach((row) => {
        if(i==0){
          table.setHeading(row[0], row[1]);
        } else {
          table.addRow(row[0], row[1]);
        }
        i++;
      });
      message.reply(table.toString());
      break;
  }
});

client.login(config.BOT_TOKEN);
