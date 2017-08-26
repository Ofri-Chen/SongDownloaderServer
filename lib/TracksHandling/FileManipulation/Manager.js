var config = require('../../../config');
var downloadingManager = require('./../Manager');
var conversionHandler = require('./Conversion/ConversionHandler');
var metadataInjector = require('./Metadata/MetadataInjector');

module.exports = {
    watchForTracksToConvert: watch
};

var currentConversions = 0;

function watch(){
    setInterval(() => {
        if(shouldCovert()){
            var track = downloadingManager.tracksToConvert.shift();
            currentConversions++;
            conversionHandler.convertToMp3(track).then(() => {
                currentConversions--;
                metadataInjector.injectMetadata(track.artistName, track.name, track.mp3Path);
            });
        }
    }, config.watchForTracksInterval);
}

function shouldCovert(){
    return downloadingManager.tracksToConvert.length > 0
        && currentConversions < config.maxParallelConversions;
}

