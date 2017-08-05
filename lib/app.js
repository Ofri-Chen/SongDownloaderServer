var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var trackData = require('./TrackData/TrackData');
// process.env.CONFIG_PATH = './lib/config.js';

var app = express();
app.use(bodyParser.json());

console.log();

//TopTracks/{Artist}/{NumOfTracks}
app.get('/TopTracks/*/*', function(){

});

app.post('/DownloadTracks', function(req, res){
    console.log(req.body);
});

app.listen(config.port, function(){
    console.log(`listening on port ${config.port}`);
});

trackData.getTopTracks('Metallica', 20).then((artist) => {
    console.log('name', artist.name);
    console.log('tracks', artist.tracks);
});