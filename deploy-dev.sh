#!/bin/bash

zip -r -j cfl-ui.zip build/*
sudo cp -rf build/* ~/.cfl-dev/owa/cfl-ui
