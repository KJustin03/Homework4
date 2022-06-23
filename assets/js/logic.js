// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsElement = document.getElementById("questions");
var timerElement = document.getElementById("time");
var answerElement = document.getElementById("choices");
var submitButton = document.getElementById("submit");
var startButton = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackElement = document.getElementById("feedback");

//function that starts the game and shows timer
function startGame() {

  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");


  questionsElement.removeAttribute("class");


  timerId = setInterval(clockTick, 1000);

  timerElement.textContent = time;

  viewQuestion();
}
//function that generates quiestions
function viewQuestion() {

  var currentQuestion = questions[currentQuestionIndex];


  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;


  answerElement.innerHTML = "";


  currentQuestion.choices.forEach(function(choice, i) {
   
    var answerNode = document.createElement("button");
    answerNode.setAttribute("class", "choice");
    answerNode.setAttribute("value", choice);

    answerNode.textContent = i + 1 + ". " + choice;


    answerNode.onclick = questionClick;


    answerElement.appendChild(answerNode);
  });
};

function questionClick() {
  // check if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;

    if (time < 0) {
      time = 0;
    };

    // display new time on page
    timerElement.textContent = time;


    feedbackElement.textContent = "You are wrong!";
  } else { 
   
    feedbackElement.textContent = "You are Correct!";
  };


  feedbackElement.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackElement.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    viewQuestion();
  };
};

//function that stops the timer and ends the game
function quizEnd() {

  clearInterval(timerId);


  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");


  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;


  questionsElement.setAttribute("class", "hide");
};

//function that updates the time
function clockTick() {

  time--;
  timerElement.textContent = time;

  if (time <= 0) {
    quizEnd();
  };
};

function saveHighscore() {
  // get value of input box
  var initials = initialsEl.value.trim();

  // make sure value wasn't empty
  if (initials !== "") {
    // get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    // save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // redirect to next page
    window.location.href = "highscores.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitButton.onclick = saveHighscore;

// user clicks button to start quiz
startButton.onclick = startGame;

initialsEl.onkeyup = checkForEnter;
