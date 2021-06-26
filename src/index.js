const login = require("facebook-chat-api");
const requireDir = require("require-dir");
const commands = requireDir("./commands");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const Global = require("./global");

const PREFIX = process.env.PREFIX;

login(
  { appState: JSON.parse(fs.readFileSync("appstate.json", "utf-8")) },
  async (err, api) => {
    if (!Global.has("client")) {
      Global.set("client", api);
    }

    api.setOptions({
      selfListen: true,
      logLevel: "silent",
      updatePresence: false,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
    });

    api.listenMqtt(async function (err, message) {
      if (err) return console.error(err);
      if (message.type !== "message") return;
      if (!message.isGroup) return;
      if (!message.body.startsWith(PREFIX)) return;
    });

    try {
      const args = message.body.slice(PREFIX.length).trim().split(/ +/g);
      const command = args.shift().replace(/\./g, "_");

      if (typeof commands[command].execute !== "function") return;

      const userFunction = commands[command].execute;

      userFunction(message, args);
    } catch (err) {
      console.log(err);
      api.sendMessage(`Error: ${err.message}`, message.senderID);
    }
  }
);
