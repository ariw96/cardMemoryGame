const newGame = document.querySelector(".newGame");
const difficultsArray = [...document.querySelectorAll(".difficult")];
let cards = document.querySelectorAll(".memory-card");

let selected = "";
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let correct = 0;
let wrong = 0;
let score = 0;
const highScore = window.localStorage.getItem("highScore") || 0;


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
      document.querySelector(".memory-game").append(card);
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
    const correctText = document.querySelector(".correct");
    const wrongText = document.querySelector(".wrong");
    const scoreText = document.querySelector(".score");
    const highScoreText = document.querySelector(".high-score");
    correctText.innerText = `Correct Guesses:${correct}`;
    wrongText.innerText = `Wrong Guesses:${wrong}`;
    scoreText.innerText = `Score:${score}`;
    highScoreText.innerText = `High Score:${highScore}`;
}
// this function sets the localStorage high score
function setHighScore() {
    if (score > highScore) window.localStorage.setItem("highScore", score);
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
  if (correct === 6) {
    newGame.style.display = "inline-block";
    setHighScore();
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
const startMinutes = 5;
let time = startMinutes * 60
const countDownEl = document.getElementById('countDown');

setInterval(updateCountDown, 1000);

function updateCountDown() {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (minutes === 0 && seconds === 0) {
        alert('time is up')
        location.reload();
    }
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countDown.innerHTML = `${minutes}` + `:${seconds}`;
    time--;
}
// this function shuffles the board
function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
}
