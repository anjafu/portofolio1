const baseURL = "https://alchemy-kd0l.onrender.com";
const regURL = `${baseURL}/start`;
const statusURL = `${baseURL}/status`;
const answerURL = `${baseURL}/submit`;
const clueURL = `${baseURL}/clue`;

const credentials = {
        "email": "anjafu@uia.no", 
        "nick": "anjafu", 
        "pin": "1234"
    };

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


async function init(){
    await logInToServer(credentials);
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

    //show question for user:
    let questionData = await getCurrentQuestion();
    console.log(questionData);
    //console.log(await getClue());
    
    //send answer
    
    
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
    }   

    console.log(response);
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