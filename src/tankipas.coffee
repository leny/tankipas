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
exec = require( "child_process" ).exec
which = require( "which" ).sync
chalk = require "chalk"
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

# --- build command

sUserFilter = ""
sUserFilter = "-u #{ sUser }" if sUser and sSystem is "hg"
sUserFilter = "--author #{ sUser }" if sUser and sSystem is "git"

sCommand = "#{ sSystem } log #{ sUserFilter }"

# --- exec command

exec sCommand, { maxBuffer: 1048576 }, ( oError, sStdOut, sStdErr ) ->
    if oError
        console.log error "✘ #{ oError }."
        process.exit 1
    iTotal = 0
    iPrevStamp = null
    iGap *= 60000
    sDateFilter = if sSystem is "git" then "Date:" else "date:"
    for sLine in sStdOut.split( require( "os" ).EOL ).reverse()
        if sLine.search( sDateFilter ) isnt -1
            iCurrentStamp = ( new Date( sLine.substr( sDateFilter ).trim() ) ).getTime()
            iTotal += iDifference if iPrevStamp and iPrevStamp < iCurrentStamp and ( iDifference = iCurrentStamp - iPrevStamp ) < iGap
            iPrevStamp = iCurrentStamp
    iTotal /= 1000
    iMinutes = if ( iMinutes = Math.floor( iTotal / 60 ) ) > 60 then Math.floor( iMinutes / 60 ) % 60 else iMinutes
    iHours = Math.floor iTotal / 3600
    sUserString = if sUser then " (for #{ chalk.cyan( sUser ) })" else ""
    console.log chalk.green( "✔" ), "Time elapsed on project#{ sUserString }: ±#{ chalk.yellow( iHours ) } hours & #{ chalk.yellow( iMinutes ) } minutes."
    process.exit 0
