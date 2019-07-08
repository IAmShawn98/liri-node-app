// Node Packages.
require("dotenv").config();
require("./keys");

var spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

// Spotify API Credentials.
var spotify = new spotify({
    id: "025101643c634a0bb0d1839b1acd9b62",
    secret: "15c4b3ce073f406488743202cfd46afd"
});

// Trigger API (Example: 'spotify-this').
var userInput = process.argv[2];
// Send API Request (Example: 'I Want It That Way').
var userQuery = process.argv.slice(3).join(" ");

// LIRI TIPS.

// Tip array.
var tipAry = [
    "Remember, you can always reference\n this list by typing 'node liri' in the\n command line.",
    "If you're seeing this message\n after typing a command, then your command\n was invalid.",
    "Songs and movies have 'Previews'\n for you to enjoy, click on them when you\n see them."
];

// Make tips random.
var RandomTips = Math.floor(Math.random(tipAry) * 3);

// Loop through the tip index and show random tip strings.
for (key in tipAry) {
    // Push tip string index into the 'tip' variable.
    tip = tipAry[RandomTips];
    // Break after one iteration so we don't get the same string three times.
    break;
}

// If the 'userInput' is equal to one of the switch cases, execute API request from that switch case index.
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "spotify-this":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "concert-this":
            concertThis();
            break;
        case "do-this":
            doWhatItSays();
            break;
        // If the 'userInput' doesn't match any switch case, do this.
        default:
            console.log("╔════════════════════ WELCOME ══════════════════════════════╗");
            console.log(" Welcome, my name is Liri, your personal command line buddy! \n" +
                " How can I help you? Below are a list of handy \n" +
                " little commands. \n");

            console.log("╔═════════════ Command Lsit ══════════════╗");
            console.log(" ★ node liri <spotify-this>, <song name>");
            console.log(" ★ node liri <concert-this>, <artist name>");
            console.log(" ★ node liri <movie-this>, <movie name>");
            console.log("╚═════════════ Command Lsit ══════════════╝ \n");

            console.log(" LIRI TIPS: " + tip) + ".";
            console.log("╚════════════════════ WELCOME ══════════════════════════════╝");

            userInput = "Liri Script Executed, Showing List of Commands";
            // Create the command the user wrote into a log file.
            fs.appendFile('log.txt', userInput + "\n", function (err) {
                if (err) throw err;
            });
    }
}

// Execute Switch Statement.
userCommand(userInput, userQuery);

// The code below is a function list of all possible API requests that will execute from the switch case statement.

// Spotify API.
function spotifyThis() {
    if (!userQuery) {
        userQuery = "The Sign Ace of Base";
    }
    // Spotify Search Query.
    spotify.search({ type: 'track', query: userQuery, limit: 1 }, function (error, data) {
        if (error) {
            return console.log("Error Occurred: " + error);
        }
        // Loop through the spotify data object array and return song data from children.
        let spotifyAry = data.tracks.items;
        for (var i = 0; i < spotifyAry.length; i++) {
            // Content Container [Start].
            console.log('\n---------- ' + userInput + ' ----------\n');
            // Artists Name.
            console.log("Artists: " + data.tracks.items[i].album.artists[0].name + "\n");
            // Song Name.
            console.log("Song: " + data.tracks.items[i].name + "\n");
            // Album & Release Year.
            console.log("Album : " + data.tracks.items[i].album.name + " " + "(" + data.tracks.items[i].album.release_date + ")" + "\n");
            // Song Preview Link.
            console.log("Preview: " + data.tracks.items[i].preview_url + "\n");
            // Content Container [End].
            console.log('---------- ' + userInput + ' ----------');

            // Create the command the user wrote into a log file.
            fs.appendFile('log.txt', userInput + ": '" + userQuery + "'\n", function (err) {
                if (err) throw err;
            });
        }
    });
}

// OMDB API.
function movieThis() {
    // OMDB URL Query.
    axios.get('http://www.omdbapi.com/?apikey=trilogy&t=' + userQuery)
        .then(function (response) {
            // Content Container [Start].
            console.log('\n---------- ' + userInput + ' ----------\n');
            // Movie Title + Year.
            console.log("Movie Title: " + response.data.Title + " " + "(" + response.data.Year + ")" + "\n")
            // Loop through the response object and grab the ratings.
            for (var r = 0; r < response.data.Ratings.length; r++) {
                var rSource = response.data.Ratings[r].Source;
                var rValue = response.data.Ratings[r].Value;
                // Log the ratings response.
                console.log(rSource + ":" + " " + rValue + "\n");
            }
            // Country Produced.
            console.log("Country Produced: " + response.data.Country + "\n");
            // Language.
            console.log("Language: " + response.data.Language + "\n");
            // Movie Plot.
            console.log("Movie Plot: " + response.data.Plot + "\n");
            // Movie Cast.
            console.log("Movie Cast: " + response.data.Actors + "\n")

            console.log('\n---------- ' + userInput + ' ----------\n');
            // Content Container [End].

            // Create the command the user wrote into a log file.
            fs.appendFile('log.txt', userInput + ": '" + userQuery + "'\n", function (err) {
                if (err) throw err;
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// Bands In Town API.
function concertThis() {
    // Make a request for a user with a given ID
    axios.get("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp")
        .then(function (response) {
            // Content Container [Start].
            console.log('\n---------- ' + userInput + ' ----------\n');
            // Concert Venue Name.
            console.log("Venue: " + response.data[1].venue.name + "\n");
            // Concert Location.
            console.log("Location: " + response.data[1].venue.country + " " + "(" + response.data[1].venue.city + ")" + "\n");
            // Concert Date.
            var dateTimeFormat = moment(response.data[1].datetime).format("MM/DD/YYYY");
            console.log("Event Date: " + dateTimeFormat + "\n");
            // Content Container [End].
            console.log('\n---------- ' + userInput + ' ----------\n');
            // console.log(response)

            // Create the command the user wrote into a log file.
            fs.appendFile('log.txt', userInput + ": '" + userQuery + "'\n", function (err) {
                if (err) throw err;
            });
        })

        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

// doWhatItSays() ---> Returns a random API response dependent on the content of the 'random.txt' file.
function doWhatItSays() {
    // Read file 'random.txt'.
    fs.readFile("random.txt", "utf8", function (err, data) {

        // Handle Data Exception. 
        if (err) {
            throw err;
        }

        // Splits the data from 'random.txt' into two seperate entities (arguments in this case).
        let dataAry = data.split(",");

        // Equal to the values in our switch statement (Example: spotify-this).
        userInput = dataAry[0];

        // Equal to the data request for the corresponding API (Example: 'I want it that way').
        userQuery = dataAry[1];

        // Call our switch statement and attempt to compile a data response from our text file 'random.txt'.
        userCommand(userInput, userQuery);

        // Create the command the user wrote into a log file.
        fs.appendFile('log.txt', userInput + ": '" + userQuery + "'\n", function (err) {
            if (err) throw err;
        });
    });
}