// --- Configuració de Rutines ---
const ROUTINES = {
    A: ['SQUAT (5x5)', 'BENCH PRESS (5x5)', 'DEADLIFT (1x5)'],
    B: ['SQUAT (5x5)', 'MILITARY PRESS (5x5)', 'DEADLIFT (1x5)']
};

// --- Referències als nous elements del DOM ---
const routineAButton = document.getElementById('routine-a-button');
const routineBButton = document.getElementById('routine-b-button');
const exercisesContainer = document.getElementById('exercises-container');

// Funció per generar les 5+1 caselles
function createExerciseHTML(exerciseName) {
    let html = `
        <div class="exercise-group" data-exercise="${exerciseName}">
            <h3>${exerciseName}</h3>
    `;
    
    // El 5x5 (o 1x5 per al Deadlift)
    const numSeries = exerciseName.includes('DEADLIFT') ? 1 : 5; 

    for (let i = 1; i <= numSeries; i++) {
        html += `<div class="series-item-dynamic" data-series="${i}">S${i}</div>`;
    }
    
    // Afegim la casella EXTRA demanada
    html += `<div class="series-item-dynamic extra-box" data-series="extra">EXTRA</div>`;

    html += `</div>`;
    return html;
}

// Funció per carregar la rutina seleccionada
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

    // 4. Assignar els escoltadors d'esdeveniments als nous elements
    document.querySelectorAll('.series-item-dynamic').forEach(item => {
        item.addEventListener('click', markSeriesCompletedDynamic);
    });
}

// Funció per marcar la sèrie (similar a l'anterior)
function markSeriesCompletedDynamic(event) {
    const seriesElement = event.target;
    
    // Si ja està feta, no fem res
    if (seriesElement.classList.contains('completed')) {
        return; 
    }
    
    seriesElement.classList.add('completed');
    seriesElement.textContent = '✔️'; 
    
    // **INTEGRACIÓ CLAU**: Iniciem el temporitzador només si no és la casella EXTRA
    if (!seriesElement.classList.contains('extra-box')) {
        resetTimer(); 
        startTimer();
    }
}

// --- Assignar esdeveniments per canviar de rutina ---
routineAButton.addEventListener('click', () => loadRoutine('A'));
routineBButton.addEventListener('click', () => loadRoutine('B'));

// Opcional: Carregar la rutina A per defecte en carregar la pàgina
// loadRoutine('A');
