const Global = require("../global");

const API = Global.client;

module.exports = {
  execute(message, args) {
    // Access API with Global.client
    // Do something here

    API.sendMessage("This is a message", message.threadID);
  },
};
