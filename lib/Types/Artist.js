let q = require('q');
let utilities = require('../Common/Utilities')
var log = require('../Common/logger');

function Artist(){
    this.name = '';
    this.tracks = '';
    this.withLyrics = true;

    this.setName = function(name){
        this.name = name;
    };

    this.setTracks = function(tracks){
        let defer = q.defer();
        this.tracks = tracks.map(function(track){
            return utilities.toFirstLetterUpperCase(track.name);
        });
        defer.resolve();
        return defer.promise;

    };
}

function getArtistName(track){
    let defer = q.defer();
    try{
        defer.resolve(track[0].artist.name);
    }
    catch(err){
        defer.resolve('Unknown');
        log.logInfo('error retriever artist name for track', data);
    }
    return defer.promise;
}


module.exports = {
    Artist: Artist
};