const baseURL = "https://alchemy-kd0l.onrender.com";
const regURL = `${baseURL}/start`;
const statusURL = `${baseURL}/status`;
const answerURL = `${baseURL}/submit`;

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
/*
const requestHeaders = () => {
    return {
        "Content-Type": "application/json",
        "Authorization": token, //hvis token endres, så endres den aldri her hvis d ikke var funksjon
    }
}*/

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

await logInToServer(credentials);
console.log(await getCurrentQuestion());
//console.log(await sendAnswer(4));
//console.log(await sendAnswer("pi"));

