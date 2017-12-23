var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var config = require('./../config');
var trackData = require('./TrackData/TrackData');
var downloadingManager = require('./TracksHandling/Manager');
// var converter = require('./TracksHandling/FileManipulation/Conversion/ConversionHandler');
var fileManipulationManager = require('./TracksHandling/FileManipulation/Manager');
var metadataInjector = require('./TracksHandling/FileManipulation/MetadataInjector');
var utilities = require('./Common/Utilities');
var log = require('./Common/logger');
var youtubeApiRequestHandler = require('./TracksHandling/Download/ApiRequestHandler');

fileManipulationManager.watchForTracksToConvert();

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/topTracks', function (req, res) {
    var artist = req.query['artistName'];
    var numOfTracks = req.query['numOfTracks'];
    log.logInfo(`/topTracks: ${artist}-${numOfTracks}`);

    trackData.getTopTracks(artist, numOfTracks).then((artist) => {
        res.status(200).send(artist);
    }).catch((err) => {
        res.status(err.status || 500).send(err.message || 'an error occurred');
        log.logInfo(err);
    })
});

app.get('/getVideoId', (req, res) => {
    let artistName = req.query['artistName'];
    let trackName = req.query['trackName'];
    let withLyrics = req.query['withLyrics'] == "true"|| req.query['withLyrics'] == true;
    let resultNum = req.query['resultNum'];
    log.logInfo(`/getVideoId: ${artistName}, ${trackName}, ${withLyrics}`);

    youtubeApiRequestHandler.youtubeApiRequest(`${artistName} - ${trackName}`, withLyrics, resultNum)
        .then((videoId) => {
            console.log('videoId: ' + videoId);
            res.status(200).send(videoId)
        })
        .catch(err => res.status(500).send(err));
});

app.post('/downloadTracks', (req, res) => {
    log.logInfo('/downloadTracks');

    downloadingManager.downloadTracks(req.body);
    res.status(200).send();
});

app.listen(config.port, () => {
    log.logInfo(`listening on port ${config.port}`);

});

process.on('uncaughtException', function (err) {
    log.logInfo(err);
});