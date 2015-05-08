Mobile Inline Player
=====================

Mobile Inline Player is a MPEG1 player for mobile browsers. It supports pseudo video-streaming with multiple MPEG1 files and auto inline-playing on iPhone and Android.


# Usage

```html
<div data-src="video.json" data-mp4="fullscreen.mp4" data-endcard="endcard.jpg"></div>
<script src="mobile-inline-player.js"></script>
```

# Options

| Key                    | Description
|------------------------|------------------------------------
| data-src               | a playlist URL
| data-mp4               | a mp4 video URL for full screen
| data-endcard           | an endcard image URL
| data-width             | video width
| data-height            | video height
| data-preload-timeout   | a time limit for preloading (in micro seconds)


# File format

### JSON

```json
{
  "url": [
    "aaa.mpg",
    "bbb.mpg"
  ]
}
```

# Limitations

- Playback can only start when the file is fully loaded (when not streaming through WebSockets). I'm waiting for chunked XHR with ArrayBuffers to arrive in browsers.
- MPEG files with B-Frames look weird - frames are not reordered. This should be relatively easy
to fix, but most encoders seem to not use B-Frames at all by default.
- The width of the MPEG video has to be a multiple of 2.
- Only raw MPEG video streams are supported. The decoder hates Stream Packet Headers in between
macroblocks.

You can use [FFmpeg](http://www.ffmpeg.org/) to encode videos in a suited format. This will crop
the size to a multiple of 2, omit B-Frames and force a raw video stream:

```
ffmpeg -i in.mp4 -f mpeg1video -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -b 0 out.mpg
```
