# Playback Packager
This is a command-line tool and library for generating DASH, HLS, preview GIF, and thumbnail sprites using FFmpeg and Fluent-FFmpeg. It's written in TypeScript and can be used either as a CLI tool or by importing the functions directly into your own code.

## Features
- Generate DASH (Dynamic Adaptive Streaming over HTTP) files for video streaming.
- Create HLS (HTTP Live Streaming) playlists for video playback on various devices.
- Generate preview GIFs from video files.
- Create thumbnail sprites to provide a visual overview of the video content.
- Command-line interface for easy usage.
- Library functions for integrating the tool into your own projects.

### Requirements
FFmpeg: Make sure you have FFmpeg installed on your system. You can download it from the official FFmpeg website (https://ffmpeg.org).

## Installation
Clone the repository:

```bash
git clone https://github.com/your-username/your-repository.git
```

Install the dependencies:

```bash
npm install
```

## Usage

### CLI Tool
install globally
```bash
npm install -g .
```

Run the tool with the desired command:

```bash
npm run start -i input.mp4 -dash -o output
```

### Library Functions
Import the desired functions into your TypeScript/JavaScript code:

```javascript
import { generateDASH, generateHLS, generatePreviewGIF, generateThumbnails } from 'video-processing-tool';
```
Use the imported functions with the required parameters in your code.

#### Available Commands
- **-i**: input media file(.mp4,.mov,.avi,.mkv)
- **-o**: output directory fot storing all the generated files

- **-dash**: Generate DASH files for video streaming.
- **-hls**: Create HLS playlists for video playback.
- **-gif**: Generate a preview GIF from a video file.
- **-thumbnails**: Create thumbnail sprites for a video file.


## Contributing
Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.




