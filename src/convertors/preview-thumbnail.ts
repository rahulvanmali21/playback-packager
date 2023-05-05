import Ffmpeg from "fluent-ffmpeg";
import { mkdirSync ,existsSync} from "fs";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

Ffmpeg.setFfmpegPath(ffmpegPath);

const inputVideoPath = "input2.mp4";
const thumbnailWidth = "160";
const thumbnailInterval = "8";
const thumbnailsPerSprite = "25";

const outputSpritesDir = "sprites";
if (existsSync(outputSpritesDir)) {
    mkdirSync(outputSpritesDir);
}

const thumbnailsDir = "thumbnails";
if (existsSync(thumbnailsDir)) {
    mkdirSync(thumbnailsDir);
}

export const preview_thumbnail = (input:string,outputDir:string)=>{
    Ffmpeg()
    .addInput(input)
    .outputOptions("-vf", `thumbnail,scale=${thumbnailWidth}:-1,tile=10x10`)
    .outputOptions("-frames:v", thumbnailsPerSprite)
    .outputOptions("-vsync", "0")
    .outputOptions("-f", "image2")
    .output(`${outputDir}/sprite-%d.png`)
    .on("start", (cmd:string) => {
      console.log(cmd);
    })
    .on("error", (err:any) => {
      console.log(`Error generating sprites: ${err.message}`);
    })
    .on("end", () => {
      console.log("Sprites generated successfully!");
    })
    .on("progress", (progress) => {
      console.log(`Processing: ${progress.percent}% done`);
    })
    .output(`${outputDir}/temp-%03d.png`)
    .outputOptions(`-vf`, `thumbnail,scale=${thumbnailWidth}:-1`)
    .outputOptions(`-r`, `1/${thumbnailInterval}`)
    .outputOptions(`-vsync`, `0`)
    .outputOptions(`-frames:v`, `1`)
    .outputOptions(`-threads`, `4`)
    .run();
}

