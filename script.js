function hashWord(word) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
        const char = word.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash.toString(16);
}

let word = '';
let currentRow = 0;
const maxAttempts = 6;

document.getElementById('start-game-btn').addEventListener('click', () => {
    const hiddenWord = document.getElementById('hidden-word').value.toLowerCase();
    const wordLength = parseInt(document.getElementById('word-length').value, 10);

    if (hiddenWord.length !== wordLength || wordLength < 4 || wordLength > 10) {
        document.getElementById('message').textContent = "Введите корректное слово и длину.";
        return;
    }

    const hashedWord = hashWord(hiddenWord);
    const gameLink = `${window.location.origin}${window.location.pathname}?word=${hashedWord}&length=${wordLength}`;
    document.getElementById('game-link').textContent = gameLink;
    document.getElementById('game-link').href = gameLink;
    document.getElementById('link-container').style.display = 'block';
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('word') && urlParams.has('length')) {
    const hashedWord = urlParams.get('word');
    const wordLength = parseInt(urlParams.get('length'), 10);
    // Здесь нужно сопоставить хэш с настоящим словом
    word = "загаданное слово".substring(0, wordLength); // Замените соответствующим образом
    document.getElementById('start-game-btn').style.display = 'none';
    document.getElementById('hidden-word').style.display = 'none';
    document.getElementById('word-length').style.display = 'none';
    document.getElementById('game-board').style.display = 'flex';
    document.getElementById('guess-input').style.display = 'block';
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('guess-input').setAttribute('maxlength', word.length);
    createGameBoard(word.length);
}

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
