const ffmpeg = require("fluent-ffmpeg");

import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { appendFileSync } from "fs";
ffmpeg.setFfmpegPath(ffmpegPath);

export const fallback = (input: string, output: string) => {
  ffmpeg(input)
    .outputOptions("-c:v libx264")
    .outputOptions("-pix_fmt yuv420p")
    .outputOptions("-r 24")
    .outputOptions("-s 856x?")
    .outputOptions("-b:v 1.8M")
    .outputOptions("-c:a aac")
    .outputOptions("-b:a 128k")
    .outputOptions("-ac 1")
    .outputOptions("-ar 44100")
    .output(output)
    .on("start", (cmd: string) => {
      appendFileSync("fallback.txt", cmd);
    })
    .on("progress", (progress: any) => {
      console.log("progress", progress);
    })
    .on("error", function (err: any) {
      console.log("errorss", err);
    })
    .run();
};
