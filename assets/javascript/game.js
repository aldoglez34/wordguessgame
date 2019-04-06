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
var category;
var difficulty;
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

    // if there's a username in the local storage, show it
    if (localStorage.getItem("wordguessgame") != null) {

        $("#username").val(localStorage.getItem("wordguessgame"));
    }
};

// ! new game button
$("._newgamebttn").click(function () {

    // hide the lose container in case it's a rerun
    $("#losecontainer").hide();

    // reset all values
    points = 1000;
    level = 1;
    word = [];
    _word = [];
    errorLetters = [];
    difficulty = $("#difficultyform").val();
    $("#ui_hearts").html("");
    $("#usedletters").html("");

    cleanLetters();

    var canStart = true;

    // set username in the global variable
    username = $("#username").val();

    // if username is blank then it can't start
    if (username === "") {
        canStart = false;
    }

    if (canStart) {

        // saves user in the local storage if checkbox is checked
        if (document.getElementById("rememberme").checked === true) {

            localStorage.setItem("wordguessgame", username);
        }

        // starts listening to input keys
        isListening = true;

        // show game info
        $("#ui_username").append("<span class=text-light>" + username + "</span>");
        $("#ui_difficulty").html(difficulty);
        $("#ui_level").html(level);
        $("#ui_points").html(points);

        // set wordsArray depending on the difficulty
        switch (difficulty) {
            case "Easy":
                hearts = 7;
                populateEasyArray();
                break;
            case "Medium":
                hearts = 6;
                populateMediumArray();
                break;
            case "Hard":
                hearts = 6;
                populateHardArray();
                break;
        }

        // show hearts
        for (var i = 0; i < hearts; i++) {
            $("#ui_hearts").append("<i class='fas fa-heart text-light mr-1'></i>");
        }

        // pick a word randomnly from the array and show it
        pickNewWord();
        refreshWord();

        // hide and show containers  
        $("#newgamecontainer").hide();
        $("#hangmangamecontainer").show(500);
    }
    else if (!canStart) {

        alert("Enter a username to start the game.")
    }
});

// -------------------------------------- listeners

document.onkeyup = function (event) {

    // ! this will only work if the game started
    if (isListening) {

        // var "k" will hold the keyboard input
        var k = event.key.toUpperCase();

        // mark the letter
        $("#letterstable tr").each(function () {

            $(this).find("td").each(function () {

                if (k === $(this).text()) {

                    $(this).html("<s class='text-danger'>" + k + "</s>");
                }
            })
        })

        // check if the given letter is in the word array
        checkLetter(k);

        // wait .5 seconds to check if the user won or lost
        setTimeout(checkIfWinOrLose, 500);
    }
}

$(".letter").click(function () {

    // var "k" will hold the letter pressed
    var k = $(this).text();
    $(this).html("<s class='text-danger'>" + k + "</s>");

    // check if the given letter is in the word array
    checkLetter(k);

    // wait .5 seconds to check if the user won or lost
    setTimeout(checkIfWinOrLose, 500);

});

// -------------------------------------- functions

