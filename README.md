# tankipas

[![NPM version](http://img.shields.io/npm/v/tankipas.svg)](https://www.npmjs.org/package/tankipas) ![Dependency Status](https://david-dm.org/leny/tankipas.svg) ![Downloads counter](http://img.shields.io/npm/dm/tankipas.svg)

> Compute approximate development time spent on a project, using logs from version control system.

* * *

## How it works ?

**tankipas**, according to the options used, read the logs of the current working directory's version control system and computes the difference between each commit timestamp.   
As the resulting time **can't** reflect the reality, **tankipas** use a `gap` option, a number of minutes above wich the time between two commits is ignored.

## Getting Started

**tankipas** is a command-line tool, so it is preferable to install it globally.

    (sudo) npm install -g tankipas

## Usage

Using **tankipas** is simple, from inside a `git` or `mercurial` repo: 

    tankipas [options]
    
    Options:

        -h, --help             output usage information
        -V, --version          output the version number
        -s, --system <system>  force the version system to analyse (by default, try to guess)
        -g, --gap <amount>     number of minutes above wich the time between two commits is ignored in the total.
        -u, --user <user>      use only the commits of the given user.
        -r, --raw              show raw result, as number of minutes spent on the project.
    
### Options

#### system (`-s`,`--system <system>`)

Force the version control system to use for the current directory's analysis.  
By default, **tankipas** will try to guess the current version control system.

For now, **tankipas** supports `git` and `mercurial` systems.

#### gap (`-g`,`--gap <amount>`)

**tankipas** compute his result by sum all the time between commits. As you can't pretend working 24h/day (*I tried, it's hard, after 3 days*), **tankipas** ignore the time between commits separed by more than the given `gap` option. By default, the gap is `120` (minutes).

#### user (`-u`,`--user <user>`)

If you work as a team, you can be interested to filters the commits and compute the time of only one user, which you can precise with the `user` option.

#### raw (`-r`,`--raw`)

By default, **tankipas** outputs his result in a *human-readable* format. If you want to use the result with another tool, the `raw` option will output results as an amount of `seconds`.

#### help (`-h`,`--help`)

Output usage information.

#### version (`-v`,`--version`)

Output **tankipas**' version number.
    
## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint your code using [Grunt](http://gruntjs.com/).

## Release History

* **0.1.1**: Fix *rounding* issue for minutes (*02/07/14*)
* **0.1.0**: Initial release (*02/07/14*)

### TODO
    
- [ ] add progress indicator
- [ ] `AMD` version
- [ ] allow to give one or multiple paths
- [ ] deprecate `grunt-elapsed` module and create `grunt-tankipas`
- [ ] add support for **svn**

## License
Copyright (c) 2014 Leny  
Licensed under the MIT license.
