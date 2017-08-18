#!/bin/sh

if [ `git branch --list gh-pages` ];
then
   git branch -D gh-pages
fi
git checkout -b gh-pages &&
git ls-files | grep -v -e "\(^\.gitignore$\|^\.gitattributes$\|^\.gh-pages-tmp$\)" | xargs rm -rf &&
mv .gh-pages-tmp/* . &&
rm -rf .gh-pages-tmp &&
git add . &&
git commit -m "Update gh-pages [ci skip]" &&
git push --force origin gh-pages &&
git checkout master
