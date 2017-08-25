var ffmpeg = require('fluent-ffmpeg');
var q = require('q');
var config = require('../../../../config');
var fs = require('fs');

var ffmpegPath = config.ffmpegPath;

// fs.readdir(config.somePath, (err, files) => {
//     files.forEach(file => {
//         console.log(file);
//     });
// });

module.exports = {
    convertToMp3: convertToMp3
};


function convertToMp3(track){
    var defer = q.defer();
    console.log(`converting ${track.mp4Path}`);

    ffmpeg(track.mp4Path)
        .setFfmpegPath(ffmpegPath )
        .output(track.mp3Path)
        .on('end', function(){
            console.log('conversion ended', track.mp3Path);
            defer.resolve();
        }).on('error', function(err){
            console.log('conversion failed', err);
            defer.reject();
    }).run();

    return defer.promise;
}