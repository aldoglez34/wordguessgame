// ! empty main array
var wordsArray = [];

// ! valid letters
const validLetters = ["A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"];

// ! global variables
// choosen word
var word = [];
// array that's gonna be filled with '*'
var _word = [];
// array that's gonna hold the error letters
var errorLetters = [];
// default game values
var difficulty = "EASY";
var hearts = 7;
var points;
var username;
var level;
// this var prevents the window to be listening to keys before the game starts
var isListening = false;

// ! on window load function
window.onload = function () {

    // hide everything except for the id_newgame_container
    $("#hangmangamecontainer").hide();
    $("#losecontainer").hide();
};

// ! new game button
$("._newgamebttn").click(function () {

    $("#losecontainer").hide();

    // reset all values
    points = 1000;
    level = 1;
    word = [];
    _word = [];
    errorLetters = [];
    $("#heartsdiv").html("");
    $("#usedletters").html("");

    var canStart = true;

    // set username in the global variable
    username = $("#username").val();

    // if username is blank then it can't start
    if (username === "") {
        canStart = false;
    }

    if (canStart) {

        // starts listening to input keys
        isListening = true;

        // show game info
        $("#ui_username").append("<span class=text-light>" + username + "</span>");
        $("#ui_difficulty").append("<span class=text-light>" + difficulty + "</span>");
        $("#ui_level").append("<span class=text-light>" + level + "</span>");
        $("#ui_points").append("<span class=text-light>" + points + "</span>");

        // set wordsArray depending on the difficulty
        if (difficulty === "EASY") {
            wordsArray.push("WHEEL");
            wordsArray.push("BREAD");
            wordsArray.push("ANGRY");
            wordsArray.push("DRESS");
            wordsArray.push("MILK");
            wordsArray.push("TABLE");
            wordsArray.push("POWER");
            wordsArray.push("LAUGH");
            hearts = 7;
        }
        else if (difficulty === "MEDIUM") {
            wordsArray.push("ABROAD");
            wordsArray.push("ACTRESS");
            wordsArray.push("AIRLINE");
            wordsArray.push("BACKGROUND");
            wordsArray.push("BENEATH");
            wordsArray.push("BREAKFAST");
            wordsArray.push("CAPTURE");
            wordsArray.push("PERCENTAGE");
            hearts = 6;
        }
        else if (difficulty === "HARD") {
            wordsArray.push("FURTHERMORE");
            wordsArray.push("FURTHERMORE");
            wordsArray.push("FURTHERMORE");
            wordsArray.push("FURTHERMORE");
            wordsArray.push("FURTHERMORE");
            wordsArray.push("FURTHERMORE");
            wordsArray.push("FURTHERMORE");
            wordsArray.push("FURTHERMORE");
            hearts = 5;
        }

        // show hearts
        for (var i = 0; i < hearts; i++) {
            $("#heartsdiv").append("<i class='fas fa-heart text-warning _gameinfotext'></i>");
        }

        // pick a word randomnly from the array and show it
        pickNewWord();
        refreshWord();

        console.log(word);
        console.log(_word);

        // hide and show containers  
        $("#newgamecontainer").hide();
        $("#hangmangamecontainer").show(500);
    }
    else if (!canStart) {

        alert("Enter a username to start the game.")
    }
});

// -------------------------------------- language and difficulty listeners

$(".jsdiff").click(function () {

    // clear all options
    $(".jsdiff").attr("class", "_textopt jsdiff");

    // save this to var
    var difficultyobj = $(this);

    // assign new class
    difficultyobj.attr("class", "_textopt _selectedtextopt jsdiff");

    // update global variables
    difficulty = difficultyobj.text();

    if (difficulty === "EASY") {
        hearts = 7;
    }
    else if (difficulty === "MEDIUM") {
        hearts = 6;
    }
    else if (difficulty === "HARD") {
        hearts = 5;
    }
});

// -------------------------------------- listeners

document.onkeyup = function (event) {

    // ! this will only work if the game started
    if (isListening) {

        // var "k" will hold the keyboard input
        var k = event.key.toUpperCase();

        // check if the given letter is in the word array
        checkLetter(k);

        // check if the user won or lost
        checkIfWinOrLose();
    }
}

