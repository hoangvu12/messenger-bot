const usetube = require("usetube");
const fs = require("fs");
const ytdl = require("ytdl-core");

(async () => {
  ytdl("DvKGTYotSew", { filter: "audioonly" }).pipe(
    fs.createWriteStream("audio.mp3")
  );
})();
