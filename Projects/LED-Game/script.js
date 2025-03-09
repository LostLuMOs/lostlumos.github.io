/*
====================================================================================================
|| Initialisierung                                                                                ||
====================================================================================================
*/
const container = document.getElementById('container');
const highscoreDisplay = document.getElementById('highscore');
const gameOverDisplay = document.getElementById('game-over');
const restartDisplay = document.getElementById('restart');
const highscoreForm = document.getElementById('highscore-form');
const playerNameInput = document.getElementById('player-name');
const highscoreList = document.getElementById('highscore-list');
let highscores = []; // Highscore-Liste
let highscore = 0;
let tempHighscore = 0; // Temporärer Highscore für Game Over
let gameTimer;
let clickedSafeDiode = true;
let isGameOver = false;

// Erstelle die Matrix mit 3x3 Dioden
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    const diode = document.createElement('div');
    diode.classList.add('diode');
    diode.addEventListener('click', () => handleDiodeClick(diode));
    container.appendChild(diode);
  }
}

// Anfangsdiode
if (!isGameOver) {
  // Am Anfang eine zufällige Diode aktivieren
  activateInitialDiode();
}



/*
====================================================================================================
|| LED-Game                                                                                       ||
====================================================================================================
*/
// Funktion, um Klicks zu händeln
function handleDiodeClick(diode) {
  if (diode.classList.contains('active')) {
    clickedSafeDiode = true;
    toggleDiode(diode);
  } else {
    gameOver();
  }
}

// Funktion, um die Diode ein- oder auszuschalten
function toggleDiode(diode) {
  clearTimeout(gameTimer);
  diode.classList.remove('active');
  updateHighscore();
  activateRandomDiode();
}

// Funktion, um eine zufällige, sichere Diode zu aktivieren
function activateInitialDiode() {
  gameTimer = setTimeout(() => {
    const diodes = document.querySelectorAll('.diode');
    
    // Alle vorhandenen Dioden deaktivieren
    diodes.forEach(diode => diode.classList.remove('active')); 
    diodes.forEach(diode => diode.classList.remove('dangerous'));

    // Zufällige, normale Diode aktivieren
    const randomIndex = Math.floor(Math.random() * diodes.length);
    const randomDiode = diodes[randomIndex];
    randomDiode.classList.add('active');

    if (!clickedSafeDiode) {
      randomDiode.classList.remove('active');
      gameOver();
    }
    else {
      activateInitialDiode();
    }
  }, 1000);
}

// Funktion, um eine zufällige Diode zu aktivieren
function activateRandomDiode() {
  if (isGameOver) {
    return
  }
  else {
    gameTimer = setTimeout(() => {
      // Aktiviert mit einer Wahrscheinlichkeit von 20% eine gefährliche Diode, wenn der Score mindestens 1 ist
      if (highscore > 0 && Math.random() < 0.2) {
        activateDangerousDiode(); 
      } 
      // Aktiviert eine sichere Diode
      else {
        activateSafeDiode();
      }
    }, 1000);
  }
}

// Funktion, um eine zufällige, sichere Diode zu aktivieren
function activateSafeDiode() {
  if (!isGameOver) {
    const diodes = document.querySelectorAll('.diode');
    
    // Alle aktiven Dioden deaktivieren
    diodes.forEach(diode => diode.classList.remove('active')); 
    diodes.forEach(diode => diode.classList.remove('dangerous'));

    // Zufällige, normale Diode aktivieren
    const randomIndex = Math.floor(Math.random() * diodes.length);
    const randomDiode = diodes[randomIndex];
    randomDiode.classList.add('active');

    gameTimer = setTimeout(() => {
      if (!clickedSafeDiode) {
        randomDiode.classList.remove('active');
        gameOver();
      }
    }, 1000)

    clickedSafeDiode = false;
  }
}

function activateDangerousDiode() {
  if (!isGameOver) {
    const diodes = document.querySelectorAll('.diode');

    // Alle aktiven Dioden deaktivieren
    diodes.forEach(diode => diode.classList.remove('active'));
    diodes.forEach(diode => diode.classList.remove('dangerous'));

    // Zufällige, gefährliche Diode aktivieren
    const randomIndex = Math.floor(Math.random() * diodes.length);
    const randomDiode = diodes[randomIndex];
    randomDiode.classList.add('dangerous');

    // Gefährliche Diode nach 1 Sekunde deaktivieren
    setTimeout(() => {
      randomDiode.classList.remove('dangerous');
    }, 1000);

    // Aktiviert eine neue, zufällige Diode
    activateRandomDiode();
  }
}

// Funktion, um das Spiel zu beenden (Game Over)
function gameOver() {
  clickedSafeDiode = false;
  isGameOver = true;
  gameOverDisplay.style.display = 'flex';
  restartDisplay.style.display = 'flex';
  highscoreForm.style.display = 'flex'; // Formular anzeigen
  const diodes = document.querySelectorAll('.diode');;
  diodes.forEach(diode => diode.classList.remove('active'));
  diodes.forEach(diode => diode.classList.remove('dangerous'));
}

// Funktion, um das Spiel zurückzusetzen
function resetGame() {
  highscore = 0;
  highscoreDisplay.textContent = highscore;
  clickCount = 0;
  tempHighscore = 0;
  gameOverDisplay.style.display = 'none';
  restartDisplay.style.display = 'none';
  highscoreForm.style.display = 'none';
  playerNameInput.value = "";
  activateRandomDiode();
  isGameOver = false;
}



/*
====================================================================================================
|| Highscore                                                                                      ||
====================================================================================================
*/
// Event: Highscore speichern, wenn der Spieler seinen Namen eingibt
highscoreForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const playerName = playerNameInput.value.trim();
  if (playerName) {
    // Highscore in die Tabelle einfügen
    highscores.push({ name: playerName, score: tempHighscore });
    renderHighscores();

    // Spiel zurücksetzen
    // resetGame();
  }
});

// Funktion, um den Highscore zu aktualisieren
function updateHighscore() {
  highscore++;
  highscoreDisplay.textContent = highscore;
}

// Funktion, um die Highscore-Tabelle zu rendern
function renderHighscores() {
  highscoreList.innerHTML = ""; // Tabelle leeren
  highscores
    .sort((a, b) => b.score - a.score) // Nach Score sortieren
    .forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${entry.name}</td><td>${entry.score}</td>`;
      highscoreList.appendChild(row);
    });
}