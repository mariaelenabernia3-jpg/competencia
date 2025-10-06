document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores del DOM ---
    const loreOverlay = document.getElementById('lore-intro-overlay');
    const titleScreenOverlay = document.getElementById('title-screen-overlay');
    const gameContainer = document.getElementById('game-container');
    const characterContainer = document.getElementById('character-container');
    const characterDialogue = document.getElementById('character-dialogue');
    const characterDialogueText = characterDialogue.querySelector('p');
    const mainInterface = document.getElementById('main-interface');
    // Paneles de la interfaz
    const energyDisplay = document.getElementById('energy-display');
    const pcLevelDisplay = document.getElementById('pc-level-display');
    const bitsDisplay = document.getElementById('bits-display');
    const createGameBtn = document.getElementById('create-game-btn');
    const minigamePanel = document.getElementById('minigame-panel');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const tapBtn = document.getElementById('tap-btn');
    // Tienda
    const shopBtn = document.getElementById('shop-btn');
    const shopOverlay = document.getElementById('shop-overlay');
    const closeShopBtn = document.getElementById('close-shop-btn');
    const shopItemsContainer = document.getElementById('shop-items');
    
    // --- Estado del Juego ---
    let gameState = {
        bits: 0,
        energy: 50,
        maxEnergy: 100,
        pcLevel: 1,
        items: {
            cama: { owned: false, cost: 150, energyBonus: 50 },
            mesa: { owned: false, cost: 100, energyBonus: 25 },
            silla: { owned: false, cost: 75, energyBonus: 15 },
        }
    };
    
    // --- Lógica de Introducción y Diálogos ---
    const introDialogues = [
        "¿Qué rayos fue esa voz?",
        "¿Y las plataformas dónde están?",
        "Bueno, al menos ya no tengo el aspecto bugueado que tenía antes.",
        "Vaya mierda, ahora estoy algo mejor, pero...",
        "... ¿dónde estoy?"
    ];
    
    const isFirstVisit = !localStorage.getItem('eg_game2_intro_completed');

    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function showDialogue(lines) {
        characterDialogue.classList.remove('hidden');
        for (const line of lines) {
            characterDialogueText.textContent = line;
            await delay(3500); // Tiempo que cada diálogo es visible
        }
        characterDialogue.classList.add('hidden');
    }

    async function startIntroSequence() {
        // Mostrar "Acto 2"
        titleScreenOverlay.classList.remove('hidden');
        await delay(4000);
        titleScreenOverlay.classList.add('hidden');
        await delay(500);

        // Mostrar personaje y diálogos
        characterContainer.classList.remove('hidden');
        await delay(1000);
        await showDialogue(introDialogues);

        // Mover personaje a la esquina y mostrar interfaz
        characterContainer.classList.add('in-corner');
        await delay(1500); // Esperar a que termine la animación
        mainInterface.classList.remove('hidden');

        // Iniciar el juego
        initializeGame();
    }

    function showGameDirectly() {
        loreOverlay.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        characterContainer.classList.remove('hidden');
        characterContainer.classList.add('in-corner');
        mainInterface.classList.remove('hidden');
        initializeGame();
    }
    
    // --- Lógica Principal del Juego ---
    function updateUI() {
        energyDisplay.textContent = `${gameState.energy} / ${gameState.maxEnergy}`;
        pcLevelDisplay.textContent = gameState.pcLevel;
        bitsDisplay.textContent = gameState.bits;
    }

    function initializeGame() {
        console.log("Juego Inicializado");
        updateUI();
        // Aquí puedes añadir un bucle de juego si es necesario (ej. que la energía baje con el tiempo)
    }

    // --- Minijuego de Crear Juego ---
    let gameProgress = 0;
    createGameBtn.addEventListener('click', () => {
        if (gameState.energy < 20) {
            alert("¡No tienes suficiente energía para crear un juego! (Necesitas 20)");
            return;
        }
        gameState.energy -= 20;
        gameProgress = 0;
        progressBarFill.style.width = '0%';
        minigamePanel.classList.remove('hidden');
        createGameBtn.disabled = true;
        updateUI();
    });
    
    tapBtn.addEventListener('click', () => {
        gameProgress += (5 + gameState.pcLevel); // El nivel del PC ayuda a progresar más rápido
        progressBarFill.style.width = `${gameProgress}%`;
        if (gameProgress >= 100) {
            const bitsEarned = 50 + (gameState.pcLevel * 10);
            gameState.bits += bitsEarned;
            alert(`¡Juego creado! Ganaste ${bitsEarned} Bits.`);
            minigamePanel.classList.add('hidden');
            createGameBtn.disabled = false;
            updateUI();
        }
    });
    
    // --- Lógica de la Tienda ---
    function renderShop() {
        shopItemsContainer.innerHTML = '';
        // Mejorar PC
        const pcCost = 50 * Math.pow(2, gameState.pcLevel);
        shopItemsContainer.innerHTML += `
            <div class="shop-item">
                <span>Mejorar PC a Nivel ${gameState.pcLevel + 1}</span>
                <button onclick="buy('pc')" ${gameState.bits < pcCost ? 'disabled' : ''}>${pcCost} Bits</button>
            </div>
        `;
        // Items de la casa
        for (const key in gameState.items) {
            const item = gameState.items[key];
            if (!item.owned) {
                shopItemsContainer.innerHTML += `
                    <div class="shop-item">
                        <span>Comprar ${key.charAt(0).toUpperCase() + key.slice(1)} (+${item.energyBonus} Energía Máx)</span>
                        <button onclick="buy('${key}')" ${gameState.bits < item.cost ? 'disabled' : ''}>${item.cost} Bits</button>
                    </div>
                `;
            }
        }
    }

    window.buy = function(itemId) {
        if (itemId === 'pc') {
            const cost = 50 * Math.pow(2, gameState.pcLevel);
            if (gameState.bits >= cost) {
                gameState.bits -= cost;
                gameState.pcLevel++;
            }
        } else {
            const item = gameState.items[itemId];
            if (gameState.bits >= item.cost) {
                gameState.bits -= item.cost;
                item.owned = true;
                gameState.maxEnergy += item.energyBonus;
                gameState.energy += item.energyBonus; // Curar al comprar
            }
        }
        updateUI();
        renderShop();
    }

    shopBtn.addEventListener('click', () => {
        renderShop();
        shopOverlay.classList.remove('hidden');
    });
    closeShopBtn.addEventListener('click', () => {
        shopOverlay.classList.add('hidden');
    });
    
    // --- Punto de Entrada ---
    if (isFirstVisit) {
        const currentLanguage = localStorage.getItem('eg_language') || 'es';
        const loreTexts = { es: "???: Despierta, pequeño.", en: "???: Wake up, little one." };
        const continueTexts = { es: "[Toca para continuar]", en: "[Tap to continue]" };
        document.getElementById('lore-text').textContent = loreTexts[currentLanguage];
        document.getElementById('continue-prompt').textContent = continueTexts[currentLanguage];
        
        loreOverlay.addEventListener('click', () => {
            loreOverlay.classList.add('hidden');
            localStorage.setItem('eg_game2_intro_completed', 'true');
            startIntroSequence();
        }, { once: true }); // El evento solo se dispara una vez
    } else {
        showGameDirectly();
    }
});
