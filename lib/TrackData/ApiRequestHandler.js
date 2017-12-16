var config = require('../../config.js');
var http = require('http');
var q = require('q');
var types = require('../Types/Types');
var log = require('../Common/logger');
var urlencode = require('urlencode')

var lastFm = config.externalApi.lastFm;
var rawTopTracksRequest= `${lastFm.apiBaseUrl}${lastFm.routes.getTopTracks}&${lastFm.apiKey}&${lastFm.jsonFormat}`;

function requestTopTracks(artist, limit){
    let defer = q.defer();
    if(!validateInput(artist, limit)){
        defer.reject(new types.Error(500, "invalid parameters"));
    }

    let request = rawTopTracksRequest.replace('Artist_Name', urlencode(artist)).replace('Limit', urlencode(limit));
    requestTracks(request).then((data) => {
        defer.resolve(JSON.parse(data).toptracks);
    }).catch((err) => {
        defer.reject(err);
    });

    return defer.promise;
}

function requestTracks(request){
    var defer = q.defer();

    http.get(request, (res) => {
        let responseData = '';
        res.on('data', (data) => {
            responseData += data;
        }).on('error', (err) => {
            defer.reject(new Error(500, err));
        }).on('end', () => {
            var responseDataJson = JSON.parse(responseData);
            if(responseDataJson .error == 6){
                defer.reject(new types.Error(404, responseDataJson.message));
            }
            else{
                defer.resolve(responseData)
            }
        });
    });

    return defer.promise;
}

function validateInput(artist, limit){
    if(!artist || !limit){
        return false;
    }

    var regExp = new RegExp('^[0-9]{1,3}$');
    return regExp.test(limit);
}

module.exports = {
    getTopTracks: requestTopTracks
};