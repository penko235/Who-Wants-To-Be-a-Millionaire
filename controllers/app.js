// Dom Elements
let question = document.querySelector('#question');
let choices = document.querySelectorAll('.choice-text');
let choicesLetter = document.querySelectorAll('.choice-prefix');
let questionCounterText = document.querySelector('#questionCounter');
let lifelineCounterText = document.querySelector('#lifelinesCounter');
let scoreText = document.querySelector('#score');


// DOM Lifelines
const call = document.querySelector('#call');
const callText = document.querySelector('#callText')
const fiftyFifty = document.querySelector('#fiftyFifty');
const fiftyFiftyText = document.querySelector('#fiftyFiftyText');
const audience = document.querySelector('#audience');
const audienceText = document.querySelector('#audienceText');


// Global
let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let lifelineCounter = 0;
let availableQuestions = [];

//Constants
const moneyArray = [`100`, `200`, `300`, `500`, `1,000`, `2,000`, `4,000`, `8,000`, `16,000`, `32,000`, `64,000`, `125,000`, `250,000`, `500,000`, `1 MILLION`];
const maxQuestions = 15;
const maxLifelines = 3;

// let questions = [];

const easyQuestions = "https://opentdb.com/api.php?amount=15&category=9&difficulty=easy&type=multiple";
const mediumQuestions = "https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple";
const hardQuestions = "https://opentdb.com/api.php?amount=5&difficulty=hard&type=multiple";

// let urls = ['https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple', 'https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple', 'https://opentdb.com/api.php?amount=5&difficulty=hard&type=multiple'];

fetch(easyQuestions)
    .then(res => {
        console.log(res);
        return res.json();
    }).then(function(loadedQuestions) {
        console.log(loadedQuestions.results)
        questions = loadedQuestions.results.map(loadedQuestions => {
            const formattedQuestion = {
                question: loadedQuestions.question
            }

            const answerChoices = [...loadedQuestions.incorrect_answers];

            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestions.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion[`choice` + (index + 1)] = choice;
            })

            return formattedQuestion;
        })

        startGame();

    }).catch(err => {
        console.error(err);
    });


startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions)
    getNewQuestion();
};


getNewQuestion = () => {

    $('.choice-text').show();

    questionCounter++;

    // If are not more question or counter is bigger than maxquestions => show end page.
    if (questionCounter > maxQuestions) {
        // Go to the end page
        passedFinalScore();
        return window.location.assign('./end.html');
    }

    questionCounterText.textContent = `${questionCounter}/${maxQuestions}`;
    // Get index of question
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    // console.log(questionIndex)
    // Set the currentQuestion
    currentQuestion = availableQuestions[questionIndex];
    console.log(currentQuestion);

    question.textContent = currentQuestion.question;

    //Get data attribute number for choices option
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.textContent = currentQuestion["choice" + number];
    });
    // Remove question from collection(we dont want to choose existing question)

    availableQuestions.splice(questionIndex, 1);

}

choices.forEach(choice => {
    choice.addEventListener(`click`, (e) => {

        // Get dataset number from choices
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        // Check if the answer is correct or not
        const classCheckAnswer = selectedAnswer == currentQuestion.answer ? `correct` : `incorrect`;

        // Increment Score
        if (classCheckAnswer === `correct`) {
            scoreText.textContent = `$${moneyArray[questionCounter - 1]}`;
            right();

        } else {

            wrong();
            passedFinalScore();
            setTimeout(() => {
                return window.location.assign('./end.html');
            }, 2200)
        }

        // Set class to html element
        selectedChoice.parentElement.classList.add(classCheckAnswer);

        setTimeout(() => {
            // Remove class to html element
            selectedChoice.parentElement.classList.remove(classCheckAnswer);

            // After answer generate new question
            getNewQuestion();
        }, 2500)
    })
})


// Lifelines

