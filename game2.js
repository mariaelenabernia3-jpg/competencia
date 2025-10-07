document.addEventListener('DOMContentLoaded', () => {
    // --- BILINGUAL TEXTS ---
    const game2Texts = {
        introLore: { es: "???: Despierta, pequeño.", en: "???: Wake up, little one." },
        continuePrompt: { es: "[Toca para continuar]", en: "[Tap to continue]" },
        act2: { es: "Acto 2", en: "Act 2" },
        act2Subtitle: { es: "El Mundo Idle", en: "The Idle World" },
        // ===== DIÁLOGO ACTUALIZADO =====
        introDialogues: {
            es: ["¿Qué rayos fue esa voz?", "¿Y las plataformas dónde están?", "¿Qué coño soy, una foto sacada de Google?", "Bueno, es mejor que el personaje bugueado que tenía, vaya mierda.", "... ¿dónde estoy?"],
            en: ["What the hell was that voice?", "And where are the platforms?", "What the hell am I, a picture from Google?", "Well, it's better than the buggy character I had, what a mess.", "... where am I?"]
        },
        statsTitle: { es: "Estado", en: "Status" },
        energyStat: { es: "⚡ Energía:", en: "⚡ Energy:" },
        pcLevelStat: { es: "💻 PC Nivel:", en: "💻 PC Level:" },
        bitsStat: { es: "💰 Bits:", en: "💰 Bits:" },
        actionsTitle: { es: "Acciones", en: "Actions" },
        createGameBtn: { es: "Crear Juego", en: "Create Game" },
        eatBtn: { es: "Comer (5 Bits)", en: "Eat (5 Bits)" },
        shopBtn: { es: "Tienda", en: "Shop" },
        minigameTitle: { es: "Creando Juego...", en: "Creating Game..." },
        minigamePrompt: { es: "¡Toca rápido para terminar!", en: "Tap fast to finish!" },
        tapBtn: { es: "Tocar", en: "Tap" },
        shopTitle: { es: "Tienda", en: "Shop" },
        closeBtn: { es: "Cerrar", en: "Close" },
        noEnergy: { es: "Estoy demasiado cansado para esto... (Necesitas 20 de energía)", en: "I'm too tired for this... (You need 20 energy)" },
        noBits: { es: "No tengo suficientes Bits para esto.", en: "I don't have enough Bits for this." },
        gameCreated: { es: "¡Juego creado! Eso debería darme algunos Bits.", en: "Game created! That should give me some Bits." },
        ateFood: { es: "¡Ah, mucho mejor!", en: "Ah, much better!" },
        improvePC: { es: "Mejorar PC a Nivel", en: "Upgrade PC to Level" },
        buyBed: { es: "Comprar Cama", en: "Buy Bed" },
        buyTable: { es: "Comprar Mesa", en: "Buy Table" },
        buyChair: { es: "Comprar Silla", en: "Buy Chair" }
    };

    // --- DOM SELECTORS ---
    const allTextElements = document.querySelectorAll('[data-text-key]');
    const loreOverlay = document.getElementById('lore-intro-overlay');
    const titleScreenOverlay = document.getElementById('title-screen-overlay');
    const gameContainer = document.getElementById('game-container');
    const characterContainer = document.getElementById('character-container');
    const characterDialogue = document.getElementById('character-dialogue');
    const characterDialogueText = characterDialogue.querySelector('p');
    const mainInterface = document.getElementById('main-interface');
    const energyDisplay = document.getElementById('energy-display');
    const pcLevelDisplay = document.getElementById('pc-level-display');
    const bitsDisplay = document.getElementById('bits-display');
    const createGameBtn = document.getElementById('create-game-btn');
    const eatBtn = document.getElementById('eat-btn');
    const minigamePanel = document.getElementById('minigame-panel');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const tapBtn = document.getElementById('tap-btn');
    const shopBtn = document.getElementById('shop-btn');
    const shopOverlay = document.getElementById('shop-overlay');
    const closeShopBtn = document.getElementById('close-shop-btn');
    const shopItemsContainer = document.getElementById('shop-items');
    
    // --- GAME STATE ---
    let lang = localStorage.getItem('eg_language') || 'es';
    let gameState = {
        bits: 0, energy: 50, maxEnergy: 100, pcLevel: 1,
        items: {
            cama: { name: game2Texts.buyBed[lang], owned: false, cost: 150, energyBonus: 50 },
            mesa: { name: game2Texts.buyTable[lang], owned: false, cost: 100, energyBonus: 25 },
            silla: { name: game2Texts.buyChair[lang], owned: false, cost: 75, energyBonus: 15 },
        }
    };
    let characterMessageTimeout;

    // --- UI FUNCTIONS ---
    function applyText() {
        lang = localStorage.getItem('eg_language') || 'es';
        allTextElements.forEach(el => {
            const key = el.dataset.textKey;
            if (game2Texts[key] && game2Texts[key][lang]) {
                el.textContent = game2Texts[key][lang];
            }
        });
        gameState.items.cama.name = game2Texts.buyBed[lang];
        gameState.items.mesa.name = game2Texts.buyTable[lang];
        gameState.items.silla.name = game2Texts.buyChair[lang];
    }
    
    function updateUI() {
        energyDisplay.textContent = `${gameState.energy} / ${gameState.maxEnergy}`;
        pcLevelDisplay.textContent = gameState.pcLevel;
        bitsDisplay.textContent = gameState.bits;
    }

    function showCharacterMessage(messageKey, duration = 3000) {
        clearTimeout(characterMessageTimeout);
        characterDialogue.classList.remove('hidden');
        characterDialogueText.textContent = game2Texts[messageKey][lang];
        characterMessageTimeout = setTimeout(() => {
            characterDialogue.classList.add('hidden');
        }, duration);
    }

    // --- INTRO SEQUENCE ---
    const delay = ms => new Promise(res => setTimeout(res, ms));

    async function showIntroDialogues() {
        characterDialogue.classList.remove('hidden');
        for (const line of game2Texts.introDialogues[lang]) {
            characterDialogueText.textContent = line;
            await delay(4000); // Aumentamos un poco el tiempo para leer mejor
        }
        characterDialogue.classList.add('hidden');
    }

    // ===== LÓGICA DE SECUENCIA CORREGIDA =====
    async function startIntroSequence() {
        // 1. Mostrar el contenedor principal. Es el "escenario" y debe estar visible.
        gameContainer.classList.remove('hidden');

        // 2. Mostrar la pantalla de título DENTRO del escenario.
        titleScreenOverlay.classList.remove('hidden');
        await delay(4000);
        titleScreenOverlay.classList.add('hidden');
        
        // 3. Mostrar al personaje DENTRO del escenario.
        characterContainer.classList.remove('hidden');
        await delay(1000);
        
        // 4. Iniciar diálogos.
        await showIntroDialogues();

        // 5. Mover personaje y mostrar la interfaz.
        characterContainer.classList.add('in-corner');
        await delay(1500); // Esperar a que la animación de movimiento termine.
        mainInterface.classList.remove('hidden');
        
        // 6. El juego comienza.
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

    // --- GAME LOGIC ---
    function initializeGame() {
        updateUI();
    }

    let gameProgress = 0;
    createGameBtn.addEventListener('click', () => {
        if (gameState.energy < 20) {
            showCharacterMessage('noEnergy'); return;
        }
        gameState.energy -= 20;
        gameProgress = 0;
        progressBarFill.style.width = '0%';
        minigamePanel.classList.remove('hidden');
        createGameBtn.disabled = true; eatBtn.disabled = true; shopBtn.disabled = true;
        updateUI();
    });

    tapBtn.addEventListener('click', () => {
        gameProgress += (5 + gameState.pcLevel);
        progressBarFill.style.width = `${Math.min(gameProgress, 100)}%`;
        if (gameProgress >= 100) {
            const bitsEarned = 50 + (gameState.pcLevel * 10);
            gameState.bits += bitsEarned;
            showCharacterMessage('gameCreated');
            minigamePanel.classList.add('hidden');
            createGameBtn.disabled = false; eatBtn.disabled = false; shopBtn.disabled = false;
            updateUI();
        }
    });

    eatBtn.addEventListener('click', () => {
        if (gameState.bits < 5) {
            showCharacterMessage('noBits'); return;
        }
        gameState.bits -= 5;
        gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 15);
        showCharacterMessage('ateFood');
        updateUI();
    });

    // --- SHOP LOGIC ---
    function renderShop() {
        shopItemsContainer.innerHTML = '';
        const pcCost = 50 * Math.pow(2, gameState.pcLevel);
        const pcItem = document.createElement('div');
        pcItem.className = 'shop-item';
        pcItem.innerHTML = `<span>${game2Texts.improvePC[lang]} ${gameState.pcLevel + 1}</span>`;
        const pcButton = document.createElement('button');
        pcButton.textContent = `${pcCost} Bits`;
        pcButton.disabled = gameState.bits < pcCost;
        pcButton.addEventListener('click', () => buyItem('pc'));
        pcItem.appendChild(pcButton);
        shopItemsContainer.appendChild(pcItem);

        for (const key in gameState.items) {
            const item = gameState.items[key];
            if (!item.owned) {
                const shopItem = document.createElement('div');
                shopItem.className = 'shop-item';
                shopItem.innerHTML = `<span>${item.name} (+${item.energyBonus} E. Máx)</span>`;
                const itemButton = document.createElement('button');
                itemButton.textContent = `${item.cost} Bits`;
                itemButton.disabled = gameState.bits < item.cost;
                itemButton.addEventListener('click', () => buyItem(key));
                shopItem.appendChild(itemButton);
                shopItemsContainer.appendChild(shopItem);
            }
        }
    }

    function buyItem(itemId) {
        if (itemId === 'pc') {
            const cost = 50 * Math.pow(2, gameState.pcLevel);
            if (gameState.bits >= cost) {
                gameState.bits -= cost; gameState.pcLevel++;
            }
        } else {
            const item = gameState.items[itemId];
            if (gameState.bits >= item.cost) {
                gameState.bits -= item.cost; item.owned = true;
                gameState.maxEnergy += item.energyBonus;
                gameState.energy = gameState.maxEnergy;
            }
        }
        updateUI(); renderShop();
    }

    shopBtn.addEventListener('click', () => { renderShop(); shopOverlay.classList.remove('hidden'); });
    closeShopBtn.addEventListener('click', () => { shopOverlay.classList.add('hidden'); });

    // --- INITIALIZATION ---
    applyText();
    const isFirstVisit = !localStorage.getItem('eg_game2_intro_completed');
    if (isFirstVisit) {
        loreOverlay.addEventListener('click', () => {
            loreOverlay.classList.add('hidden');
            localStorage.setItem('eg_game2_intro_completed', 'true');
            startIntroSequence();
        }, { once: true });
    } else {
        showGameDirectly();
    }
});
