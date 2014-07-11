###
 * tankipas
 * https://github.com/leny/tankipas
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

pkg = require "../package.json"

path = require "path"
chalk = require "chalk"
error = chalk.bold.red
( spinner = require "simple-spinner" )
    .change_sequence [
        "◓"
        "◑"
        "◒"
        "◐"
    ]

( program = require "commander" )
    .version pkg.version
    .usage "[options]"
    .description "Compute approximate development time spent on a project, using logs from version control system."
    .option "-s, --system <system>", "force the version system to analyse (by default, try to guess)"
    .option "-g, --gap <amount>", "number of minutes above wich the time between two commits is ignored in the total.", 120
    .option "-u, --user <user>", "use only the commits of the given user."
    .option "-r, --raw", "show raw result, as number of minutes spent on the project."
    .option "-c, --commit <commit>", "compute the result since the given commit."
    .parse process.argv

# --- get path

sPath = process.cwd()

# --- get options

# ----- get system

sSystem = "hg" if program.system?.toLowerCase() in [ "mercurial", "hg" ]
sSystem = "git" if program.system?.toLowerCase() in [ "git", "github" ]

# ----- get gap

iGap = +program.gap

if isNaN iGap
    console.log error "✘ gap must be a number, '#{ program.gap }' given."
    process.exit 1

# ----- get user

sUser = program.user ? no

# ----- get since commit

sSinceCommit = program.commit ? no

oOptions =
    system: sSystem
    gap: iGap
    user: sUser
    commit: sSinceCommit

# --- get tankipas total

spinner.start 50
require( "./tankipas.js" ) sPath, oOptions, ( oError, iTotal ) ->
    spinner.stop()
    if oError
        console.log error "✘ #{ oError }."
        process.exit 1
    if program.raw
        console.log iTotal
    else
        iTotal /= 1000
        iMinutes = if ( iMinutes = Math.floor( iTotal / 60 ) ) > 60 then ( iMinutes % 60 ) else iMinutes
        iHours = Math.floor iTotal / 3600
        sUserString = if sUser then " (for #{ chalk.cyan( sUser ) })" else ""
        console.log chalk.green( "✔" ), "Time spent on project#{ sUserString }: ±#{ chalk.yellow( iHours ) } hours & #{ chalk.yellow( iMinutes ) } minutes."
    process.exit 0

