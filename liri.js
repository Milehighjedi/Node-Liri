require("dotenv").config();
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
const keys = require("./keys.js");
const fs = require('fs');


var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


var command = process.argv[2];
let input = "";

for (let i = 3; i < process.argv.length; i++) {
    input = input + " " + process.argv[i];
};


function myTweets(){
    client.get('statuses/user_timeline', 'StoverDeveloper', function (error, tweets, response) {
        if (!error) {
            console.log("Here are your tweets: \n"); 
            for (var x=0; x <= 19; x++){
                var thisTweet = tweets[x]; 
                console.log(thisTweet.text); 
                console.log(thisTweet.created_at); 
                console.log("__________________________\n"); 
            };
        }
    });
};


function spotifyThis(){
    spotify.search({ type: 'track', query: input, limit: 3 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        var song = (data.tracks.items[0] || "No information available");
        var artists = song.artists;
        if (artists){
            artists.forEach(function (element) {
                console.log("Artist: " + element.name);
            }); 
        };
        console.log("Track Name: " + song.name || "No song information available");
        console.log("Preview Link: " + song.external_urls.spotify || "No preview link available");
        console.log("Album: " + song.album.name || "No album information available");
        console.log("__________________________\n"); 
    });
};


function movieThis() {
    request("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log("Here's some information about your movie: \n"); 
            console.log("Title: " + (movie.Title || "No title available")); 
            console.log("Year: " + (movie.Year || "No year available")); 
            console.log("IMDB Rating: " + (movie.imdbRating + "/10" || "No rating available"));
            if (movie.Ratings[1]){
                console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value); 
            }
            else {
                console.log("Rotten Tomatoes Rating: No Rotten Tomatoes Rating Available");
            } 
            console.log("Country: " + (movie.Country || "No country information available")); 
            console.log("Language(s): " + (movie.Language || "No language available")); 
            console.log("Plot: " + (movie.Plot || "No plot information available")); 
            console.log("Actors: " + (movie.Actors || "No actor information available")); 
            console.log("__________________________\n"); 
        }
    });
};

function doWhat() {

    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        command = dataArr[0];
        input = dataArr[1];
        runCommand();
    });
};


function runCommand(){
switch (command) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThis();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhat();
        break;
    };
};

<<<<<<< HEAD
runCommand(); 
=======
runCommand(); 
>>>>>>> a95360c9b83844c7e278aba0e2f2904c00d43eee
