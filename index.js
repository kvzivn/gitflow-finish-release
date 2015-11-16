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

    finishRelease(pkg.version);
}


// function bumpVersion(currentVersion, type) {
//     var versionArray = currentVersion.split('.');

//     if ( acceptedVersionBump.indexOf(type) === -1 ) {
//         throw 'Bump only accepts major, minor or patch bump types, ' + type + ' was given';
//     }

//     versionArray[acceptedVersionBump.indexOf(type)]++;

//     for( var i = acceptedVersionBump.indexOf(type)+1; i < acceptedVersionBump.length; i++ ) {
//         versionArray[i] = 0;
//     }

//     return versionArray.join('.');
// }


function confirmWrite(err) {
    if ( err ) throw err;

    // console.log('Saved! New version is: ', newVersion);
}


function finishRelease(version) {
    exec('git-flow release finish ' + version, function(err, stdout, stderr) {
        if (err) throw err;

        console.log(stdout);
    });
}
