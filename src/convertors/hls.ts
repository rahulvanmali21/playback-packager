const ffmpeg = require("fluent-ffmpeg");
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { appendFileSync } from "fs";

const ffprobePath = require("@ffprobe-installer/ffprobe").path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);


// ffmpeg.setFfmpegPath(path);
const VIDEO_IN = "inputs/input.mp4";
const VIDEO_OUT = "outputs/main";
const HLS_TIME = 4;
const FPS = 25;
const GOP_SIZE = 100;
const PRESET_P = "veryfast";


const resolutions = [
  {
    name: "360p",
    width: 640,
    height: 360,
    bitrate: "365k",
    maxrate: "390k",
    bufsize: "640k",
  },
  {
    name: "480p",
    width: 854,
    height: 480,
    bitrate: "750k",
    maxrate: "2.14M",
    bufsize: "3.5M",
  },

  {
    name: "720p",
    width: 1280,
    height: 720,
    bitrate: "3M",
    maxrate: "3.21M",
    bufsize: "5.5M",
  },
  {
    name: "720p",
    width: 1280,
    height: 720,
    bitrate: "4.5M",
    maxrate: "4.8M",
    bufsize: "8M",
  },
  {
    name: "1080p",
    width: 1920,
    height: 1080,
    bitrate: "6M",
    maxrate: "6.42M",
    bufsize: "11M",
  },
  {
    name: "1080p",
    width: 1920,
    height: 1080,
    bitrate: "7.8M",
    maxrate: "8.3M",
    bufsize: "14M",
  },
];


const command = ffmpeg()
.addInput(VIDEO_IN);
command.addOptions([
  `-preset ${PRESET_P}`,
  `-keyint_min ${GOP_SIZE}`,
  `-g ${GOP_SIZE}`,
  "-sc_threshold 0",
  `-r ${FPS}`,
  "-c:v libx264",
  "-pix_fmt yuv420p",
]);


resolutions.forEach((resolution, index) => {
    command.addOption(`-map`, 'v:0');
    command.addOption(`-s:${index} ${resolution.width}x${resolution.height}`);
    command.addOption(`-b:v:${index}`, resolution.bitrate);
    command.addOption(`-maxrate:${index}`, resolution.maxrate);
    command.addOption(`-bufsize:${index}`, resolution.bufsize);
  });

  resolutions.forEach(()=>{
    command.addOption(`-map`, `a:0`);

  })


  command.addOutputOptions([
    '-c:a aac',
    '-b:a 128k',
    '-ac 1',
    '-ar 44100',
    '-f hls',
    `-hls_time ${HLS_TIME}`,
    '-hls_playlist_type vod',
    '-hls_flags independent_segments',
    `-master_pl_name outputs/HLS/main.m3u8`,
    `-hls_segment_filename outputs/HLS/stream_%v/s%06d.ts`,
    '-strftime_mkdir 1',
    '-var_stream_map', `"${resolutions.map((_,index)=>`v:${index},a:${index}`).join(" ")}"`,
  ])
  .output("outputs/HLS/stream_%v.m3u8")
  .on("start",(cmd:string)=>appendFileSync("hls.txt",cmd))
  .on('end', () => {
    console.log('Transcoding finished!');
  })
  .on('progress', (progress:any) => {
    console.log('Transcoding progress!' + progress);
  })
  .on('error', function(err:Error, stdout:any, stderr:any) {
    console.log(err.message); //this will likely return "code=1" not really useful
    console.log("stdout:\n" + stdout);
    console.log("stderr:\n" + stderr); //this will contain more detailed debugging info
})
  .run();