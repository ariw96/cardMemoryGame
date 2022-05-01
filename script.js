const cards = document.querySelectorAll(".memory-card");
const newGame = document.querySelector(".newGame");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let correct = 0;
let wrong = 0;
let score = 0;
const highScore = window.localStorage.getItem("highScore") || 0;

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

function setHighScore() {
    if (score > highScore) window.localStorage.setItem("highScore", score);
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();
    updatetext();
}

function disableCards() {
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

function unflipCards() {
    lockBoard = true;
    wrong++;
    score -= 10;
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");

        resetSelection();
    }, 1500);
}

function resetSelection() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach((card) => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));

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