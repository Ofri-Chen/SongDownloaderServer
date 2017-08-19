var q = require('q');
var lastFmApiRequestHandler = require('./ApiRequestHandler');
var artistType = require('./../Types/Artist');

var getTopTracks = function(artist, limit){
    let defer = q.defer();
    lastFmApiRequestHandler.getTopTracks(artist, limit).then((tracks) => {
        let track = tracks.track;
        let artist = new artistType.Artist();
        let namePromise = artist.setName(track);
        let tracksPromise = artist.setTracks(track);
        Promise.all([namePromise, tracksPromise]).then(() => {
            defer.resolve(artist);
        }).catch((err) => {
            defer.reject(err);
        })
    }).catch((err) => {
        defer.reject(err);
    });

    return defer.promise;
};

module.exports = {
    getTopTracks: getTopTracks
};