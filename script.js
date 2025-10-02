// --- Lògica del Temporitzador ---
const START_TIME_SECONDS = 90; // 1 minut i 30 segons

let timeRemaining = START_TIME_SECONDS;
let timerInterval = null;
let isRunning = false;

const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateTimer() {
    timeRemaining--;
    timerDisplay.textContent = formatTime(timeRemaining);

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        timerDisplay.textContent = "FET!"; // Missatge de finalització
        startButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
    }
}

// **FUNCIÓ CLAU (GLOBAL)**
function startTimer() {
    if (isRunning) return;
    
    // Assegura't que comença des de 90s si s'ha premut el botó manualment
    if (timeRemaining <= 0) {
        timeRemaining = START_TIME_SECONDS;
    }
    
    isRunning = true;
    startButton.style.display = 'none';
    resetButton.style.display = 'none';
    timerDisplay.textContent = formatTime(timeRemaining);
    timerInterval = setInterval(updateTimer, 1000);
}

// **FUNCIÓ CLAU (GLOBAL)**
function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    isRunning = false;
    timeRemaining = START_TIME_SECONDS;
    timerDisplay.textContent = formatTime(timeRemaining);

    // Torna a mostrar el botó de començar
    startButton.textContent = 'Començar Descans (90s)';
    startButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
}

// Inicialitzar i assignar esdeveniments del temporitzador manual
resetTimer();
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

// --- Configuració de Rutines ---
const ROUTINES = {
    A: ['SQUAT (5x5)', 'BENCH PRESS (5x5)', 'DEADLIFT (1x5)'],
    B: ['SQUAT (5x5)', 'MILITARY PRESS (5x5)', 'DEADLIFT (1x5)']
};

const routineAButton = document.getElementById('routine-a-button');
const routineBButton = document.getElementById('routine-b-button');
const exercisesContainer = document.getElementById('exercises-container');

// (Deixar aquí les funcions createExerciseHTML i loadRoutine, sense canvis)
// ...

// Funció clau per marcar la sèrie
function markSeriesCompletedDynamic(event) {
    const seriesElement = event.target;
    
    // Si ja està feta, no fem res
    if (seriesElement.classList.contains('completed')) {
        return; 
    }
    
    seriesElement.classList.add('completed');
    seriesElement.textContent = '✔️'; 
    
    // **INTEGRACIÓ CLAU: Temporitzador**
    if (!seriesElement.classList.contains('extra-box')) {
        // 1. Reiniciar el temporitzador al valor inicial de 90s
        resetTimer(); 
        // 2. Iniciar el compte enrere
        startTimer();
    }
}

// (Deixar aquí la resta de lògica de càrrega i assignació d'esdeveniments)
// ...
