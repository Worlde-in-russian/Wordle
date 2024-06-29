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

document.getElementById('create-link').addEventListener('click', (event) => {
    event.preventDefault();
    word = getWordForToday(); // Слово меняется каждый день, здесь не нужно ничего менять
    window.location.reload(); // Перезагрузка страницы, чтобы начать новую игру
});

document.getElementById('game-board').style.display = 'flex';
document.getElementById('guess-input').style.display = 'block';
document.getElementById('submit-btn').style.display = 'block';
document.getElementById('guess-input').setAttribute('maxlength', word.length);
createGameBoard(word.length);

function createGameBoard(wordLength) {
    const board = document.getElementById('game-board');
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
