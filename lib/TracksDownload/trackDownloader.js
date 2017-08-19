var q = require('q');
var ytdl = require('ytdl-core');
var fs = require('fs');
var config = require('../config');

module.exports = {
    download: downloadTrack
};

function downloadTrack(videoId, path){
    var defer = q.defer();
    var videoUrl = config.youtubeBaseUrl + videoId;
    console.log(`started downloading ${videoUrl}`);
    try{
        ytdl(videoId)
            .pipe(fs.createWriteStream(path))
            .on('finish', () => {
                console.log(`finished downloading: ${videoId}`);
                defer.resolve();
            }).on('error', (err) => {
                console.log(`error: ${videoId}: \n ${err}`);
                defer.reject(err, videoId);
            })
    }
    catch(err){
        defer.reject(err)
    }
    return defer.promise;
}

