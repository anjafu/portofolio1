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
//#endregion

// ANSI escape codes for text color
const red = '\x1b[31m';
const green = "\x1b[38;2;59;191;89m";
const cyan = '\x1b[36m';
const purple = "\x1b[38;2;177;67;204m";
const lightPurple = "\x1b[38;2;220;110;250m";
//38 is for foreground (48 background), 2 makes it expect three rbg numbers
const pink = "\x1b[38;2;255;51;153m";
const reset = '\x1b[0m';

//#region Init program
//function that starts the whole program
async function init(){
    //step 1: log in to server
    await logInToServer(credentials) ? 
    console.log(cyan + "Log in successful \n") : console.log(red + "haha loser \n");

    //question 1 and 2:
    //console.log(await sendAnswer(4));
    //console.log(await sendAnswer("pi"));

    //question 3:
    //let codeword = questionData.prompt.split("“")[1].split("”")[0];
    //let answerQuestion3 = decodeWithDictionary(codeword);
    //console.log(answerQuestion3);
    //console.log(await sendAnswer(answerQuestion3));

    //question 4:
    //let poem = questionData.prompt.split("“")[1].split("”")[0];
    //let poemBigLetters = findBigLetters(poem);
    //console.log(await sendAnswer(poemBigLetters));

    //question 5:
    /*
    let digits = questionData.prompt.split('"')[1].split('"')[0];
    const digitsFiveChunked = splitStringIntoChunks(digits, 5);
    console.table(digitsFiveChunked);
    let answerToQuestion5 = "";

    for (let chunk of digitsFiveChunked){
        answerToQuestion5 += curcuit(chunk[0], chunk[1], chunk[2], chunk[3], chunk[4]);
    }

    console.log(await sendAnswer(answerToQuestion5));*/

    //step 2: show question for user:
    let questionData = await getCurrentQuestion();
    console.log("\x1b[1m\x1b[4m" + purple + "Question " + questionData.challengeId + ":" + reset);
    console.log(lightPurple + questionData.prompt);
    console.log(pink + "Points possible: " + questionData.pointsPossible);
    console.log(pink + "Current score: " + questionData.currentScore);
    console.log(reset + "\n" );
    
    //step 3: send answer
    let notesURL = "https://alchemy-kd0l.onrender.com/notes.md";
    let noteURL = "https://alchemy-kd0l.onrender.com/strangeNote.txt";
    let note = await (await fetch(notesURL)).text();
    let cipherKey = findBigLetters(note);
    let cipheredNote = await (await fetch(noteURL)).text();
    let dechiperedNote = properCaseString(decipherCode(cipherKey, cipheredNote));
    //console.log(dechiperedNote);
    
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