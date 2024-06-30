function encodeWord(word) {
    const randomString = Math.random().toString(36).substring(2, 15);
    return btoa(unescape(encodeURIComponent(`${randomString}:${word}`)));
}

function decodeWord(encoded) {
    try {
        const decoded = decodeURIComponent(escape(atob(encoded)));
        return decoded.split(':')[1];
    } catch (e) {
        console.error("Decoding error:", e);
        return null;
    }
}

let word = decodeWord(new URLSearchParams(window.location.search).get('word_id')) || '';
let currentRow = 0;
const maxAttempts = 6;

// Modal logic
const modal = document.getElementById('create-link-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementsByClassName('close-btn')[0];

openModalBtn.onclick = function() {
    modal.style.display = 'block';
};

closeModalBtn.onclick = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

document.getElementById('create-link-btn').addEventListener('click', () => {
    const newWord = document.getElementById('create-word-input').value.toLowerCase();
    if (newWord && /^[а-яё]+$/i.test(newWord)) {
        const encodedWord = encodeWord(newWord);
        const link = `${window.location.origin}${window.location.pathname}?word_id=${encodedWord}`;
        const linkElement = document.getElementById('generated-link');
        linkElement.textContent = link;
        linkElement.style.display = 'block';
    } else {
        alert('Введите корректное слово на русском языке.');
    }
});

const urlParams = new URLSearchParams(window.location.search);
const urlWordId = urlParams.get('word_id');

if (urlWordId) {
    const decodedWord = decodeWord(urlWordId);
    if (decodedWord && /^[а-яё]+$/i.test(decodedWord)) {
        word = decodedWord;
    } else {
        alert('Неверная ссылка или слово повреждено.');
    }
}

if (word) {
    document.getElementById('game-board').style.display = 'flex';
    document.getElementById('guess-input').style.display = 'block';
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('guess-input').setAttribute('maxlength', word.length);
    createGameBoard(word.length);
}

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
    
