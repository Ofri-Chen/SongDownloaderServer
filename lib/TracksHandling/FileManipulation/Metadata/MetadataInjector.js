let q = require('q');
let config = require('../../../../config');
let http = require('http');
let https = require('https');
let utilities = require('../../../Common/Utilities');
let fs = require('fs');
var nodeID3 = require('node-id3');


var lastFm = config.externalApi.lastFm;

module.exports = {
    injectMetadata: injectMetadata
};

function injectMetadata(artistName, trackName, filePath) {
    fetchMetadata(artistName, trackName).then((metadata) => {
        return parseMetadata(metadata);
    }).then((parsedMetadata) => {
        downloadImage(filePath, parsedMetadata).then((imagePath) => {
            console.log('finished downloading image');
            parsedMetadata.imagePath = imagePath;
        }).catch(() => {
        }).then(() => {
            inject(filePath, parsedMetadata);
        });
    });
}

function inject(filePath, metadata) {
    var tags = {
        title: metadata.title,
        artist: metadata.artist,
        album: metadata.album,
        date: metadata.date,
        genre: metadata.genre,
    };
    if(metadata.image){
        tags.image = metadata.imagePath;
    }

    nodeID3.write(tags, filePath);
    fs.unlink(metadata.imagePath);
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
        parsedMetadata.album = utilities.toFirstLetterUpperCase(utilities.getJsonProperty(track, 'album.title')) || "";
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