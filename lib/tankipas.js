#!/usr/bin/env node
/*
 * tankipas
 * https://github.com/leny/tankipas
 *
 * JS/COFFEE Document - /tankipas.js - main entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var chalk, error, exec, fs, iGap, oError, path, pkg, sCommand, sRepoPath, sSystem, sUser, sUserFilter, success, tankipas, which, _ref, _ref1, _ref2, _ref3, _ref4;

tankipas = require("commander");

fs = require("fs");

path = require("path");

exec = require("child_process").exec;

which = require("which").sync;

chalk = require("chalk");

error = chalk.bold.red;

success = chalk.bold.green;

pkg = require("../package.json");

tankipas.version(pkg.version).usage("[options]").description("Compute approximate development time spent on a project, using logs from version control system.").option("-s, --system <system>", "force the version system to analyse (by default, try to guess)").option("-g, --gap <amount>", "number of minutes above wich the time between two commits is ignored in the total.", 120).option("-u, --user <user>", "use only the commits of the given user.").option("-r, --raw", "show raw result, as number of minutes spent on the project.").parse(process.argv);

sRepoPath = process.cwd();

if ((_ref = (_ref1 = tankipas.system) != null ? _ref1.toLowerCase() : void 0) === "mercurial" || _ref === "hg") {
  sSystem = "hg";
}

if ((_ref2 = (_ref3 = tankipas.system) != null ? _ref3.toLowerCase() : void 0) === "git" || _ref2 === "github") {
  sSystem = "git";
}

if (!sSystem) {
  if (fs.existsSync("" + sRepoPath + "/.hg")) {
    sSystem = "hg";
  }
  if (fs.existsSync("" + sRepoPath + "/.git")) {
    sSystem = "git";
  }
}

try {
  which(sSystem);
} catch (_error) {
  oError = _error;
  console.log(error("✘ '" + sSystem + "' must be accessible in PATH."));
  process.exit(1);
}

iGap = +tankipas.gap;

if (isNaN(iGap)) {
  console.log(error("✘ gap must be a number, '" + tankipas.gap + "' given."));
  process.exit(1);
}

sUser = (_ref4 = tankipas.user) != null ? _ref4 : false;

sUserFilter = "";

if (sUser && sSystem === "hg") {
  sUserFilter = "-u " + sUser;
}

if (sUser && sSystem === "git") {
  sUserFilter = "--author " + sUser;
}

sCommand = "" + sSystem + " log " + sUserFilter;

exec(sCommand, {
  maxBuffer: 1048576
}, function(oError, sStdOut, sStdErr) {
  var iCurrentStamp, iDifference, iHours, iMinutes, iPrevStamp, iTotal, sDateFilter, sLine, sUserString, _i, _len, _ref5;
  if (oError) {
    console.log(error("✘ " + oError + "."));
    process.exit(1);
  }
  iTotal = 0;
  iPrevStamp = null;
  iGap *= 60000;
  sDateFilter = sSystem === "git" ? "Date:" : "date:";
  _ref5 = sStdOut.split(require("os").EOL).reverse();
  for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
    sLine = _ref5[_i];
    if (sLine.search(sDateFilter) !== -1) {
      iCurrentStamp = (new Date(sLine.substr(sDateFilter).trim())).getTime();
      if (iPrevStamp && iPrevStamp < iCurrentStamp && (iDifference = iCurrentStamp - iPrevStamp) < iGap) {
        iTotal += iDifference;
      }
      iPrevStamp = iCurrentStamp;
    }
  }
  iTotal /= 1000;
  iMinutes = (iMinutes = Math.floor(iTotal / 60)) > 60 ? Math.floor(iMinutes / 60) % 60 : iMinutes;
  iHours = Math.floor(iTotal / 3600);
  if (tankipas.raw) {
    console.log(iTotal);
  } else {
    sUserString = sUser ? " (for " + (chalk.cyan(sUser)) + ")" : "";
    console.log(chalk.green("✔"), "Time spent on project" + sUserString + ": ±" + (chalk.yellow(iHours)) + " hours & " + (chalk.yellow(iMinutes)) + " minutes.");
  }
  return process.exit(0);
});