function pickNewWord() {

    // clears all the arrays
    word = [];
    _word = [];
    errorLetters = [];

    // generate random number
    var length = 40;
    var random = Math.floor((Math.random() * length) + 1);

    // convert word into an array
    category = wordsArray["w" + random][0]["cat"];
    var w = wordsArray["w" + random][0]["word"];

    console.log(w);

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
    $("#category").text(category);

    // iterate the duplicated word array and set new word
    for (var i = 0; i < _word.length; i++) {

        var span = $("<span>");
        // span.attr("class", "_hangmanletter");
        span.attr("class", "mr-2");
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
                $("#ui_points").text(points);

                // substrackt 1 to hearts
                hearts--;
                // clear ui_hearts and show new amount of hearts
                $("#ui_hearts").html("");
                for (var i = 0; i < hearts; i++) {
                    $("#ui_hearts").append("<i class='fas fa-heart text-light mr-1'></i>");
                }

                // add the letter to the errorLetters array
                errorLetters.push(k);
                // clear ui_hearts and show new amount of hearts
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
        $("#ui_level").html(level);

        // update points
        points = points + 1000;
        $("#ui_points").html(points);

        cleanLetters();

        // refresh hearts
        switch (difficulty) {
            case "Easy":
                hearts = 7;
                break;
            case "Medium":
                hearts = 6;
                break;
            case "Hard":
                hearts = 6;
                break;
        }
        $("#ui_hearts").html("");
        for (var i = 0; i < hearts; i++) {
            $("#ui_hearts").append("<i class='fas fa-heart text-light mr-1'></i>");
        }

        // show new word
        pickNewWord();
        refreshWord();

        //alert the user
        alert("Great job! You are up 1 level and +1000 points.")
    }
    // ! if user didn't win then check if the user lost
    else if (hearts === 0) {

        $("#yourscore").text(points);
        $("#yourlevel").text(level);

        $("#hangmangamecontainer").hide();
        $("#losecontainer").show(500);

        storageScoreonDB();
    }
}

