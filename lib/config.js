module.exports = {
    port: 5555,
    lastFm: {
        apiKey: 'api_key=5cfe225d4173261c71b97704dc74031c',
        apiBaseUrl: 'http://ws.audioscrobbler.com/2.0/?method=',
        routes: {
            getTopTracks: 'artist.gettoptracks&artist=Artist_Name&limit=Limit',
            getTrackInfo: 'track.getInfo&artist=Artist_Name&track=Track_Name'
        },
        jsonFormat: 'format=json'
    }
};