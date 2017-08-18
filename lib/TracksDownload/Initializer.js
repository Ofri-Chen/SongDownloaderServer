var config = require('config');
var fs = require('fs');

module.exports = {
    init: initialize
};

function initialize(artist){
    InitializeDirectories(artist);
}

function InitializeDirectories(artist){
    createDirectory(config.songsPath);
    createDirectory(config.mp3DirectoryPath);
    createDirectory(config.mp4DirectoryPath);
    createDirectory(config.artistSongsPath.replace('Artist_Name', artist.name));
}

function createDirectory(path){
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}