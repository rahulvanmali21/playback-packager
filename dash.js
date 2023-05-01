const ffmpeg = require("fluent-ffmpeg");
const os = require("os");
const { appendFileSync } = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const inputPath = "input.mp4";
const outputPath = "outputs/dash.mpd"; 
 const gif_path = "outputs/preview.gif"
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


// ffmpeg.ffprobe(inputPath, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=display_aspect_ratio'], (err, metadata) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   const aspectRatio = metadata.streams[0].display_aspect_ratio;
//   console.log(aspectRatio);
// });

// return;
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
command.addOption(`-init_seg_name`, `init$RepresentationID$.$ext$`);
command.addOption(
  `-media_seg_name`,
  `chunk$RepresentationID$-$Number%05d$.$ext$`
);
command.addOption(`-use_template`, `1`);
command.addOption(`-use_timeline`, `1`);
command.addOption(`-seg_duration`, `4`);
command.addOption(`-adaptation_sets`, `id=0,streams=v id=1,streams=a`);
command.addOption(`-f`, `dash`);
command.addOutput(outputPath);


command
.output(gif_path)
.format("gif")
.size('480x?')
.inputOptions([
    '-ss 10',
])
.outputOptions(['-t 5'])
.noAudio()
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
