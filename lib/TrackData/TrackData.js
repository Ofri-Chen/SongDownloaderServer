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
    requestTracks(request).then((data) => {
        defer.resolve(parseData(data));
    }).catch((err) => {
        defer.reject(err);
    });

    return defer.promise;
};

getTopTracks('Metallica', 20).then((tracks) => {
    var artist = new Artist();
    artist.setName(tracks).then(() => {
        console.log('name', artist.name);
    });
    artist.setTracks(tracks.track).then(() => {
       console.log('tracks', artist.tracks);
    });
    // artist.setName(tracks.track);
}).catch((err) => {
    console.log(err);
});

function requestTracks(request){
    var defer = q.defer();
    console.log(request);
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

function Artist(){
    this.name = '';
    this.tracks = '';
    this.setName = function(data){
        let defer = q.defer();
        getArtistName(data).then((name) => {
            this.name = name;
            defer.resolve();
        });
        return defer.promise;
    };

    this.setTracks = function(tracks){
        let defer = q.defer();
        this.tracks = tracks.map(function(track){
            return new Track(track);
        });
        defer.resolve();
        return defer.promise;
    };
}

function getArtistName(data){
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
}

function toFirstLetterUpperCase(str){
    if(str){
        return str.split(' ').map(function(word){
            return word.charAt(0).toUpperCase() + word.substring(1, word.length);
        }).join(' ');
    }
    return str;
}


function getTrackProperty(obj, path){
    var property = getJsonProperty(obj, path);
    return toFirstLetterUpperCase(property);
}

function getJsonProperty(obj, path){
    let prop = obj;
    try{
        path.forEach(function(item){
            prop = item.includes('[') ? handleArrayProperty(prop, item) : prop[item];
        });
    }
    catch(err){
        prop = null;
    }

    return prop;
}

function handleArrayProperty(obj, prop){
    let splitProp = prop.split('[');
    let propName = splitProp[0];
    let index = splitProp[1].substring(0, splitProp[1].length - 1); //substring without the closing square bracket ']'
    return obj[propName][index];
}


module.exports = {
    getTopTracks: getTopTracks
};