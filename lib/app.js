var express = require('express');
var bodyParser = require('body-parser');
var config = require('./../config');
var trackData = require('./TrackData/TrackData');
var downloadingManager = require('./TracksHandling/Manager');
var converter = require('./TracksHandling/Conversion/ConversionHandler');

converter.watchForTracksToConvert();

var app = express();
app.use(bodyParser.json());

//TopTracks/{Artist}/{NumOfTracks}
app.get('/TopTracks/:artist/:numOfTracks', function(req, res){
    var artist = req.params.artist;
    var numOfTracks = req.params.numOfTracks;

    trackData.getTopTracks(artist, numOfTracks).then((artist) => {
        res.status(200).send(artist);
    }).catch((err) => {
        res.status(err.status || 500).send(err.message || 'an error occurred');
        console.log(err);
    })
});

app.post('/DownloadTracks', function(req, res){
    console.log(req.body);
});

app.listen(config.port, function(){
    console.log(`listening on port ${config.port}`);
});

trackData.getTopTracks('Foo Fighters', 5).then((artist) => {
    downloadingManager.downloadTracks(artist);
});

process.on('uncaughtException', function (err) {
    console.log(err);
});