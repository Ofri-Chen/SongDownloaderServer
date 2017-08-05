var config = require('../config.js');
var http = require('http');
var q = require('q');

var lastFm = config.lastFm;
var rawRequest = `${lastFm.apiBaseUrl}${lastFm.routes.getTopTracks}&${lastFm.apiKey}&${lastFm.jsonFormat}`;



var getTopTracks = function(artist, limit){
    let defer = q.defer();
    if(!validateInput(artist, limit)){
        defer.reject('bad parameters');
    }
    let request = rawRequest.replace('Artist_Name', artist).replace('Limit', limit);
    console.log(request);
    requestTracks(request).then((data) => {
        defer.resolve(parseData(data));
    }).catch((err) => {
        defer.reject(err);
    });

    return defer.promise;
};

// getTopTracks('Metallica', 20).then((tracks) => {
//     console.log(tracks);
//     var artist = new Artist(tracks);
// }).catch((err) => {
//     console.log(err);
// });

function requestTracks(request){
    var defer = q.defer();
    http.get(request, (res) => {
        let responseData = '';
        res.on('data', (data) => {
            responseData += data;
        }).on('end', () => {
            defer.resolve(responseData)
        }).on('error', (err) => {
            return defer.reject(err);
        });
    });
    return defer.promise;
}

function validateInput(artist, limit){
    if(!artist || !limit){
        return false;
    }

    var regExp = new RegExp('^[0-9]{1,3}$');
    return regExp.test(limit);
}

function parseData(data){
    return JSON.parse(data).toptracks;
}


function Artist(data){
    getArtist(data).then(function(artist){
        this.artist = artist;
    });

    this.tracks = data.track.map(function(track){
        return new Track(track);
    })
}

function getArtist(data){
    let defer = q.defer();
    try{
        defer.resolve(data.track[0].artist.name);
    }
    catch(err){
        defer.resolve('Unknown');
        console.log('error retriever artist name for track', data);
    }
    return defer.promise;
}

function Track(track){
    this.name = getTrackProperty(track, ['name']);
    this.title = getTrackProperty(track, ['name']);
    this.album = getTrackProperty(track, ['album', 'title']);
    this.date = getTrackProperty(track, ['wiki', 'published']);
    this.genre = getTrackProperty(track, ['toptags', tag[0], name]);
    //add image url
}

function toFirstLetterUpperCase(str){
    return str.split(' ').map(function(word){
        return word.charAt(0).toUpperCase() + word.substring(1, word.length);
    });
}


function getTrackProperty(obj, path){
    var property = getJsonProperty(obj, path);
    return toFirstLetterUpperCase(property);
}

function getJsonProperty(obj, path){
    let prop = obj;
    try{
        path.forEach(function(item){
            prop = prop[item];
        })
    }
    catch(err){
        prop = null;
    }

    return prop;
}

var a = {
    a: {
        b: {
            c: 123
        }
    }
};