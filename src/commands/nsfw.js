const akaneko = require("akaneko");
const path = require("path");
const fs = require("fs");

const Global = require("../global");
const { imageStream } = require("../utils");

const ALLOWED_TYPES = {
  ass: "I know you like anime ass~ uwu",
  bdsm: "If you don't know what it is, search it up",
  blowjob: "Basically an image of a girl sucking on a sharp blade!",
  cum: "Basically sticky white stuff that is usually milked from sharpies.",
  doujin: "Sends a random doujin page imageURL!",
  feet: "So you like smelly feet huh?",
  femdom: "Female Domination?",
  foxgirl: "Girl's that are wannabe foxes, yes",
  gifs: "Basically an animated image, so yes :3",
  glasses: "Girls that wear glasses, uwu~",
  hentai: "Sends a random vanilla hentai imageURL~",
  netorare: "Wow, I won't even question your fetishes.",
  maid: "Maids, Maid Uniforms, etc, you know what maids are :3",
  masturbation: "Solo Queue in CSGO!",
  orgy: "Group Lewd Acts",
  panties: "I mean... just why? You like underwear?",
  pussy: "The genitals of a female, or a cat, you give the meaning.",
  school: "School Uniforms!~ Yatta~!",
  succubus: "Spooky Succubus, oh I'm so scared~ Totally don't suck me~",
  tentacles: "I'm sorry but, why do they look like intestines?",
  thighs: "The top part of your legs, very hot, isn't it?",
  uglyBastard: "The one thing most of us can all agree to hate :)",
  uniform: "Military, Konbini, Work, Nurse Uniforms, etc!~ Sexy~",
  yuri: "Girls on Girls, and Girl's only!<3",
  zettaiRyouiki: "That one part of the flesh being squeeze in thigh-highs~<3",
};

module.exports = {
  async execute(message, args) {
    const API = Global.client;

    const type = args.join("");

    if (!type) {
      return downloadAndSendMessage("random", message);
    }

    if (type === "help") {
      let msg = "";

      for (let [key, value] of Object.entries(ALLOWED_TYPES)) {
        msg += `${key}: ${value}\n\n`;
      }

      return API.sendMessage(msg, message.threadID);
    }

    if (!Object.keys(ALLOWED_TYPES).includes(type)) {
      return API.sendMessage(
        "Không tìm thấy thể loại. !nsfw help để xem chi tiết",
        message.threadID
      );
    }

    downloadAndSendMessage(type, message);
  },
};

const downloadAndSendMessage = async (type, message) => {
  const API = Global.client;

  const directory = path.resolve(__dirname, "../files");
  const filePath = path.resolve(__dirname, `../files/${type}.png`);

  const url = await akaneko.nsfw[type]();
  const stream = await imageStream(url);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  stream.pipe(fs.createWriteStream(filePath));

  stream.once("end", () => {
    API.sendMessage(
      {
        attachment: fs.createReadStream(filePath),
      },
      message.threadID
    );

    fs.unlinkSync(filePath);
  });
};
