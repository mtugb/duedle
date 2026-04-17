#!/bin/bash
cd ./src
mkdir dist/
zip -r ../dist/$(date "+%s").zip *
