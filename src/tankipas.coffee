###
 * tankipas
 * https://github.com/leny/tankipas
 *
 * JS/COFFEE Document - /tankipas.js - main entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

tankipas = require "commander"
fs = require "fs"
path = require "path"
chalk = require "chalk"
error = chalk.bold.red
success = chalk.bold.green

pkg = require "../package.json"

tankipas
    .version pkg.version
    .usage "[options] /path/to/repo/"
    .parse process.argv

tankipas.help() unless tankipas.args.length
