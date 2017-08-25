var http = require('http');
var https = require('https');
var q = require('q');
var config = require('../../../config');

module.exports = {
    youtubeApiRequest: youtubeApiRequest
};

function youtubeApiRequest(artistName, track, lyrics){
    var defer = q.defer();
    var name = artistName + ' - ' + track.name;
    if(lyrics){
        name += ' lyrics';
    }

    var request = config.externalApi.youtube.api.replace('Track_Name', name);
    requestTrack(request).then((track) => {
        defer.resolve(JSON.parse(track).items[0].id.videoId);
    }).catch((err) => {
        console.log('catch');
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