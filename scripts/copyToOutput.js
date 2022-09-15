// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

'use strict';
const fs = require('fs');
var path = require('path');

console.log('Copying amazon-connect-chat-interface.js to local-testing...');
var src = path.join(__dirname, '..', 'build', 'dist', 'static', 'js', 'amazon-connect-chat-interface.js');
var newPath = path.join(__dirname, '..', 'local-testing', 'amazon-connect-chat-interface.js');

var callback = (result) => {
    console.log(result);
}

copy(src, newPath, callback);

function copy(src, newPath, callback){
    fs.copyFile(src, newPath, (err) => {
        if (err) {
            console.log(err);
            callback('Error Found: ' + err);
        }
        else {
            callback('Successfully copied amazon-connect-chat-interface.js to ' + newPath);
        }
    });
}