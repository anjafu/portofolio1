const baseURL = "https://alchemy-kd0l.onrender.com";
const regURL = `${baseURL}/start`;
const statusURL = `${baseURL}/status`;
const answerURL = `${baseURL}/submit`;


//kan ta dette ut i en annen fil for bedre karakter
const credentials = {
        "email": "anjafu@uia.no", 
        "nick": "anjafu", 
        "pin": "1234"
    };

//POST
/*- Returns: { "token": "your_token_here", "statusUrl": "/status" }*/

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

//await pga tar tid å hente ting over internett
//gjør noe aktivt
let respons = await fetch(regURL, {
    method: "POST",
    headers: requestHeaders,
    body:JSON.stringify(credentials)
});

//alt i 200 betyr alt gikk fint så kan ta mindre enn 300
//sjekker om noe skjedde i respons, strukturerer info
if(respons.status < 300){

    respons = await respons.json();
    token = respons.token;
    requestHeaders.Authorization = token;
}
console.log(respons);

respons = await fetch(statusURL, {
    method: "GET",
    headers: requestHeaders,
});


if(respons.status === 200){
    respons = await respons.json();
}
console.log(respons);


//skal ikke kjøre samme svar om igjen, hvordan fikse det? kan ikke kommentere ut
/*
//oppgave 1
const answer = {"answer": 4};

respons = await fetch(answerURL, {
    method: "POST",
    headers: requestHeaders,
    body:JSON.stringify(answer)
});

if(respons.status === 200){
    respons = await respons.json();
}
console.log(respons);


//oppgave 2
const answer = {"answer": "pi"};

respons = await fetch(answerURL, {
    method: "POST",
    headers: requestHeaders,
    body:JSON.stringify(answer)
});

if(respons.status === 200){
    respons = await respons.json();
}
console.log(respons);

*/

