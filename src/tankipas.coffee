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
which = require( "which" ).sync
error = chalk.bold.red
success = chalk.bold.green

pkg = require "../package.json"

tankipas
    .version pkg.version
    .usage "[options]"
    .description "Compute approximate development time passed on a project, using logs from version control system."
    .option "-s, --system <system>", "force the version system to analyse (by default, try to guess)"
    .option "-g, --gap <amount>", "number of minutes above wich the time between two commits is ignored in the total.", 120
    .option "-u, --user <user>", "use only the commits of the given user."
    .parse process.argv

# --- get path

sRepoPath = process.cwd()

# --- get system

sSystem = "hg" if tankipas.system?.toLowerCase() in [ "mercurial", "hg" ]
sSystem = "git" if tankipas.system?.toLowerCase() in [ "git", "github" ]

unless sSystem # no system given, try to guess
    sSystem = "hg" if fs.existsSync "#{ sRepoPath }/.hg"
    sSystem = "git" if fs.existsSync "#{ sRepoPath }/.git"

try
    which sSystem
catch oError
    console.log error "✘ '#{ sSystem }' must be accessible in PATH."
    process.exit 1

# --- get gap

iGap = +tankipas.gap

if isNaN iGap
    console.log error "✘ gap must be a number, '#{ tankipas.gap }' given."
    process.exit 1

# --- get user

sUser = tankipas.user ? no
