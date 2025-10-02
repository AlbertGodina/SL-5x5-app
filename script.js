// ==========================================================
// 1. LÒGICA DEL TEMPORITZADOR
// ==========================================================
const START_TIME_SECONDS = 90; // 1 minut i 30 segons

let timeRemaining = START_TIME_SECONDS;
let timerInterval = null;
let isRunning = false;

// Referències del DOM
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
        timerDisplay.textContent = "FET!"; 
        startButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
        // Aquí podríem afegir un so
    }
}

function startTimer() {
    if (isRunning) return;
    
    if (timeRemaining <= 0) {
        timeRemaining = START_TIME_SECONDS;
    }
    
    isRunning = true;
    startButton.style.display = 'none';
    resetButton.style.display = 'none';
    timerDisplay.textContent = formatTime(timeRemaining);
    timerInterval = setInterval(updateTimer, 1000);
}

function resetTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    isRunning = false;
    timeRemaining = START_TIME_SECONDS;
    timerDisplay.textContent = formatTime(timeRemaining);

    startButton.textContent = 'Començar Descans (90s)';
    startButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
}

// Inicialització del temporitzador manual
resetTimer();
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);


// ==========================================================
// 2. LÒGICA DE RUTINES I EXERCICIS
// ==========================================================
const ROUTINES = {
    A: ['SQUAT (5x5)', 'BENCH PRESS (5x5)', 'DEADLIFT (1x5)'],
    B: ['SQUAT (5x5)', 'MILITARY PRESS (5x5)', 'DEADLIFT (1x5)']
};

// Referències del DOM
const routineAButton = document.getElementById('routine-a-button');
const routineBButton = document.getElementById('routine-b-button');
const exercisesContainer = document.getElementById('exercises-container');

/**
 * Genera el codi HTML per a un exercici amb les seves sèries i la casella extra.
 */
function createExerciseHTML(exerciseName) {
    let html = `
        <div class="exercise-group" data-exercise="${exerciseName}">
            <h3>${exerciseName}</h3>
    `;
    
    // Deadlift és 1x5, la resta 5x5
    const numSeries = exerciseName.includes('DEADLIFT') ? 1 : 5; 

    for (let i = 1; i <= numSeries; i++) {
        html += `<div class="series-item-dynamic" data-series="${i}">S${i}</div>`;
    }
    
    // Casella EXTRA
    html += `<div class="series-item-dynamic extra-box" data-series="extra">EXTRA</div>`;

    html += `</div>`;
    return html;
}

/**
 * Carrega la rutina seleccionada (A o B) i assigna els esdeveniments.
 */
function loadRoutine(routineKey) {
    // 1. Netejar el contenidor
    exercisesContainer.innerHTML = '';
    
    // 2. Marcar el botó actiu i desactivar l'altre
    routineAButton.classList.remove('active');
    routineBButton.classList.remove('active');
    
    if (routineKey === 'A') {
        routineAButton.classList.add('active');
    } else {
        routineBButton.classList.add('active');
    }

    // 3. Generar el HTML dels exercicis
    ROUTINES[routineKey].forEach(exercise => {
        exercisesContainer.innerHTML += createExerciseHTML(exercise);
    });

    // 4. Assignar els escoltadors d'esdeveniments als NOUS elements
    document.querySelectorAll('.series-item-dynamic').forEach(item => {
        item.addEventListener('click', markSeriesCompletedDynamic);
    });
}

/**
 * Funció per marcar la sèrie i iniciar el temporitzador.
 */
function markSeriesCompletedDynamic(event) {
    const seriesElement = event.target;
    
    if (seriesElement.classList.contains('completed')) {
        return; 
    }
    
    seriesElement.classList.add('completed');
    seriesElement.textContent = '✔️'; 
    
    // INTEGRACIÓ TEMPORITZADOR (s'activa si no és la casella EXTRA)
    if (!seriesElement.classList.contains('extra-box')) {
        resetTimer(); 
        startTimer();
    }
}

// ==========================================================
// 3. INICIALITZACIÓ
// ==========================================================

// Enllaçar els botons de Rutina A i B amb la funció loadRoutine
routineAButton.addEventListener('click', () => loadRoutine('A'));
routineBButton.addEventListener('click', () => loadRoutine('B'));
