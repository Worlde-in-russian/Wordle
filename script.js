const words = ["яблоко", "груша", "слива", "вишня", "персик"];
const word = words[Math.floor(Math.random() * words.length)];
let currentRow = 0;

document.getElementById('submit-btn').addEventListener('click', () => {
    const guess = document.getElementById('guess-input').value.toLowerCase();
    if (guess.length !== 5) {
        document.getElementById('message').textContent = "Введите слово из 5 букв.";
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
        }
        row.appendChild(cell);
    }
    document.getElementById('game-board').appendChild(row);
    currentRow++;
    if (guess === word) {
        document.getElementById('message').textContent = "Вы угадали!";
    } else if (currentRow === 6) {
        document.getElementById('message').textContent = `Вы проиграли! Слово: ${word}`;
    }
    document.getElementById('guess-input').value = '';
});
