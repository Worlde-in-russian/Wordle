// Функция для кодирования слова в base64
function encodeWord(word) {
    const randomString = Math.random().toString(36).substring(2, 15);
    return btoa(unescape(encodeURIComponent(`${randomString}:${word}`)));
}

// Функция для декодирования слова из base64
function decodeWord(encoded) {
    try {
        const decoded = decodeURIComponent(escape(atob(encoded)));
        return decoded.split(':')[1];
    } catch (e) {
        console.error("Decoding error:", e);
        return null;
    }
}

// Проверка наличия слова в словаре
function checkWordInDictionary(word) {
    const dictionaries = ['russian.txt', 'russian_surnames.txt', 'words.txt'];
    return Promise.all(dictionaries.map(dict => fetch(dict).then(response => response.text())))
        .then(data => {
            const wordsSet = new Set(data.join('\n').split('\n').map(w => w.trim().toLowerCase()));
            return wordsSet.has(word);
        });
}

let word = decodeWord(new URLSearchParams(window.location.search).get('word_id')) || '';
let currentRow = 0;
const maxAttempts = 6;
const keyboardState = {};

// Модальное окно
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

document.getElementById('create-link-btn').addEventListener('click', async () => {
    const newWord = document.getElementById('create-word-input').value.toLowerCase();
    if (newWord && /^[а-яё]+$/i.test(newWord)) {
        const wordExists = await checkWordInDictionary(newWord);
        const encodedWord = encodeWord(newWord);
        const link = `${window.location.origin}${window.location.pathname}?word_id=${encodedWord}`;
        const linkElement = document.getElementById('generated-link');
        linkElement.textContent = link;
        linkElement.style.display = 'block';

        // Копирование ссылки в буфер обмена
        navigator.clipboard.writeText(link).then(() => {
            alert('Ссылка скопирована в буфер обмена.');
        }).catch((err) => {
            console.error('Ошибка при копировании ссылки в буфер обмена:', err);
        });

        if (!wordExists) {
            alert('Это слово не в списке допустимых слов, но оно будет использовано для игры.');
        }
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
    document.getElementById('guess-input').setAttribute('maxlength', word.length);
    createGameBoard(word.length);
    createKeyboard();
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

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const keys = [
        'ЙЦУКЕНГШЩЗХЪ',
        'ФЫВАПРОЛДЖЭ',
        'ЯЧСМИТЬБЮ'
    ];

    keys.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';
        row.split('').forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key';
            keyElement.textContent = key;
            keyElement.onclick = () => handleKeyPress(key);
            keyboardState[key.toLowerCase()] = keyElement;
            rowElement.appendChild(keyElement);
        });
        keyboard.appendChild(rowElement);
    });

    const rowElement = document.createElement('div');
    rowElement.className = 'keyboard-row';

    const enterKey = document.createElement('div');
    enterKey.className = 'key large';
    enterKey.textContent = 'ENTER';
    enterKey.onclick = handleSubmit;
    rowElement.appendChild(enterKey);

    const backspaceKey = document.createElement('div');
    backspaceKey.className = 'key large';
    backspaceKey.textContent = '←';
    backspaceKey.onclick = handleBackspace;
    rowElement.appendChild(backspaceKey);

    keyboard.appendChild(rowElement);
}

function handleKeyPress(key) {
    const guessInput = document.getElementById('guess-input');
    if (guessInput.value.length < word.length) {
        guessInput.value += key.toLowerCase();
        updateBoard();
    }
}

function handleBackspace() {
    const guessInput = document.getElementById('guess-input');
    guessInput.value = guessInput.value.slice(0, -1);
    updateBoard();
}

function handleSubmit() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value.toLowerCase();
    if (guess.length !== word.length) {
        document.getElementById('message').textContent = `Введите слово из ${word.length} букв.`;
        return;
    }
    document.getElementById('message').textContent = "";
    for (let i = 0; i < guess.length; i++) {
        const cell = document.getElementById('game-board').children[currentRow].children[i];
        const keyElement = keyboardState[guess[i]];
        cell.textContent = guess[i].toUpperCase();
        if (guess[i] === word[i]) {
            cell.style.backgroundColor = 'green';
            keyElement.style.backgroundColor = 'green';
            keyElement.style.borderColor = 'green';
        } else if (word.includes(guess[i])) {
            cell.style.backgroundColor = 'yellow';
            keyElement.style.backgroundColor = 'yellow';
            keyElement.style.borderColor = 'yellow';
        } else {
            cell.style.backgroundColor = '#3a3a3c';
            keyElement.style.backgroundColor = '#3a3a3c';
            keyElement.style.borderColor = 'gray';
        }
        animateCell(cell);
    }
    currentRow++;
    if (guess === word) {
        document.getElementById('message').textContent = "Вы Угадали!";
        resetGame();
    } else if (currentRow === maxAttempts) {
        document.getElementById('message').textContent = `Вы Проиграли! СЛОВО: ${word.toUpperCase()}`;
        resetGame();
    }
    guessInput.value = '';
}

function updateBoard() {
    const guessInput = document.getElementById('guess-input');
    const guess = guessInput.value;
    for (let i = 0; i < word.length; i++) {
        const cell = document.getElementById('game-board').children[currentRow].children[i];
        cell.textContent = guess[i] ? guess[i].toUpperCase() : '';
    }
}

function animateCell(cell) {
    cell.classList.add('active');
    setTimeout(() => {
        cell.classList.remove('active');
    }, 200);
}

function resetGame() {
    document.getElementById('keyboard').style.display = 'none';
}

// Initialize guess input
const guessInput = document.getElementById('guess-input');
guessInput.style.display = 'none';
