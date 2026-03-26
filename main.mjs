//#region Server variables
const baseURL = "https://alchemy-kd0l.onrender.com";
const regURL = `${baseURL}/start`;
const statusURL = `${baseURL}/status`;
const answerURL = `${baseURL}/submit`;
const clueURL = `${baseURL}/clue`;

import credentials from './credentials.mjs';

let token = "";

const requestHeaders = {
    "Content-Type": "application/json",
    "Authorization": token,
}

//#endregion

//#region Challenge answers
let challengeAnswers = {
    1: solveChallenge1,
    2: solveChallenge2,
    3: solveChallenge3,
    4: solveChallenge4,
    5: solveChallenge5,
    6: solveChallenge6
}
//#endregion

//if better planning: would make file for each challenge like solveChallenge1 and export, import to make main.mjs file less messy
//#region Challenge 1
function solveChallenge1(){
    return 4;
}
//#endregion

//#region Challenge 2
function solveChallenge2(){
    return "pi";
}
//#endregion

//#region Challenge 3
const symbolDictonary = {
    "☉" : "Gold",
    "☿" : "Quicksilver",
    "☽" : "Silver",
    "♂" : "Iron"
}

//decodes a code based on a dictionary
function decodeWithDictionary(code, dictionary){
    let output = "";

    for(let char of code){
        let decodedLetter = dictionary[char];
        output += decodedLetter;
    }

    return output;
}

async function solveChallenge3(questionData){
    let codeword = questionData.prompt.split("“")[1].split("”")[0];
    let answerQuestion3 = decodeWithDictionary(codeword);
    return answerQuestion3;
}
//#endregion

//#region Challenge 4
//finds the big letters in a string
function findBigLetters(string){
    let output = "";

    for(let char of string){ //loops through each character in a string
        //checks if character is the same as uppercase and that its a letter and not symbol/space
        if(char == char.toUpperCase() && char.match(/[a-z]/i)){
            output += char; //if big letter -> add to output
        }
    }
    
    return output;
}

async function solveChallenge4(questionData){
    let poem = questionData.prompt.split("“")[1].split("”")[0];
    let poemBigLetters = findBigLetters(poem);
    return poemBigLetters;
}
//#endregion

//#region Challenge 5
//all the different gates done with one line functions for simplicity (checked tables online to see which values should be 1)
const andGate = (a, b) => { if(a == 1 && b == 1) {return 1} else {return 0}};
const orGate = (a, b) => { if(a == 1 || b == 1) {return 1} else {return 0}};
const notGate = (a) => { if(a == 0) {return 1} else {return 0}};
const andNotGate = (a, b) =>  notGate(andGate(a,b)); // not needed to make, but makes out job easier
const xOrGate = (a, b) => { if((a == 1 && b == 0) || (a == 0 && b == 1)) {return 1} else {return 0}};

//runs a curcuit (only works for the one made in the challenge)
function curcuit(a,b,c,d,e){
    const outputA = orGate(andGate(a,b), notGate(c)); //starts with the last gate "orGate" and then the other ones
    const outputB = andNotGate(xOrGate(c,d), andGate(d,e));

    return "" + outputA + outputB; //makes it into a string
}

//takes a string and splits it into an array of chunk sizes
function splitStringIntoChunks(string, chunkSize){
    let output = [];

    for (let i = 0; i < string.length; i += chunkSize) { //i increases with chunk size, not by ++ (0 -> 5 -> 10 etc)
        if(string.length >= i + chunkSize){ //only adds chunk if the string has enough characters left for desired chunk size
            output.push(string.slice(i, i + chunkSize)); //adds characters from string in chunkSize
        }
    }

    return output;
}

async function solveChallenge5(questionData){
    let digits = questionData.prompt.split('"')[1].split('"')[0];
    const digitsFiveChunked = splitStringIntoChunks(digits, 5);
    console.table(digitsFiveChunked);
    let answerToQuestion5 = "";

    for (let chunk of digitsFiveChunked){
        answerToQuestion5 += curcuit(chunk[0], chunk[1], chunk[2], chunk[3], chunk[4]);
    }

    return answerToQuestion5;
}
//#endregion


//#region Challenge 6
//deciphers a code as long as u have a key and the code to decipher
//NOTE: does not work when we use regular key as key = 2, only when key is whole alphabet
//could make key = number and then make let cipheredAlphabet = whatever it is when u push it by a number
function decipherCode(key, code){
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let output = "";

    for (let char of code){ //each character in the code to decipher
        if(char.match(/[a-z]/i)){ //if it is a letter we need to decode
            let decipheredCharacter = alphabet[key.indexOf(char)]; //the deciphered letter 
            output += decipheredCharacter; //add it to the deciphered text
        } else if (!output.endsWith(" ")){ //makes sure no repeated spaces
            output += " ";
        }
    }

    return output;
}

