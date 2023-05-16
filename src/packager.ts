#! /usr/bin/env node

import { Command } from "commander";
import * as figlet from "figlet";
import { hls as HLCConverter } from "./convertors/hls";
import { dash as DASHConverter } from "./convertors/dash";
import { preview_gif as GIFConverter } from "./convertors/preview-gif";
import { preview_thumbnail as thumbnailSpritesConverter } from "./convertors/preview-thumbnail";
import { fallback as fallbackConverter } from "./convertors/fallback-mp4";
console.log(
  figlet.textSync("playback packager", {
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
);

const program = new Command();

program
  .version("1.0.0")
  .description("An example CLI for managing a directory")
  .requiredOption("-i, --input  <value>", "input file path")
  .option("-hls, --hls <value>", "muxing to hls")
  .option("-dash, --dash <value>", "muxing to dash")
  .option("-gif, --preview_gif <value>", "create preview gif")
  .option("-sp, --sprite <value>", "create preview sprite")
  .requiredOption(
    "-o, --output directory <value>",
    "output directory for the output"
  );

program.parse(process.argv);

const { input, output = "", hls, dash, preview_gif, sprite } = program.opts();

if (!hls || !dash || !preview_gif || !sprite) {
  console.error("please specify the format or the type of output");
}

if (hls) {
  HLCConverter(input, output);
} else if (dash) {
  DASHConverter(input, output);
} else if (preview_gif) {
  GIFConverter(input, output);
} else if (sprite) {
  thumbnailSpritesConverter(input, output);
} else {
  fallbackConverter(input, output);
}
