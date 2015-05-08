#!/bin/sh
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 0   -f mpeg1video 01.mpg
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 20  -f mpeg1video 02.mpg
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 40  -f mpeg1video 03.mpg
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 60  -f mpeg1video 04.mpg
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 80  -f mpeg1video 05.mpg
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 100 -f mpeg1video 06.mpg
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 120 -f mpeg1video 07.mpg
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 140 -f mpeg1video 08.mpg
ffmpeg -y -i fullscreen.mp4 -s 320x180 -vf "crop=iw-mod(iw\,2):ih-mod(ih\,2)" -bf 0 -t 20 -ss 160 -f mpeg1video 09.mpg
