var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
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