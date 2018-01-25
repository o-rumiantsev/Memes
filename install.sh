#!/bin/bash

DIR=$PWD/Memes-Time

git clone https://github.com/dimanadko/memes-time-web $DIR/memes-time-web
cd $DIR/memes-time-web
npm install
npm run build
cd ..

git clone https://github.com/o-rumiantsev/Memes
mkdir Memes/static
cp -a memes-time-web/build/* Memes/static/

mv Memes/server.sh .
