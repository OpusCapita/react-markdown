#!/bin/sh

rm -rf .gh-pages-tmp lib demo.tar.gz  &&
mkdir .gh-pages-tmp &&

node node_modules/webpack/bin/webpack.js --config ./config/doc/webpack.config.js --hide-modules &&
cp -R lib/* .gh-pages-tmp &&
cp -R www/index.html .gh-pages-tmp &&
cp -R .gitignore .gh-pages-tmp &&
tar -cvzf demo.tar.gz .gh-pages-tmp

cd scripts/gh-pages
