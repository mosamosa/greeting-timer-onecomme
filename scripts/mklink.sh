#!/usr/bin/env bash

mkdir -p ~/Library/Application\ Support/onecomme/plugins/greeting-timer
mkdir -p ~/Library/Application\ Support/onecomme/templates/custom/greeting-timer

ln -s `realpath dist/plugins/greeting-timer/index.html` ~/Library/Application\ Support/onecomme/plugins/greeting-timer/index.html
ln -s `realpath dist/plugins/greeting-timer/plugin.js` ~/Library/Application\ Support/onecomme/plugins/greeting-timer/plugin.js
ln -s `realpath dist/plugins/greeting-timer/script.js` ~/Library/Application\ Support/onecomme/plugins/greeting-timer/script.js
ln -s `realpath dist/plugins/greeting-timer/style.css` ~/Library/Application\ Support/onecomme/plugins/greeting-timer/style.css

ln -s `realpath dist/templates/greeting-timer/index.html` ~/Library/Application\ Support/onecomme/templates/custom/greeting-timer/index.html
ln -s `realpath dist/templates/greeting-timer/script.js` ~/Library/Application\ Support/onecomme/templates/custom/greeting-timer/script.js
ln -s `realpath dist/templates/greeting-timer/style.css` ~/Library/Application\ Support/onecomme/templates/custom/greeting-timer/style.css
ln -s `realpath dist/templates/greeting-timer/template.json` ~/Library/Application\ Support/onecomme/templates/custom/greeting-timer/template.json
ln -s `realpath dist/templates/greeting-timer/thumb.png` ~/Library/Application\ Support/onecomme/templates/custom/greeting-timer/thumb.png
