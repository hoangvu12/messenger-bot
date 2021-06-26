const path = require("path");
const PixivApi = require("pixiv-api-client");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const { imageStream } = require("../utils");
const pixiv = new PixivApi();
const Global = require("../global");

const refreshToken = process.env.PIXIV_REFRESH_TOKEN;

module.exports = {
  async execute(message, args) {
    const API = Global.client;

    const { access_token } = await pixiv.refreshAccessToken(refreshToken);

    pixiv.auth.access_token = access_token;

    const results = await pixiv.illustRecommended();

    const images = results.illusts.map((illust) => illust.image_urls);

    const selectedImage = images[Math.floor(Math.random() * images.length)];
    const image =
      selectedImage.large ||
      selectedImage.medium ||
      selectedImage.square_medium;

    const attachment = await imageStream(image, {
      headers: {
        Referer: "http://www.pixiv.net/",
      },
    });

    API.sendMessage(
      {
        attachment,
      },
      message.threadID
    );
  },
};
