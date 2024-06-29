const words = [
    'слово', 'пример', 'загадка', 'игра', 'кодекс', 'мышка', 'столик', 'огонь', 'чайник', 'школа'
    // Добавьте больше слов сюда
];

function getWordForToday() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return words[dayOfYear % words.length];
}

let word = getWordForToday();
let currentRow = 0;
const maxAttempts = 6;

document.getElementById('create-link-btn').addEventListener('click', () => {
    const newWord = document.getElementById('create-word-input').value.toLowerCase();
    if (newWord && /^[а-яё]+$/i.test(newWord)) {
        const link = `${window.location.origin}${window.location.pathname}?word=${encodeURIComponent(newWord)}`;
        document.getElementById('create-link').href = link;
        document.getElementById('create-link').style.display = 'inline';
    } else {
        alert('Введите корректное слово на русском языке.');
    }
});

const urlParams = new URLSearchParams(window.location.search);
const urlWord = urlParams.get('word');

if (urlWord) {
    word = urlWord;
}

document.getElementById('game-board').style.display = 'flex';
document.getElementById('guess-input').style.display = 'block';
document.getElementById('submit-btn').style.display = 'block';
document.getElementById('guess-input').setAttribute('maxlength', word.length);
createGameBoard(word.length);

function createGameBoard(wordLength) {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    for (let i = 0; i < maxAttempts; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < wordLength; j++) {
            const cell = document.createElement('div');
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

document.getElementById('guess-input').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^а-яё]/gi, '');
});

document.getElementById('submit-btn').addEventListener('click', () => {
    const guess = document.getElementById('guess-input').value.toLowerCase();
    if (guess.length !== word.length) {
        document.getElementById('message').textContent = `Введите слово из ${word.length} букв.`;
        return;
    }
    document.getElementById('message').textContent = "";
    for (let i = 0; i < guess.length; i++) {
        const cell = document.getElementById('game-board').children[currentRow].children[i];
        cell.textContent = guess[i];
        if (guess[i] === word[i]) {
            cell.style.backgroundColor = 'green';
        } else if (word.includes(guess[i])) {
            cell.style.backgroundColor = 'yellow';
        } else {
            cell.style.backgroundColor = '#3a3a3c';
        }
    }
    currentRow++;
    if (guess === word) {
        document.getElementById('message').textContent = "Вы угадали!";
        resetGame();
    } else if (currentRow === maxAttempts) {
        document.getElementById('message').textContent = `Вы проиграли! Слово: ${word}`;
        resetGame();
    }
    document.getElementById('guess-input').value = '';
});

function resetGame() {
    document.getElementById('guess-input').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
}

document.addEventListener('keypress', (e) => {
    if (document.getElementById('guess-input').style.display !== 'none') {
        if (/[^а-яё]/i.test(e.key)) {
            e.preventDefault();
        }
    }
});

function setMidnightTimer() {
    const now = new Date();
    const millisTill8 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0) - now;
    if (millisTill8 < 0) {
        millisTill8 += 86400000; // 24 hours in milliseconds
    }
    setTimeout(() => {
        word = getWordForToday();
        window.location.reload();
    }, millisTill8);
}

setMidnightTimer();
