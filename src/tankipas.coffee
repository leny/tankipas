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
    .description "Compute approximate development time passed on a project, using logs from version control system."
    .option "-s, --system <system>", "force the version system to analyse (by default, try to guess)"
    .option "-g, --gap <amount>", "number of minutes above wich the time between two commits is ignored in the total.", 120
    .option "-u, --user <user>", "use only the commits of the given user."
    .parse process.argv

