/*
 * Create a list that holds all of your cards
 */
const deck = document.querySelector('.deck');
let moves = 0;
let toggleCards = [];
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8;

function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}
shuffleDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener('click', function(event) {
    const clickTarget = event.target;
    if (clickValidation(clickTarget)) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (toggleCards.length === 2) {
            checkForMatch(clickTarget);
            addMove();
            checkScore();
        }
    }
})

function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function addToggleCard(clickTarget) {
    toggleCards.push(clickTarget);
}

function checkForMatch(clickTarget) {
    if (toggleCards[0].firstElementChild.className ===
        toggleCards[1].firstElementChild.className) {
        toggleCards[0].classList.toggle('match');
        toggleCards[1].classList.toggle('match');

        toggleCards = [];
        matched++;
        if (matched === TOTAL_PAIRS) {
            gameOver();

        }
    } else {
        setTimeout(function() {
            toggleCard(toggleCards[0]);
            toggleCard(toggleCards[1]);
            toggleCards = [];
        }, 1000);
    }
}

function clickValidation(clickTarget) {
    return (
        clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        toggleCards.length < 2 &&
        !toggleCards.includes(clickTarget)
    );
}

function addMove() {
    moves++;
    let movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

function checkScore() {
    if (moves === 13 || moves === 17 || moves === 21 || moves === 26 || moves === 33) {
        hideStar();
    }
}

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }

    }
}

function startClock() {
    clockId = setInterval(function() {
        time++;
        displayTime();
    }, 1000);
}

function displayTime() {
    const minutes = Math.floor(time / 60);
    const secounds = time % 60;
    const clock = document.querySelector('.clock');
    if (secounds < 10) {
        clock.innerHTML = `${minutes}:0${secounds}`;
    } else {
        clock.innerHTML = `${minutes}:${secounds}`;
    }
}

function stopClock() {
    clearInterval(clockId);
}

function toggleModal() {
    const modal = document.querySelector('.modal-background');
    modal.classList.toggle('hide');
}

function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

function writeModalStats() {
    const timeStat = document.querySelector('.modal-time');
    const clockTime = document.querySelector('.clock').innerHTML;
    const movesStat = document.querySelector('.modal-moves')
    const starsStat = document.querySelector('.modal-stars')
    const stars = getStars();

    timeStat.innerHTML = `Time : ${clockTime}`;
    movesStat.innerHTML = `Moves : ${moves}`;
    starsStat.innerHTML = `Stars : ${stars}`;
}

document.querySelector('.modal-cancel').addEventListener('click', function() {
    toggleModal();
});
document.querySelector('.modal-replay').addEventListener('click', replayGame);

document.querySelector('.restart').addEventListener('click', resetGame)

function resetGame() {
    matched = 0;
    resetClockAndTime();
    resetMoves();
    resetStars();
    resetCards();
    shuffleDeck();
}

function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

function gameOver() {
    stopClock();
    writeModalStats();
    toggleModal();

}

function replayGame() {
    matched = 0;
    resetGame();
    toggleModal();
    resetCards();
}

function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}