$(".letter").click(function () {

    // var "k" will hold the letter pressed
    var k = $(this).text();

    // check if the given letter is in the word array
    checkLetter(k);

    // check if the user won or lost
    checkIfWinOrLose();

});

// -------------------------------------- functions

function pickNewWord() {

    // clears all the arrays
    word = [];
    _word = [];
    errorLetters = [];

    // generate random number
    var length = wordsArray.length;
    var random = Math.floor((Math.random() * length) + 1);

    // convert word into an array
    // (substract 1 en case random number is equals to the array length)
    var w = wordsArray[random - 1];

    // the var "word" contains the word picked from the array
    word = w.split('');

    // fill it with "_" instead of letters
    for (var i = 0; i < word.length; i++) {

        _word.push("*");
    }
}

function refreshWord() {

    // clear the word div
    $("#theworddiv").html("");

    // iterate the duplicated word array and set new word
    for (var i = 0; i < _word.length; i++) {

        var span = $("<span>");
        span.attr("class", "_hangmanletter");
        span.text(_word[i]);
        $("#theworddiv").append(span);
    }
}

function checkLetter(k) {

    // validates if the input is a letter from the alphabet
    var isletter = validateIfLetter(k);

    // it will only go here if the input IS a letter
    if (isletter) {

        var letterfound = false;

        // iterate the original word array to check if the given key exists
        for (var i = 0; i < word.length; i++) {

            // ! if word found
            if (word[i] === k) {

                // if it exists, push the given letter in the _word array in the exact position and refresh the html
                _word.splice(i, 1, k);
                refreshWord();

                // set letterfound to true
                letterfound = true;
            }
        }

        // ! if word NOT found
        if (!letterfound) {

            // FIRST check if the letter is already in the error letters array
            var isAlreadyInArray = false;
            for (var i = 0; i < errorLetters.length; i++) {

                //if it's in the array then it shouldn't push it 
                if (k === errorLetters[i]) {
                    isAlreadyInArray = true;
                }
            }

            // if it isn't then
            if (!isAlreadyInArray) {

                // decrement points
                points = points - 100;
                // update html
                $("#ui_points").text("Points: " + points);

                // substrackt 1 to hearts
                hearts--;
                // clear heartsdiv and show new amount of hearts
                $("#heartsdiv").html("");
                for (var i = 0; i < hearts; i++) {
                    $("#heartsdiv").append("<i class='fas fa-heart text-warning _gameinfotext'></i>");
                }

                // add the letter to the errorLetters array
                errorLetters.push(k);
                // clear heartsdiv and show new amount of hearts
                $("#usedletters").html("");
                // show the errorLetters on the html
                for (var i = 0; i < errorLetters.length; i++) {

                    var l = $("<span>");
                    l.attr("class", "text-warning mt-2 text-uppercase _gameinfotext");
                    l.text(errorLetters[i]);
                    $("#usedletters").append(l);
                }
            }
        }
    }

    if (!isletter) {

        console.log(k + " is not a letter from the english alphabet");
    }
}

function checkIfWinOrLose() {

    var userwins = true;

    // ! first check if the user won
    for (var i = 0; i < _word.length; i++) {

        if (_word[i] === "*") {

            userwins = false;
        }
    }

    // ! if user won show another word and reset the global variables
    if (userwins) {

        // udpate level
        level++;
        $("#ui_level").text("Level: " + level);

        // update points
        points = points + 1000;
        $("#ui_points").text("Points: " + points);

        // show new word
        pickNewWord();
        refreshWord();

        //alert the user
        alert("Great job! You are up 1 level and +1000 points.")
    }
    // ! if user didn't win then check if the user lost
    else if (hearts === 0) {

        $("#yourusername").text(username);
        $("#yourscore").text(points);
        $("#yourlevel").text(level);

        $("#hangmangamecontainer").hide();
        $("#losecontainer").show(500);

        storageScoreonDB();
    }
}

function validateIfLetter(k) {

    var isvalidletter = false;

    for (var i = 0; i < validLetters.length; i++) {
        if (k.toUpperCase() === validLetters[i]) {
            isvalidletter = true;
        }
    }

    return isvalidletter;
}

// -------------------------------------- firebase related stuff

function storageScoreonDB() {

    var database = firebase.database();

    database.ref().push({

        db_username: username,
        db_difficulty: difficulty,
        db_level: level,
        db_points: points
    });
}
