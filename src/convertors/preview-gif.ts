
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

import Ffmpeg from "fluent-ffmpeg";

Ffmpeg.setFfmpegPath(ffmpegPath);

export const preview_gif = (input:string, output_path:string) => {
  const command = Ffmpeg(input);
  command
    .output(output_path)
    .format("gif")
    .size("480x?")
    .inputOptions(["-ss 10"])
    .outputOptions(["-t 5"])
    .noAudio();
  command
    .on("start", (cmd) => {
    })
    .on("progress", (progress) => {
      console.log("progress", progress);
    })
    .on("error", function (err) {
      console.log("errorss", err);
    })
    .run();
};


