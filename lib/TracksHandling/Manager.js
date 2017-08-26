var q = require('q');
var initializer = require('./Initializer');
var youtubeApiRequestHandler = require('./Download/ApiRequestHandler');
var config = require('../../config');
var trackDownloader = require('./Download/trackDownloader');
var fs = require('fs');

var tracksToConvert = [];

module.exports = {
    downloadTracks: manageDownloads,
    tracksToConvert: tracksToConvert
};


function manageDownloads(artist){
    initializer.init(artist);
    // console.dir(artist);
    downloadTracks(artist).then(() => {
        console.log(`finished downloading ${artist.name} - ${artist.tracks.length} tracks`)
    }).catch(() => {
        console.log(`an error occurred while downloading ${artist.name}'s songs`)
    });
}

function downloadTracks(artist){
    artist.tracks.forEach((track) => {
        var fullName = `${artist.name} - ${track}`;

        var mp4Path = `${config.directories.mp4DirectoryPath}${fullName}.mp4`;
        var mp3Path = `${config.directories.artistSongsPath.replace('Artist_Name', artist.name)}/${fullName}.mp3`;
        // console.log(mp3Path);

        youtubeApiRequestHandler.youtubeApiRequest(fullName, artist.withLyrics)
            .then((videoId) => {
                return trackDownloader.download(videoId, mp4Path);
            }).then(() => {
                tracksToConvert.push({mp4Path: mp4Path, mp3Path: mp3Path, artistName: artist.name, name: track});
            }).catch((err) => {
                console.log('err:', err);
            });
    });
}