#!/bin/sh

mv .gh-pages-tmp/* . &&
rm -rf .gh-pages-tmp &&
git add . &&
git commit -m "Update gh-pages [ci skip]" &&
git push --force origin gh-pages &&
git checkout master
