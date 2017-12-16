var http = require('http');
var https = require('https');
var q = require('q');
var config = require('../../../config');
var log = require('../../Common/logger');
var urlencode = require('urlencode');

module.exports = {
    youtubeApiRequest: youtubeApiRequest
};

function youtubeApiRequest(trackName, lyrics, resultNum = 0){
    var defer = q.defer();
    if(lyrics == true){
        trackName += ' lyrics';
    }

    var request = config.externalApi.youtube.api
        .replace('Track_Name', urlencode(trackName))
        .replace('$Max_Results$', (++resultNum).toString());
    requestTrack(request).then((track) => {
        defer.resolve(JSON.parse(track).items[--resultNum]['id']['videoId']);
    }).catch((err) => {
        log.logInfo(`error requesting videoId: ${request}, error: ${err}`);
        defer.reject(err);
    });

    return defer.promise;
}

function requestTrack(request){
    var defer = q.defer();

    https.get(request, (res) => {
        let responseData = '';
        res.on('data', (data) => {
            responseData += data;
        }).on('error', (err) => {
            defer.reject(err);
        }).on('end', () => {
            defer.resolve(responseData);
        });
    });

    return defer.promise;
}