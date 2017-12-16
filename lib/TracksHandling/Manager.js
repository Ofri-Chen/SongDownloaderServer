var q = require('q');
var initializer = require('./Initializer');
var youtubeApiRequestHandler = require('./Download/ApiRequestHandler');
var config = require('../../config');
var trackDownloader = require('./Download/trackDownloader');
var fs = require('fs');
var log = require('../Common/logger');

var tracksToConvert = [];

module.exports = {
    downloadTracks: manageDownloads,
    tracksToConvert: tracksToConvert
};


function manageDownloads(artist) {
    initializer.init(artist);
    artist.tracks = artist.tracks.map((track) => {
        return track.name.includes('/') ? track.replace('/', '!') : track;
    });
    downloadTracks(artist);
}

function downloadTracks(artist) {
    artist.tracks.forEach((track) => {
        var fullName = `${artist.name} - ${track.name}`;

        var mp4Path = `${config.directories.mp4DirectoryPath}${fullName}.mp4`;
        var mp3Path = `${config.directories.artistSongsPath.replace('Artist_Name', artist.name)}/${track.name}.mp3`;
        // log.logInfo(mp3Path);

        if (track['videoId']) {
            trackDownloader.download(track['videoId'], mp4Path)
                .then(() => {
                    tracksToConvert.push({mp4Path: mp4Path, mp3Path: mp3Path, artistName: artist.name, name: track.name});
                }).catch((err) => {
                log.logInfo('err:' + err);
            });
        }
        else {
            youtubeApiRequestHandler.youtubeApiRequest(fullName, artist.withLyrics)
                .then((videoId) => {
                    return trackDownloader.download(videoId, mp4Path);
                }).then(() => {
                tracksToConvert.push({mp4Path: mp4Path, mp3Path: mp3Path, artistName: artist.name, name: track.name});
            }).catch(err => log.logInfo('err:' + err));
        }
    });
}