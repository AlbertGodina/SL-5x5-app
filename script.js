// ==========================================================
// 1. LÒGICA DEL TEMPORITZADOR (CONFIRMAT OK)
// ==========================================================
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
        // Aquí podríem afegir un so d'alerta
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

// Inicialitzar i assignar esdeveniments del temporitzador manual
resetTimer();
startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);


// ==========================================================
// 2. LÒGICA DE RUTINES I EXERCICIS (NOVA IMPLEMENTACIÓ)
// ==========================================================
const ROUTINES = {
    A: ['SQUAT (5x5)', 'BENCH PRESS (5x5)', 'DEADLIFT (1x5)'],
    B: ['SQUAT (5x5)', 'MILITARY PRESS (5x5)', 'DEADLIFT (1x5)']
};

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
    
    // El Deadlift és 1x5, la resta 5x5
    const numSeries = exerciseName.includes('DEADLIFT') ? 1 : 5; 

    for (let i = 1; i <= numSeries; i++) {
        // Usarem la classe 'series-item-dynamic' que hem definit al CSS
        html += `<div class="series-item-dynamic" data-series="${i}">S${i}</div>`;
    }
    
    // Afegim la casella EXTRA
    html += `<div class="series-item-dynamic extra-box" data-series="extra">EXTRA</div>`;

    html += `</div>`;
    return html;
}

/**
 * Carrega la rutina seleccionada (A o B) al contenidor d'exercicis.
 */
function loadRoutine(routineKey) {
    // 1. Netejar el contenidor
    exercisesContainer.innerHTML = '';
    
    // 2. Marcar el botó actiu i desactivar l'altre (per feedback visual)
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
    // Això és crucial perquè els elements s'acaben de crear.
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
    
    // INTEGRACIÓ TEMPORITZADOR
    if (!seriesElement.classList.contains('extra-box')) {
        resetTimer(); 
        startTimer();
    }
}

// ==========================================================
// 3. ASSIGNACIÓ D'ESDEVENIMENTS (SOLUCIÓ AL PROBLEMA)
// ==========================================================

// Enllaçar els botons de Rutina A i B amb la funció loadRoutine
routineAButton.addEventListener('click', () => loadRoutine('A'));
routineBButton.addEventListener('click', () => loadRoutine('B'));

// Opcional: Si vols que hi hagi una rutina carregada per defecte en obrir l'app
// loadRoutine('A');