// Call a friend
call.addEventListener('click', (e) => {

    if (call) {
        phoneAFriend();
        // call.style.color = 'red';
        let opinion = `The answer is....`;
        let phoneAnswers = [`${opinion}A'`, `${opinion}B`, `${opinion}C`, `${opinion}D`];
        let randomPhoneAnswers = phoneAnswers[Math.floor(Math.random() * phoneAnswers.length)];
        setTimeout(() => {
            swal({
                title: `${randomPhoneAnswers}`,
                text: ``,
                icon: "success",
                timer: 5000,
                buttons: false
            });
        }, 3000)
    }

    call.style.display = 'none';
    callText.style.display = 'none';

    lifelineCounter++;
    lifelineCounterText.textContent = `Lifelines ${lifelineCounter}/${maxLifelines}`;
})

// 50/50
fiftyFifty.addEventListener('click', () => {
    // Get the index of choices options
    let correctAnswerIndex = currentQuestion.answer;
    let choicesCorrectIndex = correctAnswerIndex - 1;


    let correct = choices[choicesCorrectIndex];

    let a = choices[0];
    let b = choices[1];
    let c = choices[2];
    let d = choices[3];

    let arr = [];
    // Choices
    let option = [a, b, c, d];

    // Get the index of the correct answer
    let index = option.indexOf(correct);

    // Put the correct one into half array
    arr.push(choices[index]);

    // In option array the are only 3 wrong answers
    option.splice(index, 1);

    let randomWrong = Math.floor(Math.random() * option.length);

    arr.push(choices[randomWrong]);
    console.log(arr);



    setTimeout(() => {
        option[0].style.display = 'none';
        option[1].style.display = 'none';

    }, 1000)


    fiftyFifty.style.display = 'none';
    fiftyFiftyText.style.display = 'none';

    lifelineCounter++;
    lifelineCounterText.textContent = `Lifelines ${lifelineCounter}/${maxLifelines}`;

})

// Help from audience
audience.addEventListener('click', () => {

    let correctAnswerIndex = currentQuestion.answer;
    let correctAnswer = choicesLetter[correctAnswerIndex - 1];
    // console.log(correctAnswer)

    let a = choicesLetter[0];
    let b = choicesLetter[1];
    let c = choicesLetter[2];
    let d = choicesLetter[3];

    let arrPercentage = [];
    let options = [a, b, c, d];

    let index = options.indexOf(correctAnswer);
    arrPercentage.push(choices[index]);

    options.splice(index, 1);

    let audienceResult = `${correctAnswer.textContent} 70% |  ${options[0].textContent} 15% |  ${options[1].textContent} 10%  |  ${options[2].textContent} 5% `;

    setTimeout(() => {
        swal({
            title: `Throwing question to audience...`,
            text: `${question.textContent}`,
            icon: "info",
            timer: 4000,
            buttons: false
        });
    }, 1000)
    setTimeout(() => {
        swal({
            title: `Audience thinking...`,
            text: ``,
            icon: "info",
            timer: 1500,
            buttons: false
        });
    }, 3000)
    setTimeout(() => {

        swal({
            title: `${audienceResult}`,
            text: ``,
            icon: "success",
            timer: 4000,
            buttons: false
        });
    }, 6000)

    audience.style.display = 'none';
    audienceText.style.display = 'none';

    lifelineCounter++;
    lifelineCounterText.textContent = `Lifelines ${lifelineCounter}/${maxLifelines}`;
})

// Audio

function background() {
    let audio = new Audio();
    audio.src = '../audio/background.mp3';
    audio.play();
    audio.volume = 0.2;
}

function right() {
    let audio = new Audio();
    audio.src = '../audio/win.mp3';
    audio.play();
    audio.volume = 0.4;
}

function wrong() {
    let audio = new Audio();
    audio.src = '../audio/wrong.mp3';
    audio.play();
    audio.volume = 0.4;
}

function phoneAFriend() {
    let audio = new Audio();
    audio.src = '../audio/phone_ring.mp3';
    audio.play();
    audio.volume = 0.4;
}

// Passed final score to ending page
passedFinalScore = () => {
    localStorage.setItem(`score`, scoreText.textContent);
    return
}
