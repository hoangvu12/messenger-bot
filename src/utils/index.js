const axios = require("axios");

async function imageStream(url, opts) {
  const options = {
    method: "get",
    url: url,
    responseType: "stream",
  };

  if (opts) {
    for (key in opts) {
      options[key] = opts[key];
    }
  }

  const stream = await axios(options);

  return stream.data;
}

module.exports = {
  imageStream,
};
