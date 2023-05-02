const ffmpeg = require("fluent-ffmpeg");
const { appendFileSync } = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const preview_gif = (input, output_path) => {
  const command = ffmpeg(inputPath);
  command
    .output(gif_path)
    .format("gif")
    .size("480x?")
    .inputOptions(["-ss 10"])
    .outputOptions(["-t 5"])
    .noAudio();
  command
    .on("start", (cmd) => {
      appendFileSync("dash.txt", cmd);
    })
    .on("progress", (progress) => {
      console.log("progress", progress);
    })
    .on("error", function (err) {
      console.log("errorss", err);
    })
    .run();
};

module.exports = preview_gif;
