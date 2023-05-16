const ffmpeg = require("fluent-ffmpeg");
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { appendFileSync } from "fs";

const ffprobePath = require("@ffprobe-installer/ffprobe").path;

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);





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


export function hls(input:string,outputDir:string){

const command = ffmpeg()
.addInput(input);
command.addOptions([
  `-preset veryfast`,
  `-keyint_min 100`,
  `-g 100`,
  "-sc_threshold 0",
  `-r 25`,
  "-c:v libx264",
  "-pix_fmt yuv420p",
]);


resolutions.forEach((resolution, index) => {
    command.addOption('-map v:0');
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
    `-hls_time 4`,
    '-hls_playlist_type vod',
    '-hls_flags independent_segments',
    "-master_pl_name main.m3u8",
    `-hls_segment_filename ${outputDir}/stream_%v/s%06d.ts`,
    '-strftime_mkdir 1',
  ])
  .addOption(
    '-var_stream_map', `${resolutions.map((_,index)=>`v:${index},a:${index}`).join(" ")}`,
  )
  .output(`${outputDir}/stream_%v.m3u8`)
  .on("start",(cmd:string)=>appendFileSync("hls.txt",cmd))
  .on('end', () => {
    console.log('Transcoding finished!');
  })
  .on('progress', (progress:any) => {
    console.log(progress);
  })
  .on('error', function(err:Error, stdout:any, stderr:any) {
    console.log(err.message); 
    console.log("stdout:\n" + stdout);
    console.log("stderr:\n" + stderr);
})
  .run();

}


hls("inputs/input.mp4","outputs")