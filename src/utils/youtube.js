const fs = require("fs");
const path = require("path");
const ytdl = require("ytdl-core");

const Global = require("../global");

const downloadAndSendMessage = (video, message, type) => {
  const API = Global.client;

  let fileType;

  if (type === "audio") fileType = "mp3";
  else fileType = "mp4";

  const filePath = path.resolve(__dirname, `../files/${video.id}.${fileType}`);
  const stream = ytdl(video.id);

  stream.pipe(fs.createWriteStream(filePath));

  API.sendMessage(`Bắt đầu tải ${video.title}...`, message.threadID);

  stream.once("end", () => {
    API.sendMessage("Bắt đầu upload", message.threadID);

    API.sendMessage(
      {
        attachment: fs.createReadStream(filePath),
      },
      message.threadID
    );

    fs.unlinkSync(filePath);
  });
};

module.exports = {
  downloadAndSendMessage,
};
