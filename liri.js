const fs = require("fs"); 
const request = require("request");
const keys = require("./keys.js");
const twitter = require("twitter");
const spotify = require ("spotify");
const dotenv = require("dotenv").config()
const liriArg = process.argv[2];

switch(liriArg) {
    case "my-tweets": myTweets(); break;
    case "spotify-this-song": spotifyThisSong(); break;
    case "movie-this": movieThis(); break;
    case "do-what-it-says": doWhatItSays(); break;
    default: console.log("\r\n" +"Try typing one of the following commands: " +"\r\n"+
        "my-tweets 'any twitter name' " +"\r\n"+
        "spotify-this-song 'any song name' "+"\r\n"+
        "movie-this 'any movie name' "+"\r\n"+
        "do-what-it-says."+"\r\n"+
        "Be sure to put the name in quotation marks if it is multiple words.");
};

function movieThis(){
    let movie = process.argv[3];
    if(!movie){
        movie = "mr nobody";
    }
    parameter = movie
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + parameter + "&y=&plot=short&r=json&tomatoes=true", function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let movieObject = JSON.parse(body);
            
            let movieResults =
            "------------------------------ begin ------------------------------" + "\r\n"
            "Title: " + movieObject.Title+"\r\n"+
            "Year: " + movieObject.Year+"\r\n"+
            "Imdb Rating: " + movieObject.imdbRating+"\r\n"+
            "Country: " + movieObject.Country+"\r\n"+
            "Language: " + movieObject.Language+"\r\n"+
            "Plot: " + movieObject.Plot+"\r\n"+
            "Actors: " + movieObject.Actors+"\r\n"+
            "Rotten Tomatoes Rating: " + movieObject.tomatoRating+"\r\n"+
            "Rotten Tomatoes URL: " + movieObject.tomatoURL + "\r\n" + 
            "------------------------------ fin ------------------------------" + "\r\n";
            console.log(movieResults);
            log(movieResults); 
        } else {
            console.log("Error :"+ error);
            return;
        }
    });
};

function myTweets() {
    let client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret, 
    });
    let twitterUsername = process.argv[3];
    if(!twitterUsername){
        twitterUsername = "gotta_fill_it";
    }
    parameter = {screen_name: twitterUsername};
    client.get("statuses/user_timeline/", parameter, function(error, data, response){
        if (!error) {
            for(var i = 0; i < data.length; i++) {
                
                let twitterResults = 
                "@" + data[i].user.screen_name + ": " + 
                data[i].text + "\r\n" + 
                data[i].created_at + "\r\n" + 
                "------------------------------ " + i + " ------------------------------" + "\r\n";
                console.log(twitterResults);
                log(twitterResults); 
            }
        }  else {
            console.log("Error :"+ error);
            return;
        }
    });
}

function spotifyThisSong(songName) {
    let songName = process.argv[3];
    if(!songName){
        songName = "The Sign";
    }
    parameter = songName;
    spotify.search({ type: "track", query: parameter }, function(err, data) {
        if(!err){
            let songInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (songInfo[i] != undefined) {
                    let spotifyResults =
                    "Artist: " + songInfo[i].artists[0].name + "\r\n" +
                    "Song: " + songInfo[i].name + "\r\n" +
                    "Album the song is from: " + songInfo[i].album.name + "\r\n" +
                    "Preview Url: " + songInfo[i].preview_url + "\r\n" + 
                    "------------------------------ " + i + " ------------------------------" + "\r\n";
                    console.log(spotifyResults);
                    log(spotifyResults); 
                }
            }
        }	else {
            console.log("Error :"+ err);
            return;
        }
    });
};

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data){
        if (!error) {
            doWhatItSaysResults = data.split(",");
            spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
        } else {
            console.log("Error occurred" + error);
        }
    });
};

function log(logResults) {
  fs.appendFile("log.txt", logResults, (error) => {
    if(error) {
      throw error;
    }
  });
}