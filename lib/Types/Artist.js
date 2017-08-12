let q = require('q');
let trackType = require('./Track');

function Artist(){
    this.name = '';
    this.tracks = '';
    this.setName = function(track){
        let defer = q.defer();
        getArtistName(track).then((name) => {
            this.name = name;
            defer.resolve();
        });
        return defer.promise;
    };

    this.setTracks = function(tracks){
        let defer = q.defer();
        this.tracks = tracks.map(function(track){
            return new trackType.Track(track);
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
        console.log('error retriever artist name for track', data);
    }
    return defer.promise;
}


module.exports = {
    Artist: Artist
};