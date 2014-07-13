#!/usr/bin/env node
/*
 * tankipas
 * https://github.com/leny/tankipas
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var chalk, error, iGap, oOptions, path, pkg, program, sBranch, sPath, sSinceCommit, sSystem, sUser, spinner, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;

pkg = require("../package.json");

path = require("path");

chalk = require("chalk");

error = chalk.bold.red;

(spinner = require("simple-spinner")).change_sequence(["◓", "◑", "◒", "◐"]);

(program = require("commander")).version(pkg.version).usage("[options]").description("Compute approximate development time spent on a project, using logs from version control system.").option("-s, --system <system>", "force the version system to analyse (by default, try to guess)").option("-g, --gap <amount>", "number of minutes above wich the time between two commits is ignored in the total.", 120).option("-u, --user <user>", "use only the commits of the given user.").option("-b, --branch <branch>", "use only the commits of the given branch.").option("-r, --raw", "show raw result, as number of minutes spent on the project.").option("-c, --commit <commit>", "compute the result since the given commit.").parse(process.argv);

sPath = process.cwd();

if ((_ref = (_ref1 = program.system) != null ? _ref1.toLowerCase() : void 0) === "mercurial" || _ref === "hg") {
  sSystem = "hg";
}

if ((_ref2 = (_ref3 = program.system) != null ? _ref3.toLowerCase() : void 0) === "git" || _ref2 === "github") {
  sSystem = "git";
}

iGap = +program.gap;

if (isNaN(iGap)) {
  console.log(error("✘ gap must be a number, '" + program.gap + "' given."));
  process.exit(1);
}

sUser = (_ref4 = program.user) != null ? _ref4 : false;

sBranch = (_ref5 = program.branch) != null ? _ref5 : false;

sSinceCommit = (_ref6 = program.commit) != null ? _ref6 : false;

oOptions = {
  system: sSystem,
  gap: iGap,
  user: sUser,
  branch: sBranch,
  commit: sSinceCommit
};

spinner.start(50);

require("./tankipas.js")(sPath, oOptions, function(oError, iTotal) {
  var iHours, iMinutes, sUserString;
  spinner.stop();
  if (oError) {
    console.log(error("✘ " + oError + "."));
    process.exit(1);
  }
  if (program.raw) {
    console.log(iTotal);
  } else {
    iTotal /= 1000;
    iMinutes = (iMinutes = Math.floor(iTotal / 60)) > 60 ? iMinutes % 60 : iMinutes;
    iHours = Math.floor(iTotal / 3600);
    sUserString = sUser ? " (for " + (chalk.cyan(sUser)) + ")" : "";
    console.log(chalk.green("✔"), "Time spent on project" + sUserString + ": ±" + (chalk.yellow(iHours)) + " hours & " + (chalk.yellow(iMinutes)) + " minutes.");
  }
  return process.exit(0);
});
