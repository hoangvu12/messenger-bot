const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const PixivApi = require("pixiv-api-client");
const pixiv = new PixivApi();

const refreshToken = "F6FMCI27CDQoc09VRqyTgsox1J7xDOlIlI2AFBNXQjs";

(async () => {
  const { access_token } = await pixiv.refreshAccessToken(refreshToken);

  pixiv.auth.access_token = access_token;

  const results = await pixiv.illustRecommended();

  const images = results.illusts.map((illust) => illust.image_urls);

  const selectedImage = images[Math.floor(Math.random() * images.length)];
  const image =
    selectedImage.large || selectedImage.medium || selectedImage.square_medium;

  console.log(image);

  // const attachment = await helper.file_stream(image, {
  //   headers: {
  //     Referer: "http://www.pixiv.net/",
  //   },
  // });
  // return attachment;
})();
