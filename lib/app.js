var express = require('express');
var bodyParser = require('body-parser');
var config = require('./../config');
var trackData = require('./TrackData/TrackData');
var downloadingManager = require('./TracksHandling/Manager');
// var converter = require('./TracksHandling/FileManipulation/Conversion/ConversionHandler');
var fileManipulationManager = require('./TracksHandling/FileManipulation/Manager');
var metadataInjector = require('./TracksHandling/FileManipulation/Metadata/MetadataInjector');
var utilities = require('./Common/Utilities');
fileManipulationManager.watchForTracksToConvert();

var app = express();
app.use(bodyParser.json());

//TopTracks/{Artist}/{NumOfTracks}
app.get('/TopTracks/:artist/:numOfTracks', function (req, res) {
    var artist = req.query.artist;
    var numOfTracks = req.query.numOfTracks;

    trackData.getTopTracks(artist, numOfTracks).then((artist) => {
        res.status(200).send(artist);
    }).catch((err) => {
        res.status(err.status || 500).send(err.message || 'an error occurred');
        console.log(err);
    })
});

app.post('/DownloadTracks', function (req, res) {
    console.log(req.body);
    downloadingManager.downloadTracks(req.body);
    res.status(200).send();
});

app.listen(config.port, function () {
    console.log(`listening on port ${config.port}`);
});

// trackData.getTopTracks('Foo Fighters', 50).then((artist) => {
//     downloadingManager.downloadTracks(artist);
// });
// trackData.getTopTracks('Metallica', 50).then((artist) => {
//     downloadingManager.downloadTracks(artist);
// });
// trackData.getTopTracks('Green Day', 50).then((artist) => {
//     downloadingManager.downloadTracks(artist);
// });

process.on('uncaughtException', function (err) {
    console.log(err);
});