//make each letter of a word in a string have capital letter
function properCaseString(string){
    let output = "";

    //for loop that goes through each index in string (in NOT for)
    for (let i in string) {
        const char = string[i]; //the current character in the string we are iterating

        if(char.match(/[a-z]/i)){ //if it is a letter
            if ((string[i - 1]) == undefined || string[i - 1] == " ") { //first char in string if so OR previous char
                output += char.toUpperCase();
            } else { //if it is not first letter of word -> do not make upper case 
                output += char.toLowerCase();
            }
        } else { //if not letter -> add to output string
            output += char;
        }
    }

    return output;
}

async function solveChallenge6(){
    //get the notes in prompt (no split because the links didnt have any "" etc to differentiate in the prompt)
    let notesURL = "https://alchemy-kd0l.onrender.com/notes.md";
    let noteURL = "https://alchemy-kd0l.onrender.com/strangeNote.txt";

    //get only the text from the links
    let note = await (await fetch(notesURL)).text();
    let cipheredNote = await (await fetch(noteURL)).text();

    //get all big letters in the long note (the cipher key)
    let cipherKey = findBigLetters(note);

    //decipher the other note with only random letters using the cipherKey
    let dechiperedNote = properCaseString(decipherCode(cipherKey, cipheredNote));

    return dechiperedNote;
}
//#endregion

// ANSI escape codes for text color
const red = '\x1b[31m';
const cyan = '\x1b[36m';
const purple = "\x1b[38;2;177;67;204m";
const lightPurple = "\x1b[38;2;220;110;250m";
const pink = "\x1b[38;2;255;51;153m";
const reset = '\x1b[0m';

//#region Init program
//function that starts the whole program
async function init(){
    //step 1: log in to server
    await logInToServer(credentials) ? 
    console.log(cyan + "Log in successful \n") : console.log(red + "haha loser \n");
    
    //get the current status data -> needs it for my while loop to work
    let questionData = await getCurrentQuestion(); //initialze value

    //runs until the server says we are done (defines a message) -> could also do challengeId > 6 or undefined?
    //NOTE: CHANGED AFTER REACHED CHALLENGE 6.... so might not work... cant test... hope its ok...
    while (questionData.message == undefined) {
        //step 2: show current question for user:
        questionData = await getCurrentQuestion();
        console.log("\x1b[1m\x1b[4m" + purple + "Question " + questionData.challengeId + ":" + reset);
        console.log(lightPurple + questionData.prompt);
        console.log(pink + "Points possible: " + questionData.pointsPossible);
        console.log(pink + "Current score: " + questionData.currentScore);

        //step 3: solve current challenge 
        let currentChallengeAnswer = await challengeAnswers[questionData.challengeId]();
        console.log(cyan + "Trying answer: " + currentChallengeAnswer);

        //step 4: send the answer to server
        let answerData = await sendAnswer(currentChallengeAnswer);
            if (answerData.correct){
                console.log(cyan + "Correct answer! Points awarded:" + answerData.awarded + "\n");
            } else {
                console.log(red + "Wrong answer \n");
            }
    }

    //when all challenges are complete
    console.log(cyan + questionData.message + " Total score: " + questionData.finalScore);

    console.log(reset); //resets all colors i added to console log
}

init(); //start program
//#endregion

//#region Contact server
async function logInToServer(credentials){
    let response = await fetch(regURL, {
        method: "POST",
        headers: requestHeaders,
        body:JSON.stringify(credentials)
    }); 

    if(response.status < 300){ //if getting a response from server went OK
        response = await response.json();
        token = response.token;
        requestHeaders.Authorization = token;

        return true; //log in successful
    } else {
        return false; //bad response -> log in not successful
    }
}


async function getCurrentQuestion(){
    let response = await fetch(statusURL, {
        method: "GET",
        headers: requestHeaders,
    });

    if(response.status === 200){
        response = await response.json();
    }

    return response;
}

async function sendAnswer(answer){
    const answerObject = {"answer" : answer};

    let response = await fetch(answerURL, {
        method: "POST",
        headers: requestHeaders,
        body:JSON.stringify(answerObject)
    });

    if(response.status === 200){
        response = await response.json();
    }

    return response;
}

async function getClue(){
    let response = await fetch(clueURL, {
        method: "GET",
        headers: requestHeaders,
    });

    if(response.status === 200){
        response = await response.json();
    }

    return response;
}
//#endregion