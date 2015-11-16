#! /usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var exec = require('child_process').exec;

var version;

fs.readFile('./package.json', 'utf8', parseVersion);


function parseVersion(err, response) {
    if (err) {
        console.log();
    }

    var pkg = JSON.parse(response);

    if ( !pkg.version ) {
        throw 'Could not read version from package.json. Is the file correctly formatted?';
    }

    version = pkg.version;

    finishRelease(version);
}


function confirmWrite(err) {
    if ( err ) throw err;

    console.log('Woho, it worked!');
}


function finishRelease(v) {
    exec('git-flow release finish ' + v, function(err, stdout, stderr) {
        if (err) throw err;

        console.log(stdout);
    });
}
