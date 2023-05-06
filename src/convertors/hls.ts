const ffmpeg = require("fluent-ffmpeg");
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { appendFileSync } from "fs";

const ffprobePath = require("@ffprobe-installer/ffprobe").path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const resolutions = [
  {
    name: "640x360",
    width: 640,
    height: -2,
    bitrate: "365k",
    maxrate: "390k",
    bufsize: "640k",
  },
  {
    name: "480p",
    width: 854,
    height: -2,
    bitrate: "750k",
    maxrate: "2.14M",
    bufsize: "3.5M",
  },
  {
    name: "720p",
    width: 1280,
    height: -2,
    bitrate: "3M",
    maxrate: "3.21M",
    bufsize: "5.5M",
  },
  {
    name: "720p",
    width: 1280,
    height: -2,
    bitrate: "4.5M",
    maxrate: "4.8M",
    bufsize: "8M",
  },
  {
    name: "1080p",
    width: 1920,
    height: -2,
    bitrate: "6M",
    maxrate: "6.42M",
    bufsize: "11M",
  },
  {
    name: "1080p",
    width: 1920,
    height: -2,
    bitrate: "7.8M",
    maxrate: "8.3M",
    bufsize: "14M",
  },
];

export function convertToHls(inputPath: string, outputPath: string) {
  const command = ffmpeg(inputPath).addOptions([
    "-y",
    "-preset",
    "veryfast",
    "-keyint_min",
    "100",
    "-g",
    "100",
    "-sc_threshold",
    "0",
    "-r",
    "24",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-ac",
    "1",
    "-ar",
    "44100",
  ]);

  resolutions.forEach((resolution, index) => {
    command.addOption(`-map`, `v:0`);
    command.addOption(`-vf`, `scale=${resolution.width}:-2`);
    command.addOption(`-b:v:${index}`, resolution.bitrate);
    command.addOption(`-maxrate:${index}`, resolution.maxrate);
    command.addOption(`-bufsize:${index}`, resolution.bufsize);
  });

  command.addOption(`-map`, `0:a`);
  command.addOption(`-f`, `hls`);
  command.addOption(`-hls_time`, `4`);
  command.addOption(`-hls_playlist_type`, `vod`);
  command.addOption(`-hls_segment_filename`, `${outputPath}_%03d.ts`);
  command.addOption(`-hls_segment_type`, `mpegts`);
  command.addOption(`-hls_flags`, `delete_segments`);
  command.addOutput(`${outputPath}.m3u8`);

  command
    .on("start", (cmd:string) => {
      appendFileSync("hls.txt", cmd);
    })
    .on("progress", (progress:any) => {
      console.log("progress", progress);
    })
    .on("error", function (err:any) {
      console.log("errorss", err);
    })
    .run();
}
