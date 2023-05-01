const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const inputVideoPath = "input2.mp4";
const thumbnailWidth = 160;
const thumbnailInterval = 8;
const thumbnailsPerSprite = 25;

const outputSpritesDir = "sprites";
if (!fs.existsSync(outputSpritesDir)) {
  fs.mkdirSync(outputSpritesDir);
}

const thumbnailsDir = "thumbnails";
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir);
}
ffmpeg()
  .addInput(inputVideoPath)
  .outputOptions("-vf", `thumbnail,scale=${thumbnailWidth}:-1,tile=10x10`)
  .outputOptions("-frames:v", thumbnailsPerSprite)
  .outputOptions("-vsync", "0")
  .outputOptions("-f", "image2")
  .output(`${outputSpritesDir}/sprite-%d.png`)
  .on("start", (cmd) => {
    console.log(cmd);
  })
  .on("error", (err) => {
    console.log(`Error generating sprites: ${err.message}`);
  })
  .on("end", () => {
    console.log("Sprites generated successfully!");
  })
  .on("progress", (progress) => {
    console.log(`Processing: ${progress.percent}% done`);
  })
  .output(`${outputSpritesDir}/temp-%03d.png`)
  .outputOptions(`-vf`, `thumbnail,scale=${thumbnailWidth}:-1`)
  .outputOptions(`-r`, `1/${thumbnailInterval}`)
  .outputOptions(`-vsync`, `0`)
  .outputOptions(`-frames:v`, `1`)
  .outputOptions(`-threads`, `4`)
  .run();
