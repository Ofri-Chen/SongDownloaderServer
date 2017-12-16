var ffmpeg = require('fluent-ffmpeg');
var q = require('q');
var config = require('../../../../config');
var fs = require('fs');
var log = require('../../../Common/logger');

var ffmpegPath = config.ffmpegPath;

// fs.readdir(config.somePath, (err, files) => {
//     files.forEach(file => {
//         log.logInfo(file);
//     });
// });

module.exports = {
    convertToMp3: convertToMp3
};


function convertToMp3(track){
    var defer = q.defer();
    log.logInfo(`converting ${track.mp4Path}`);

    ffmpeg(track.mp4Path)
        .setFfmpegPath(ffmpegPath )
        .output(track.mp3Path)
        .on('end', function(){
            log.logInfo('conversion ended', track.mp3Path);
            defer.resolve();
        }).on('error', function(err){
            log.logInfo('conversion failed', err);
            defer.reject();
    }).run();

    return defer.promise;
}