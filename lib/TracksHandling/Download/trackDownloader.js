var q = require('q');
var ytdl = require('ytdl-core');
var fs = require('fs');
var config = require('../../../config');
var log = require('../../Common/logger');

module.exports = {
    download: downloadTrack
};

function downloadTrack(videoId, path){
    var defer = q.defer();
    var videoUrl = config.youtubeBaseUrl + videoId;
    log.logInfo(`started downloading ${videoUrl}`);
    
    try{
        ytdl(videoId)
            .pipe(fs.createWriteStream(path))
            .on('finish', () => {
                log.logInfo(`finished downloading: ${videoId}`);
                defer.resolve();
            }).on('error', (err) => {
                log.logInfo(`error downloading: ${videoId}: \n ${err}`);
                defer.reject(err, videoId);
            })
    }
    catch(err){
        defer.reject(err)
    }
    return defer.promise;
}

