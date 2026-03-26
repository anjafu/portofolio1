//sending this to show incase my final code doesnt work as i did it AFTER getting last challenge (so stuck at complete)
//my logic instead of using cache
let answerObjects = {
    1: answer1,
    2: answer2,
    3: answer3,
    4: answer4
}

//testing how async function is inside object
async function answer1(string){
    let note = await (await fetch(string)).text();
    return "answer1 yay";
}

//test what happens when you send input to a function without input
async function answer2(){
    return "answer2 yay";
}

async function answer3(){
    return "answer3 yay";
}

async function answer4(){
    return "answer4 yay";
}

let challengeData = {
    id: 1
}

while (challengeData.message == undefined) {
    let currentAnswer = await answerObjects[challengeData.id]("https://alchemy-kd0l.onrender.com/notes.md");
    console.log(currentAnswer);
    challengeData.id += 1;

    if (challengeData.id >= 5){
    challengeData.id = undefined;
    challengeData.message = "DONE";
    }
}