var ffmpeg = require('fluent-ffmpeg');
var q = require('q');
var config = require('../config');
var downloadingHandler = require('./DownloadingHandler');

module.exports = {
    watchForTracksToConvert: watch
};

var currentConversions = 0;

function watch(){
    setInterval(() => {
        if(shouldCovert()){
            currentConversions++;
            convert().then(() => {
                currentConversions--;
            });
        }
    }, config.maxParallelConversions);
}

function shouldCovert(){
    // console.log('length:', downloadingHandler.tracksToConvert.length);
    return downloadingHandler.tracksToConvert.length > 0
        && currentConversions < config.maxParallelConversions;
}

function convert(){
    var defer = q.defer();
    var track = downloadingHandler.tracksToConvert.shift();
    console.log(`converting ${track.mp4Path}`);

    ffmpeg(track.mp4Path)
        .setFfmpegPath(process.env.FFMPEG_PATH)
        .output(track.mp3Path)
        .on('end', function(){
            console.log('conversion ended', track.mp3Path);
            defer.resolve();
        }).on('error', function(input, err){
            console.log(err);
            defer.reject();
    }).run();

    return defer.promise;
}