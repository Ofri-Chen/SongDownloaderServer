var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var trackData = require('./TrackData/TrackData');
var downloadingHandler = require('./TracksDownload/DownloadingHandler');
var converter = require('./TracksDownload/ConvertingHandler');

process.env.FFMPEG_PATH = config.ffmpegPath;

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

// downloadingHandler.downloadTracks({name: 'Metallica'});

trackData.getTopTracks('Foo Fighters', 5).then((artist) => {
    downloadingHandler.downloadTracks(artist);
});
//
// trackData.getTopTracks('Metallica', 50).then((artist) => {
//     downloadingHandler.downloadTracks(artist);
// });
//
// trackData.getTopTracks('Avenged Sevenfold', 50).then((artist) => {
//     downloadingHandler.downloadTracks(artist);
// });

process.on('uncaughtException', function (err) {
    console.log(err);
});