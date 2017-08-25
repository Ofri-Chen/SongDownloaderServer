module.exports = {
    port: 5555,
    externalApi: {
        lastFm: {
            apiKey: 'api_key=5cfe225d4173261c71b97704dc74031c',
            apiBaseUrl: 'http://ws.audioscrobbler.com/2.0/?method=',
            routes: {
                getTopTracks: 'artist.gettoptracks&artist=Artist_Name&limit=Limit',
                getTrackInfo: 'track.getInfo&artist=Artist_Name&track=Track_Name'
            },
            jsonFormat: 'format=json'
        },
        youtube: {
            api: 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=Track_Name&type=video&maxResults=1&key=AIzaSyDOegfItpZ_goZccL_pmREwZoNXoaYZNaw',
        }
    },
    directories: {
        songsPath: '../Songs/',
        mp3DirectoryPath: '../Songs/mp3/',
        mp4DirectoryPath: '../Songs/mp4/',
        artistSongsPath: '../Songs/mp3/Artist_Name'
    },
    youtubeBaseUrl: 'https://www.youtube.com/watch?v=',
    maxParallelConversions: 5,
    watchForTracksInterval: 1000,
    ffmpegPath: '../node_modules/ffmpeg/bin/ffmpeg.exe',
};