function cleanLetters() {

    $("#letterstable tr").each(function () {

        $(this).find("td").each(function () {

            var l = $(this).text();
            $(this).html("");
            $(this).html(l);
        })
    })
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

// -------------------------------------- arrays

function populateEasyArray() {

    wordsArray = [];
    var array = {
        w1: [{
            cat: "Animals in a Zoo",
            word: "LION",
        }],
        w2: [{
            cat: "Animals in a Zoo",
            word: "TIGER",
        }],
        w3: [{
            cat: "Animals in a Zoo",
            word: "EAGLE",
        }],
        w4: [{
            cat: "Animals in a Zoo",
            word: "BEAR",
        }],
        w5: [{
            cat: "Animals in a Zoo",
            word: "WOLF",
        }],
        w6: [{
            cat: "Animals in a Zoo",
            word: "CAMEL",
        }],
        w7: [{
            cat: "Clothes",
            word: "PANTS",
        }],
        w8: [{
            cat: "Clothes",
            word: "SHIRT",
        }],
        w9: [{
            cat: "Clothes",
            word: "SUIT",
        }],
        w10: [{
            cat: "Clothes",
            word: "SKIRT",
        }],
        w11: [{
            cat: "Clothes",
            word: "JEANS",
        }],
        w12: [{
            cat: "Sports",
            word: "GOLF",
        }],
        w13: [{
            cat: "Sports",
            word: "BASKETBALL",
        }],
        w14: [{
            cat: "Sports",
            word: "BASEBALL",
        }],
        w15: [{
            cat: "Sports",
            word: "SOCCER",
        }],
        w16: [{
            cat: "Sports",
            word: "FOOTBALL",
        }],
        w17: [{
            cat: "Body",
            word: "NOSE",
        }],
        w18: [{
            cat: "Body",
            word: "HEART",
        }],
        w19: [{
            cat: "Body",
            word: "EAR",
        }],
        w20: [{
            cat: "Body",
            word: "NECK",
        }],
        w21: [{
            cat: "Body",
            word: "EYE",
        }],
        w22: [{
            cat: "Months",
            word: "JANUARY",
        }],
        w23: [{
            cat: "Months",
            word: "FEBRUARY",
        }],
        w24: [{
            cat: "Months",
            word: "JULY",
        }],
        w25: [{
            cat: "Months",
            word: "DECEMBER",
        }],
        w26: [{
            cat: "Months",
            word: "SEPTEMBER",
        }],
        w27: [{
            cat: "Family Members",
            word: "COUSIN",
        }],
        w28: [{
            cat: "Family Members",
            word: "AUNT",
        }],
        w29: [{
            cat: "Family Members",
            word: "SISTER",
        }],
        w30: [{
            cat: "Family Members",
            word: "UNCLE",
        }],
        w31: [{
            cat: "Family Members",
            word: "MOTHER",
        }],
        w32: [{
            cat: "Insects",
            word: "MOSQUITO",
        }],
        w33: [{
            cat: "Insects",
            word: "BEE",
        }],
        w34: [{
            cat: "Insects",
            word: "SPIDER",
        }],
        w35: [{
            cat: "Insects",
            word: "ANT",
        }],
        w36: [{
            cat: "Insects",
            word: "FLEA",
        }],
        w37: [{
            cat: "Jobs",
            word: "ACTOR",
        }],
        w38: [{
            cat: "Jobs",
            word: "DOCTOR",
        }],
        w39: [{
            cat: "Jobs",
            word: "PILOT",
        }],
        w40: [{
            cat: "Jobs",
            word: "DENTIST",
        }],
        w41: [{
            cat: "Jobs",
            word: "LAWYER",
        }]
    };
    wordsArray = JSON.parse(JSON.stringify(array));
}

function populateMediumArray() {

    wordsArray = [];
    var array = {
        w1: [{
            cat: "Animals in a Zoo",
            word: "CHEETAH",
        }],
        w2: [{
            cat: "Animals in a Zoo",
            word: "LEOPARD",
        }],
        w3: [{
            cat: "Animals in a Zoo",
            word: "KANGAROO",
        }],
        w4: [{
            cat: "Animals in a Zoo",
            word: "CROCODILE",
        }],
        w5: [{
            cat: "Animals in a Zoo",
            word: "ZEBRA",
        }],
        w6: [{
            cat: "Animals in a Zoo",
            word: "GIRAFFE",
        }],
        w7: [{
            cat: "Clothes",
            word: "SOCKS",
        }],
        w8: [{
            cat: "Clothes",
            word: "PAJAMAS",
        }],
        w9: [{
            cat: "Clothes",
            word: "SCARF",
        }],
        w10: [{
            cat: "Clothes",
            word: "JACKET",
        }],
        w11: [{
            cat: "Clothes",
            word: "GLOVES",
        }],
        w12: [{
            cat: "Sports",
            word: "HOCKEY",
        }],
        w13: [{
            cat: "Sports",
            word: "BOWLING",
        }],
        w14: [{
            cat: "Sports",
            word: "RUGBY",
        }],
        w15: [{
            cat: "Sports",
            word: "SWIMMING",
        }],
        w16: [{
            cat: "Sports",
            word: "VOLLEYBALL",
        }],
        w17: [{
            cat: "Body",
            word: "CHEEK",
        }],
        w18: [{
            cat: "Body",
            word: "ELBOW",
        }],
        w19: [{
            cat: "Body",
            word: "STOMACH",
        }],
        w20: [{
            cat: "Body",
            word: "KNEES",
        }],
        w21: [{
            cat: "Body",
            word: "ANKLE",
        }],
        w22: [{
            cat: "Cars",
            word: "TOYOTA",
        }],
        w23: [{
            cat: "Cars",
            word: "HONDA",
        }],
        w24: [{
            cat: "Cars",
            word: "AUDI",
        }],
        w25: [{
            cat: "Cars",
            word: "FERRARI",
        }],
        w26: [{
            cat: "Cars",
            word: "BENTLEY",
        }],
        w27: [{
            cat: "Celebrations",
            word: "WEDDING",
        }],
        w28: [{
            cat: "Celebrations",
            word: "CHRISTMAS",
        }],
        w29: [{
            cat: "Celebrations",
            word: "HALLOWEEN",
        }],
        w30: [{
            cat: "Celebrations",
            word: "ANNIVERSARY",
        }],
        w31: [{
            cat: "Celebrations",
            word: "GRADUATION",
        }],
        w32: [{
            cat: "Insects",
            word: "BEETLE",
        }],
        w33: [{
            cat: "Insects",
            word: "COCKROACH",
        }],
        w34: [{
            cat: "Insects",
            word: "CRICKET",
        }],
        w35: [{
            cat: "Insects",
            word: "WASP",
        }],
        w36: [{
            cat: "Insects",
            word: "MOTH",
        }],
        w37: [{
            cat: "Jobs",
            word: "SALESMAN",
        }],
        w38: [{
            cat: "Jobs",
            word: "WAITER",
        }],
        w39: [{
            cat: "Jobs",
            word: "ENGINEER",
        }],
        w40: [{
            cat: "Jobs",
            word: "PROFESSOR",
        }],
        w41: [{
            cat: "Jobs",
            word: "NURSE",
        }]
    };
    wordsArray = JSON.parse(JSON.stringify(array));
}

function populateHardArray() {

    wordsArray = [];
    var array = {
        w1: [{
            cat: "Animals in a Zoo",
            word: "LLAMA",
        }],
        w2: [{
            cat: "Animals in a Zoo",
            word: "ANTEATER",
        }],
        w3: [{
            cat: "Animals in a Zoo",
            word: "GORILLA",
        }],
        w4: [{
            cat: "Animals in a Zoo",
            word: "HYENA",
        }],
        w5: [{
            cat: "Animals in a Zoo",
            word: "ARMADILLO",
        }],
        w6: [{
            cat: "Animals in a Zoo",
            word: "OSTRICH",
        }],
        w7: [{
            cat: "Clothes",
            word: "BOXER",
        }],
        w8: [{
            cat: "Clothes",
            word: "VEST",
        }],
        w9: [{
            cat: "Clothes",
            word: "JUMPER",
        }],
        w10: [{
            cat: "Clothes",
            word: "SLIPPERS",
        }],
        w11: [{
            cat: "Clothes",
            word: "TROUSERS",
        }],
        w12: [{
            cat: "Sports",
            word: "CYCLING",
        }],
        w13: [{
            cat: "Sports",
            word: "SOFTBALL",
        }],
        w14: [{
            cat: "Transportation",
            word: "SCOOTER",
        }],
        w15: [{
            cat: "Transportation",
            word: "AMBULANCE",
        }],
        w16: [{
            cat: "Transportation",
            word: "TAXI",
        }],
        w17: [{
            cat: "Body",
            word: "FINGERS",
        }],
        w18: [{
            cat: "Body",
            word: "BEARD",
        }],
        w19: [{
            cat: "Body",
            word: "CHIN",
        }],
        w20: [{
            cat: "Body",
            word: "WRIST",
        }],
        w21: [{
            cat: "Body",
            word: "MOUSTACHE",
        }],
        w22: [{
            cat: "Car Parts",
            word: "BRAKE",
        }],
        w23: [{
            cat: "Car Parts",
            word: "SEAT",
        }],
        w24: [{
            cat: "Car Parts",
            word: "WHEEL",
        }],
        w25: [{
            cat: "Car Parts",
            word: "WHINDSHIELD",
        }],
        w26: [{
            cat: "Car Parts",
            word: "CLUTCH",
        }],
        w27: [{
            cat: "Food",
            word: "NOODLES",
        }],
        w28: [{
            cat: "Food",
            word: "CROISSANT",
        }],
        w29: [{
            cat: "Food",
            word: "SHRIMP",
        }],
        w30: [{
            cat: "Food",
            word: "KETCHUP",
        }],
        w31: [{
            cat: "Food",
            word: "BAGEL",
        }],
        w32: [{
            cat: "Park",
            word: "SWINGS",
        }],
        w33: [{
            cat: "Park",
            word: "PLAYGROUND",
        }],
        w34: [{
            cat: "Park",
            word: "PICNIC",
        }],
        w35: [{
            cat: "Park",
            word: "TIRE",
        }],
        w36: [{
            cat: "Park",
            word: "SAND",
        }],
        w37: [{
            cat: "Drinks",
            word: "LIQUOR",
        }],
        w38: [{
            cat: "Drinks",
            word: "COCKTAIL",
        }],
        w39: [{
            cat: "Drinks",
            word: "BRANDY",
        }],
        w40: [{
            cat: "Drinks",
            word: "MILKSHAKE",
        }],
        w41: [{
            cat: "Drinks",
            word: "WINE",
        }]
    };
    wordsArray = JSON.parse(JSON.stringify(array));
}