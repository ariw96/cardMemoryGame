const newGame = document.querySelector(".newGame");
const difficultsArray = [...document.querySelectorAll(".difficult")];
let cards = document.querySelectorAll(".memory-card");
const board = document.querySelector(".memory-game");
const startscreen = document.querySelector(".start-screen");
const endscreen = document.querySelector(".end-screen");

let selected = "";
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let correct = 0;
let wrong = 0;
let score = 0;
const highScore = window.localStorage.getItem("highScore") || 0;

const countDownEl = document.querySelectorAll(".countDown");
let timerID;

let time = 0;
updatetext();
function updateCountDown() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  countDownEl.forEach((element) => {
    element.innerText = `Timer: ${minutes}` + `:${seconds}`;
  });
  time++;
}
// Difficulty button event listener, On Activation it sets the grid size
difficultsArray.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    selected =
      event.target.classList[1] === "easy"
        ? 6
        : event.target.classList[1] === "medium"
        ? 9
        : 12;
    generateBoard();
    time = 0;
    clearInterval(timerID);
    timerID = setInterval(updateCountDown, 1000);
    startscreen.style.opacity = "0";
    setTimeout(() => {
      startscreen.style.display = "none";
    }, 600);
    board.className = `memory-game ${event.target.classList[1]}`;
  });
});

// Board Generation,this takes grid size and generates a board
function generateBoard() {
  document.querySelector(".memory-game").innerText = "";
  for (let i = 1; i <= selected; i++) {
    for (let j = 0; j < 2; j++) {
      const card = document.createElement("div");
      card.classList.add("memory-card");
      const frontFace = document.createElement("div");
      frontFace.className = `front-face image${i}`;
      const backFace = document.createElement("div");
      backFace.className = `back-face`;
      card.append(frontFace, backFace);
      card.addEventListener("click", flipCard);
      board.append(card);
    }
  }
  cards = document.querySelectorAll(".memory-card");
  shuffle();
}
// this flips the card
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}
// this function updates all text in the website
function updatetext() {
  const correctText = document.querySelectorAll(".correct");
  const wrongText = document.querySelectorAll(".wrong");
  const scoreText = document.querySelectorAll(".score");
  const highScoreText = document.querySelectorAll(".high-score");
  correctText.forEach((element) => {
    element.innerText = `Correct Guesses: ${correct}`;
  });
  wrongText.forEach((element) => {
    element.innerText = `Wrong Guesses: ${wrong}`;
  });
  scoreText.forEach((element) => {
    element.innerText = `Score: ${score}`;
  });
  highScoreText.forEach((element) => {
    element.innerText = `High Score: ${highScore}`;
  });
}
// this function sets the localStorage high score
function setHighScore() {
  if (score > highScore) {
    window.localStorage.setItem("highScore", score);
    highScore = score;
  }
}
// this function checks for a match between the 2 selected cards if true adds to correct guesses if not adds to wrong guesses
function checkForMatch() {
  let isMatch =
    firstCard.children[0].classList[1] === secondCard.children[0].classList[1];

  isMatch ? onCorrect() : onWrong();
  updatetext();
}
//this function runs when a match happens
function onCorrect() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  correct++;
  score += 100;
  resetSelection();
  if (correct === selected) {
    setHighScore();
    clearInterval(timerID);
    endscreen.style.display = "flex";
  }
}
// this function runs in case there isn't a match
function onWrong() {
  lockBoard = true;
  wrong++;
  score -= 10;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetSelection();
  }, 1500);
}
// this function resets the selection of the 2 cards
function resetSelection() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}
// countDown function
// this function shuffles the board
function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}
