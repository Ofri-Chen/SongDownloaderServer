let q = require('q');
let config = require('../../../../config');
let http = require('http');
let https = require('https');
let utilities = require('../../../Common/Utilities');
let fs = require('fs');


var lastFm = config.externalApi.lastFm;

module.exports = {
    injectMetadata: injectMetadata
};

function injectMetadata(artistName, trackName, filePath) {
    fetchMetadata(artistName, trackName).then((metadata) => {
        return parseMetadata(metadata);
    }).then((parsedMetadata) => {
        downloadImage(filePath, parsedMetadata).then((imagePath) => {
            console.log('finished downloading image !');
            parsedMetadata.imagePath = imagePath;
            console.log('---------first-------------');
            console.dir(parsedMetadata);
            console.log('---------first-------------');
        }).catch(() => {
        }).then(() => {
            inject(parsedMetadata);
        });
    });
}

function inject(metadata) {
    console.log('---------second-------------');
    console.dir(metadata);
    console.log('---------second-------------');
    // console.log('injecting metadata');
}

function fetchMetadata(artistName, trackName) {
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
function parseMetadata(metadata) {
    var defer = q.defer();
    var parsedMetadata = {};

    metadata = JSON.parse(metadata);


    let track = utilities.getJsonProperty(metadata, 'track');
    if (!track) {
        console.log('metadata.track is undefined');
        defer.reject();
    }
    else {
        parsedMetadata.albumTitle = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'album.title')) || "";
        parsedMetadata.publishDate = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'wiki.published')) || "";
        parsedMetadata.title = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'name')) || "";
        parsedMetadata.genre = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'toptags.tag[0].name')) || "";
        parsedMetadata.artist = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'artist.name')) || "";
        parsedMetadata.image = utilities.getJsonProperty(track, 'album.image[3]') || "";

        defer.resolve(parsedMetadata);
    }

    return defer.promise;
}

function downloadImage(mp3FilePath, parsedMetadata) {
    let defer = q.defer();
    let imagePath = mp3FilePath.replace('.mp3', '.png');
    let url = '';

    try {
        url = parsedMetadata.image["#text"];
        let imageWriteStream = fs.createWriteStream(imagePath);

        console.log(`downloading image for ${imagePath}, url: ${url}`);
        https.get(url, (res) => {
            res.pipe(imageWriteStream).on('finish', () => {
                defer.resolve(imagePath);
            }).on('error', (err) => {
                throw err;
            })
        });
    }
    catch (err) {
        console.log(err);
        defer.reject();
    }

    return defer.promise;
}