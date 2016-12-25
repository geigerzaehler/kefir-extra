#!/bin/bash
set -e
eslint test src
USE_BUILT=true ./node_modules/.bin/kanu \
  --require test/support/boot.js \
  --extensions js \
  test/unit
