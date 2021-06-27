const usetube = require("usetube");
const ytdl = require("ytdl-core");

const Global = require("../global");
const MessageCollector = require("../utils/MessageCollector");
const { downloadAndSendMessage } = require("../utils/youtube");

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
      message,
      "video"
    );
  },
};

const displayMessage = (videos) => {
  let message = "";

  videos.forEach((video, i) => {
    message += `[${i + 1}] ${video.original_title}\n\n`;
  });

  message += "\nChọn số ở bên trong []";

  return message;
};
