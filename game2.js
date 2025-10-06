document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores del DOM ---
    const glitchesDisplay = document.getElementById('glitches-display');
    const gpsDisplay = document.getElementById('gps-display');
    const mainClickerBtn = document.getElementById('main-clicker-btn');
    const upgradesList = document.getElementById('upgrades-list');
    const dialogueText = document.getElementById('dialogue-text');

    // --- Estado del Juego ---
    let glitches = 0;
    let glitchesPerClick = 1;
    let glitchesPerSecond = 0;

    // --- Diálogo del Personaje ---
    const dialogueLines = [
        "¿Qué...? ¿Dónde están las plataformas?",
        "¿Números? ¿Por qué estoy contando... glitches?",
        "Esto no tiene sentido. Hacer clic... para nada.",
        "Cada mejora... ¿me acerca más a la salida o me hunde más en este absurdo?",
        "Tengo que seguir. A ver qué pasa si llego al final de esto."
    ];
    let currentDialogueIndex = 0;

    // --- Definición de Mejoras ---
    const upgrades = [
        { name: "Puntero Mejorado", description: "+1 Glitch por clic", cost: 10, type: 'click', value: 1, owned: 0 },
        { name: "Script Automatizado", description: "+1 Glitch por segundo", cost: 50, type: 'second', value: 1, owned: 0 },
        { name: "Doble Hilo", description: "+5 Glitches por segundo", cost: 250, type: 'second', value: 5, owned: 0 },
        { name: "CPU Cuántica", description: "Doble de Glitches por clic", cost: 1000, type: 'click_multiplier', value: 2, owned: 0 },
        { name: "Botnet", description: "+50 Glitches por segundo", cost: 5000, type: 'second', value: 50, owned: 0 },
    ];

    // --- Funciones del Juego ---

    // Actualiza toda la UI
    function updateUI() {
        glitchesDisplay.textContent = Math.floor(glitches).toLocaleString();
        gpsDisplay.textContent = glitchesPerSecond.toLocaleString();
        renderUpgrades();
    }

    // Renderiza los botones de mejora
    function renderUpgrades() {
        upgradesList.innerHTML = '';
        upgrades.forEach((upgrade, index) => {
            const btn = document.createElement('button');
            btn.className = 'upgrade-btn';
            btn.disabled = glitches < upgrade.cost;
            
            btn.innerHTML = `
                <div class="upgrade-info">
                    <strong>${upgrade.name}</strong> (Posees: ${upgrade.owned})<br>
                    <small>${upgrade.description}</small>
                </div>
                <div class="upgrade-cost">
                    Coste: ${Math.ceil(upgrade.cost).toLocaleString()}
                </div>
            `;

            btn.addEventListener('click', () => buyUpgrade(index));
            upgradesList.appendChild(btn);
        });
    }
    
    // Lógica para comprar una mejora
    function buyUpgrade(index) {
        const upgrade = upgrades[index];
        if (glitches >= upgrade.cost) {
            glitches -= upgrade.cost;
            upgrade.owned++;
            upgrade.cost *= 1.25; // Aumentar el coste para la siguiente compra

            // Aplicar el efecto de la mejora
            switch (upgrade.type) {
                case 'click':
                    glitchesPerClick += upgrade.value;
                    break;
                case 'second':
                    glitchesPerSecond += upgrade.value;
                    break;
                case 'click_multiplier':
                    glitchesPerClick *= upgrade.value;
                    break;
            }
            updateUI();
        }
    }

    // Función para mostrar el siguiente diálogo
    function advanceDialogue() {
        if (currentDialogueIndex < dialogueLines.length) {
            dialogueText.textContent = dialogueLines[currentDialogueIndex];
            currentDialogueIndex++;
        }
    }

    // --- Event Listeners e Inicialización ---

    mainClickerBtn.addEventListener('click', () => {
        glitches += glitchesPerClick;
        updateUI();
    });

    // Bucle principal del juego (cada segundo)
    setInterval(() => {
        glitches += glitchesPerSecond;
        updateUI();
    }, 1000);
    
    // Bucle para el diálogo del personaje (cada 10 segundos)
    setInterval(advanceDialogue, 10000);

    // Inicializar el juego
    advanceDialogue(); // Mostrar el primer diálogo
    updateUI();
});