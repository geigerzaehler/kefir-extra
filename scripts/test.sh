#!/bin/bash
set -e
eslint test src
USE_BUILT=true mocha test/unit
