#!/bin/sh

rm -rf .gh-pages-tmp lib  &&
mkdir .gh-pages-tmp &&

node node_modules/webpack/bin/webpack.js --config ./config/doc/webpack.config.js --hide-modules &&
cp -R lib/* .gh-pages-tmp &&
cp -R www/index.html .gh-pages-tmp &&
cp -R .gitignore .gh-pages-tmp &&

git branch -d gh-pages &&
git checkout -b gh-pages &&
git ls-files | grep -v -e "\(^\.gitignore$\|^\.gitattributes$\|^\.gh-pages-tmp$\)" | xargs rm -rf &&
mv .gh-pages-tmp/* . &&
rm -rf .gh-pages-tmp &&
git add . &&
git commit -m "Update gh-pages [ci skip]" &&
git push --force origin gh-pages &&
git checkout master
