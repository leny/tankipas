###
 * tankipas
 * https://github.com/leny/tankipas
 *
 * JS/COFFEE Document - /tankipas.js - module entry point
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
###

"use strict"

which = require( "which" ).sync
fs = require "fs"
exec = require( "child_process" ).exec

module.exports = ( sRepoPath, oOptions = {}, fNext = null ) ->

    # check path

    return fNext? new Error( "Repository Path doesn't exists!" ) unless fs.existsSync sRepoPath

    # parse arguments

    if oOptions instanceof Function and fNext is null
        fNext = oOptions
        oOptions = {}

    sSystem = oOptions.system
    iGap = +oOptions.gap ? 120
    sUser = oOptions.user

    # check system

    sSystem = "hg" if fs.existsSync "#{ sRepoPath }/.hg" unless sSystem
    sSystem = "git" if fs.existsSync "#{ sRepoPath }/.git" unless sSystem

    return fNext? new Error( "No system given!" ) unless sSystem

    try
        which sSystem
    catch oError
        fNext? oError

    # check gap

    return fNext? new Error( "Gap must be a Number!" ) if isNaN iGap

    # build command

    sUserFilter = ""
    sUserFilter = "-u #{ sUser }" if sUser and sSystem is "hg"
    sUserFilter = "--author #{ sUser }" if sUser and sSystem is "git"

    sCommand = "#{ sSystem } log #{ sUserFilter }"

    oExecOptions =
        maxBuffer: 1048576
        cwd: sRepoPath

    exec sCommand, oExecOptions, ( oError, sStdOut, sStdErr ) ->
        return fNext? oError if oError
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
        fNext? null, iTotal
