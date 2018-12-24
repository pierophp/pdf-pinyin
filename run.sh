#!/bin/bash

DIR="/home/node/pdf-pinyin/node_modules"

if [ ! -d "$DIR" ]; then
    yarn install
fi

node index.js "$@"