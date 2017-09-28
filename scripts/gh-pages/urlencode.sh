#!/bin/sh

set -e
set -x

node -e "console.log(encodeURIComponent('${*}'))"
