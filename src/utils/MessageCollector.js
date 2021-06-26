const { EventEmitter } = require("events");
const MINUTE = 60000;

class MessageCollector {
  static users = [];

  constructor(event, options = {}) {
    this.event = event;
    this.options = options;
  }

  setTimeOut(timeout) {
    return setTimeout(() => this.end(this.event.senderID), timeout);
  }

  end(reason = "timeout") {
    clearTimeout(this.user.timeout);

    this.user.event.emit("end", reason);

    this.user.event.removeAllListeners();

    MessageCollector.removeUser(this.user.senderID);
  }

  static send({ event, api }) {
    const user = MessageCollector.getUser(event);

    user.event.emit("collect", { event, api });
  }

  static getUser(event) {
    const user = MessageCollector.users.find(
      (user) => user.senderID === event.senderID
    );

    return user;
  }

  static isAwaitingMessage(event) {
    return !!MessageCollector.getUser(event);
  }

  static removeUser(senderID) {
    const filteredUsers = MessageCollector.users.filter(
      (user) => user.senderID !== senderID
    );

    MessageCollector.users = [...filteredUsers];

    console.log(filteredUsers);
  }

  awaitMessage() {
    const self = this;

    const { timeout = MINUTE * 5 } = this.options;

    this.user = {
      event: new EventEmitter(),
      messageCount: 0,
      opts: { timeout },
      threadID: this.event.threadID,
      senderID: this.event.senderID,
    };

    this.user.timeout = this.setTimeOut(this.user.opts.timeout);

    MessageCollector.users.push(this.user);
    return new Promise((resolve, reject) => {
      self.user.event.on("collect", ({ event }) => {
        self.end("max");
        resolve(event.body);
      });
    });
  }
}

module.exports = MessageCollector;
