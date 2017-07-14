#!/bin/sh

git branch -D gh-pages &&
git checkout -b gh-pages &&
git ls-files | grep -v -e "\(^\.gitignore$\|^\.gitattributes$\|^\.gh-pages-tmp$\)" | xargs rm -rf
mv .gh-pages-tmp/* . &&
rm -rf .gh-pages-tmp &&
git add . &&
git commit -m "Update gh-pages [ci skip]" &&
git push --force origin gh-pages &&
git checkout master
