var config = require('../config');
var fs = require('fs');

module.exports = {
    init: initialize
};

function initialize(artist){
    InitializeDirectories(artist);
}

function InitializeDirectories(artist)
{
    createDirectory(config.directories.songsPath);
    createDirectory(config.directories.mp3DirectoryPath);
    createDirectory(config.directories.mp4DirectoryPath);
    createDirectory(config.directories.artistSongsPath.replace('Artist_Name', artist.name));
}

function createDirectory(path){
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}