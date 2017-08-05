var utilities = require('../Common/Utilities');

function Track(track){
    this.name = getTrackProperty(track, ['name']);
}

function getTrackProperty(obj, path){
    var property = utilities.getJsonProperty(obj, path);
    return utilities.toFirstLetterUpperCase(property);
}

module.exports = {
    Track: Track
};