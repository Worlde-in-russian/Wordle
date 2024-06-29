let word = '';
let currentRow = 0;

document.getElementById('start-game-btn').addEventListener('click', () => {
    const hiddenWord = document.getElementById('hidden-word').value.toLowerCase();
    const wordLength = parseInt(document.getElementById('word-length').value, 10);

    if (hiddenWord.length !== wordLength || wordLength < 4 || wordLength > 10) {
        document.getElementById('message').textContent = "Введите корректное слово и длину.";
        return;
    }

    word = hiddenWord;
    document.getElementById('message').textContent = "";
    document.getElementById('game-board').innerHTML = '';
    document.getElementById('guess-input').style.display = 'block';
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('guess-input').setAttribute('maxlength', wordLength);
    currentRow = 0;
});

document.getElementById('submit-btn').addEventListener('click', () => {
    const guess = document.getElementById('guess-input').value.toLowerCase();
    if (guess.length !== word.length) {
        document.getElementById('message').textContent = `Введите слово из ${word.length} букв.`;
        return;
    }
    document.getElementById('message').textContent = "";
    const row = document.createElement('div');
    for (let i = 0; i < guess.length; i++) {
        const cell = document.createElement('div');
        cell.textContent = guess[i];
        if (guess[i] === word[i]) {
            cell.style.backgroundColor = 'green';
        } else if (word.includes(guess[i])) {
            cell.style.backgroundColor = 'yellow';
        } else {
            cell.style.backgroundColor = '#3a3a3c';
        }
        row.appendChild(cell);
    }
    document.getElementById('game-board').appendChild(row);
    currentRow++;
    if (guess === word) {
        document.getElementById('message').textContent = "Вы угадали!";
        resetGame();
    } else if (currentRow === 6) {
        document.getElementById('message').textContent = `Вы проиграли! Слово: ${word}`;
        resetGame();
    }
    document.getElementById('guess-input').value = '';
});

function resetGame() {
    document.getElementById('guess-input').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('hidden-word').value = '';
    document.getElementById('word-length').value = '';
}
