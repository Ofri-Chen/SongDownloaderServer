let q = require('q');
let config = require('../../../../config');
var http = require('http');
var utilities = require('../../../Common/Utilities');

var lastFm = config.externalApi.lastFm;

module.exports = {
    injectMetadata: injectMetadata
};

function injectMetadata(artistName, trackName, filePath){
    fetchMetadata(artistName, trackName).then((metadata) => {
        return  parseMetadata(metadata);
    }).then((parsedMetadata) => {

    });
}

function fetchMetadata(artistName, trackName){
    var defer = q.defer();
    var url = (`${lastFm.apiBaseUrl}${lastFm.routes.getTrackInfo}&${lastFm.apiKey}&${lastFm.jsonFormat}`)
                .replace('Artist_Name', artistName).replace('Track_Name', trackName);
    console.log(url);

    http.get(url, (res) => {
        let responseData = '';
        res.on('data', (data) => {
            responseData += data;
        }).on('error', (err) => {
            console.log(err);
            defer.reject(err);
        }).on('end', () => {
            defer.resolve(responseData)
        });
    });

    return defer.promise;
}
function parseMetadata(metadata){
    var defer = q.defer();
    var parsedMetadata = {};

    metadata = JSON.parse(metadata);


    let track = utilities.getJsonProperty(metadata, 'track');
    if(!track){
        console.log('metadata.track is undefined');
        defer.reject();
    }
    else{
        parsedMetadata.albumTitle = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'album.title')) || "";
        parsedMetadata.publishDate = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'wiki.published')) || "";
        parsedMetadata.title = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'name')) || "";
        parsedMetadata.genre = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'toptags.tag[0].name')) || "";
        parsedMetadata.artist = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'artist.name')) || "";
        parsedMetadata.image = utilities.getJsonProperty(track, 'album.image[3]["#text"]') || "";

        defer.resolve(parsedMetadata);
    }

    return defer.promise;
}
