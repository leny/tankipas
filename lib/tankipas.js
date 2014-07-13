
/*
 * tankipas
 * https://github.com/leny/tankipas
 *
 * JS/COFFEE Document - /tankipas.js - module entry point
 *
 * Copyright (c) 2014 Leny
 * Licensed under the MIT license.
 */
"use strict";
var exec, fs, which;

which = require("which").sync;

fs = require("fs");

exec = require("child_process").exec;

module.exports = function(sRepoPath, oOptions, fNext) {
  var iGap, oError, oExecOptions, sBranch, sBranchFilter, sCommand, sSinceCommit, sSystem, sUser, sUserFilter, _ref;
  if (oOptions == null) {
    oOptions = {};
  }
  if (fNext == null) {
    fNext = null;
  }
  if (!fs.existsSync(sRepoPath)) {
    return typeof fNext === "function" ? fNext(new Error("Repository Path doesn't exists!")) : void 0;
  }
  if (oOptions instanceof Function && fNext === null) {
    fNext = oOptions;
    oOptions = {};
  }
  sSystem = oOptions.system;
  iGap = (_ref = +oOptions.gap) != null ? _ref : 120;
  sUser = oOptions.user;
  sSinceCommit = oOptions.commit;
  sBranch = oOptions.branch;
  if (!sSystem) {
    if (fs.existsSync("" + sRepoPath + "/.hg")) {
      sSystem = "hg";
    }
  }
  if (!sSystem) {
    if (fs.existsSync("" + sRepoPath + "/.git")) {
      sSystem = "git";
    }
  }
  if (!sSystem) {
    return typeof fNext === "function" ? fNext(new Error("No system given!")) : void 0;
  }
  try {
    which(sSystem);
  } catch (_error) {
    oError = _error;
    if (typeof fNext === "function") {
      fNext(oError);
    }
  }
  if (isNaN(iGap)) {
    return typeof fNext === "function" ? fNext(new Error("Gap must be a Number!")) : void 0;
  }
  sUserFilter = "";
  if (sUser && sSystem === "hg") {
    sUserFilter = "-u " + sUser;
  }
  if (sUser && sSystem === "git") {
    sUserFilter = "--author " + sUser;
  }
  sBranchFilter = "";
  if (sBranch && sSystem === "hg") {
    sBranchFilter = "-b " + sBranch;
  }
  if (sBranch && sSystem === "git") {
    sBranchFilter = "$(git merge-base master " + sBranch + ")..HEAD";
  }
  sCommand = "" + sSystem + " log " + sUserFilter + " " + sBranchFilter;
  oExecOptions = {
    maxBuffer: 1048576,
    cwd: sRepoPath
  };
  return exec(sCommand, oExecOptions, function(oError, sStdOut, sStdErr) {
    var iCurrentStamp, iDifference, iPrevStamp, iTotal, sCommitFilter, sDateFilter, sLine, _i, _len, _ref1;
    if (oError) {
      return typeof fNext === "function" ? fNext(oError) : void 0;
    }
    iTotal = 0;
    iPrevStamp = null;
    iGap *= 60000;
    sDateFilter = sSystem === "git" ? "Date:" : "date:";
    sCommitFilter = sSystem === "git" ? "commit" : "changeset:";
    _ref1 = sStdOut.split(require("os").EOL).reverse();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      sLine = _ref1[_i];
      if (sSinceCommit && sLine.search(sCommitFilter) !== -1) {
        if (sLine.search(sSinceCommit) !== -1) {
          iTotal = 0;
        }
      }
      if (sLine.search(sDateFilter) !== -1) {
        iCurrentStamp = (new Date(sLine.substr(sDateFilter).trim())).getTime();
        if (iPrevStamp && iPrevStamp < iCurrentStamp && (iDifference = iCurrentStamp - iPrevStamp) < iGap) {
          iTotal += iDifference;
        }
        iPrevStamp = iCurrentStamp;
      }
    }
    return typeof fNext === "function" ? fNext(null, iTotal) : void 0;
  });
};
