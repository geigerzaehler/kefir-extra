#!/bin/bash
./node_modules/.bin/kanu \
  --watch \
  --require test/support/boot.js \
  --extensions js \
  test/unit
