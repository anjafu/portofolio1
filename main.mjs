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

const symbolDictonary = {
    "☉" : "Gold",
    "☿" : "Quicksilver",
    "☽" : "Silver",
    "♂" : "Iron"
}

function decode(code){
    let decodedCode = "";

    for(let letter of code){
        let decodedLetter = symbolDictonary[letter];
        decodedCode += decodedLetter;
    }

    return decodedCode;
}

function findBigLetters(text){
    let onlyBigLetters = "";

    for(let letter of text){
        //checks if letter is the same as uppercase and that its a letter and not symbol/space
        if(letter == letter.toUpperCase() && letter.match(/[a-z]/i)){
            onlyBigLetters += letter;
        }
    }
    
    return onlyBigLetters;
}

const andGate = (a, b) => { if(a == 1 && b == 1) {return 1} else {return 0}};
const orGate = (a, b) => { if(a == 1 || b == 1) {return 1} else {return 0}};
const notGate = (a) => { if(a == 0) {return 1} else {return 0}};
const andNotGate = (a, b) =>  notGate(andGate(a,b));
const xOrGate = (a, b) => { if((a == 1 && b == 0) || (a == 0 && b == 1)) {return 1} else {return 0}};

function curcuit(a,b,c,d,e){
    const outputA = orGate(andGate(a,b), notGate(c));
    const outputB = andNotGate(xOrGate(c,d), andGate(d,e));

    return "" + outputA + outputB;
}

function runStringInChunks(string, chunkSize){
    let fiveCharactersArray = [];

    for (let i = 0; i < string.length; i += chunkSize) {
        if(string.length >= i + chunkSize){
            fiveCharactersArray.push(string.slice(i, i + chunkSize));
        }
    }

    return fiveCharactersArray;
}

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

// ANSI escape codes for text color
const red = '\x1b[31m';
const green = "\x1b[38;2;59;191;89m";
const cyan = '\x1b[36m';
const purple = "\x1b[38;2;177;67;204m";
const lightPurple = "\x1b[38;2;220;110;250m";
//38 is for foreground (48 background), 2 makes it expect three rbg numbers
const pink = "\x1b[38;2;255;51;153m";
const reset = '\x1b[0m';

async function init(){
    await logInToServer(credentials) ? 
    console.log(cyan + "Log in successful \n") : console.log(red + "haha loser \n");

    //question 1 and 2:
    //console.log(await sendAnswer(4));
    //console.log(await sendAnswer("pi"));

    //question 3:
    //let codeword = questionData.prompt.split("“")[1].split("”")[0];
    //let answerQuestion3 = decode(codeword);
    //console.log(answerQuestion3);
    //console.log(await sendAnswer(answerQuestion3));

    //question 4:
    //let poem = questionData.prompt.split("“")[1].split("”")[0];
    //let poemBigLetters = findBigLetters(poem);
    //console.log(await sendAnswer(poemBigLetters));

    //question 5:
    /*
    let digits = questionData.prompt.split('"')[1].split('"')[0];
    const digitsFiveChunked = runStringInChunks(digits, 5);
    console.table(digitsFiveChunked);
    let answerToQuestion5 = "";

    for (let chunk of digitsFiveChunked){
        answerToQuestion5 += curcuit(chunk[0], chunk[1], chunk[2], chunk[3], chunk[4]);
    }

    console.log(await sendAnswer(answerToQuestion5));*/

    //show question for user:
    let questionData = await getCurrentQuestion();
    console.log("\x1b[1m\x1b[4m" + purple + "Question " + questionData.challengeId + ":" + reset);
    console.log(lightPurple + questionData.prompt);
    console.log(pink + "Points possible: " + questionData.pointsPossible);
    console.log(pink + "Current score: " + questionData.currentScore);
    console.log(reset + "\n" );
    
    //send answer
    let notesURL = "https://alchemy-kd0l.onrender.com/notes.md";
    let noteURL = "https://alchemy-kd0l.onrender.com/strangeNote.txt";
    let note = await (await fetch(notesURL)).text();
    let cipherKey = findBigLetters(note);
    let cipheredNote = await (await fetch(noteURL)).text();
    let dechiperedNote = properCaseString(decipherCode(cipherKey, cipheredNote));
    //console.log(dechiperedNote);
    
}

init();

async function logInToServer(credentials){
    let response = await fetch(regURL, {
        method: "POST",
        headers: requestHeaders,
        body:JSON.stringify(credentials)
    }); 

    if(response.status < 300){
        response = await response.json();
        token = response.token;
        requestHeaders.Authorization = token;

        return true;
    } else {
        return false;
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