const usetube = require("usetube");
const ytdl = require("ytdl-core");
const fs = require("fs");

const Global = require("../global");
const MessageCollector = require("../utils/MessageCollector");
const path = require("path");

module.exports = {
  async execute(message, args) {
    // Access API with Global.client
    // Do something here
    const API = Global.client;
    let collector = new MessageCollector(message);

    let keyword = args.join(" ");

    if (!keyword) {
      API.sendMessage("Nhập từ khóa", message.threadID);

      keyword = await collector.awaitMessage();
    } else if (ytdl.validateURL(keyword) || ytdl.validateID(keyword)) {
      const videoId = ytdl.getVideoID(keyword);
      const {
        player_response: { videoDetails },
      } = await ytdl.getBasicInfo(videoId);

      return downloadAndSendMessage(
        { id: videoId, title: videoDetails.title },
        message
      );
    }

    const { videos } = await usetube.searchVideo(keyword);

    API.sendMessage(displayMessage(videos.slice(0, 10)), message.threadID);

    const chosenNumber = await collector.awaitMessage();
    const chosenVideo = videos[chosenNumber - 1];

    downloadAndSendMessage(
      { id: chosenVideo.id, title: chosenVideo.original_title },
      message
    );
  },
};

const downloadAndSendMessage = (video, message) => {
  const API = Global.client;

  const filePath = path.resolve(__dirname, `../files/${video.id}.mp3`);
  const stream = ytdl(video.id, { filter: "audioonly" });

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

const displayMessage = (videos) => {
  let message = "";

  videos.forEach((video, i) => {
    message += `[${i + 1}] ${video.original_title}\n\n`;
  });

  message += "\nChọn số ở bên trong []";

  return message;
};
