#! /usr/bin/env node

var fs = require('fs');
var async = require('async');
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
    async.series([
        function(){
            exec('git checkout master', function(err, stdout, stderr) {
                if (err) throw err;

                console.log(stdout);
            });
        },
        function(){
            exec('git merge --no-ff -m "Merge branch release/ "' + v, function(err, stdout, stderr) {
                if (err) throw err;

                console.log(stdout);
            });
        },
        function(){
            exec('git checkout develop', function(err, stdout, stderr) {
                if (err) throw err;

                console.log(stdout);
            });
        },
        function(){
            exec('git merge --no-ff -m "Merge branch release/ "' + v, function(err, stdout, stderr) {
                if (err) throw err;

                console.log(stdout);
            });
        },
        function(){
            exec('git branch -d release/' + v, function(err, stdout, stderr) {
                if (err) throw err;

                console.log(stdout);
            });
        },
        function(){
            exec('git push origin --all && git push origin --tags', function(err, stdout, stderr) {
                if (err) throw err;

                console.log(stdout);
            });

            console.log('Merged release branch into master & develop, deleted it and pushed everything.');
        }
    ]);
}


