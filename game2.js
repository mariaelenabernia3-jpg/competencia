document.addEventListener('DOMContentLoaded', () => {
    // --- BILINGUAL TEXTS ---
    const game2Texts = {
        introLore: { es: "???: Despierta, pequeño.", en: "???: Wake up, little one." },
        continuePrompt: { es: "[Toca para continuar]", en: "[Tap to continue]" },
        act2: { es: "Acto 2", en: "Act 2" },
        act2Subtitle: { es: "El Mundo Idle", en: "The Idle World" },
        introDialogues: {
            es: ["¿Qué rayos fue esa voz?", "¿Y las plataformas dónde están?", "¿Qué coño soy, una foto sacada de Google?", "Bueno, es mejor que el personaje bugueado que tenía, vaya mierda.", "... dónde estoy?"],
            en: ["What the hell was that voice?", "And where are the platforms?", "What the hell am I, a picture from Google?", "Well, it's better than the buggy character I had, what a mess.", "... where am I?"]
        },
        statsTitle: { es: "Estado", en: "Status" },
        energyStat: { es: "⚡ Energía:", en: "⚡ Energy:" },
        pcLevelStat: { es: "💻 PC Nivel:", en: "💻 PC Level:" },
        bitsPerSecond: { es: "⚙️ Bits/s:", en: "⚙️ Bits/s:" },
        bitsStat: { es: "💰 Bits:", en: "💰 Bits:" },
        actionsTitle: { es: "Acciones", en: "Actions" },
        createGameBtn: { es: "Crear Juego", en: "Create Game" },
        eatBtn: { es: "Comer (5 Bits)", en: "Eat (5 Bits)" },
        shopBtn: { es: "Tienda", en: "Shop" },
        createGlitchBtnWithCost: { es: "CREAR GLITCH (2500 Bits, 50⚡)", en: "CREATE GLITCH (2500 Bits, 50⚡)" },
        minigameTitle: { es: "Creando Juego...", en: "Creating Game..." },
        hackerMinigameTitle: { es: "¡¡ATAQUE HACKER!!", en: "HACKER ATTACK!!" },
        minigamePrompt: { es: "¡Toca rápido para terminar!", en: "Tap fast to finish!" },
        tapBtn: { es: "Tocar", en: "Tap" },
        shopTitle: { es: "Tienda", en: "Shop" },
        closeBtn: { es: "Cerrar", en: "Close" },
        noEnergy: { es: "Estoy demasiado cansado para esto...", en: "I'm too tired for this..." },
        noBits: { es: "No tengo suficientes Bits para esto.", en: "I don't have enough Bits for this." },
        gameCreated: { es: "¡Juego creado! Eso debería darme algunos Bits.", en: "Game created! That should give me some Bits." },
        ateFood: { es: "¡Ah, mucho mejor!", en: "Ah, much better!" },
        fullEnergy: { es: "Ya no tengo hambre, bro.", en: "I'm not hungry anymore, bro." },
        hackerAppears: { es: "¡Un hacker salvaje apareció! ¡Defiéndete!", en: "A wild hacker appeared! Defend yourself!"},
        glitchReady: { es: "Siento... algo. Creo que si mejoro el PC al nivel 5, puedo romper este lugar.", en: "I feel... something. I think if I upgrade the PC to level 5, I can break this place." },
        glitchNoResources: { es: "Aún no... Necesito más poder. Mucho más.", en: "Not yet... I need more power. A lot more." },
        glitchTriggered: { es: "¡¡ALLÁ VAMOS!!", en: "HERE WE GO!!" },
        hackerWin: { es: "¡GANASTE! +30 Bits.", en: "YOU WIN! +30 Bits." },
        hackerLoss: { es: "PERDISTE... -25 Energía.", en: "YOU LOSE... -25 Energy." },
        improvePC: { es: "Mejorar PC a Nivel", en: "Upgrade PC to Level" },
        buyBed: { es: "Comprar Cama", en: "Buy Bed" },
        buyTable: { es: "Comprar Mesa", en: "Buy Table" },
        buyChair: { es: "Comprar Silla", en: "Buy Chair" },
        buyCooler: { es: "Comprar Enfriador CPU", en: "Buy CPU Cooler" },
        buyRAM: { es: "Comprar Más RAM", en: "Buy More RAM" },
        buyAutoClicker: { es: "Comprar Auto-Clicker", en: "Buy Auto-Clicker" }
    };

    // --- DOM SELECTORS ---
    const allTextElements = document.querySelectorAll('[data-text-key]');
    const loreOverlay = document.getElementById('lore-intro-overlay');
    const titleScreenOverlay = document.getElementById('title-screen-overlay');
    const characterDialogue = document.getElementById('character-dialogue');
    const characterDialogueText = characterDialogue.querySelector('p');
    const energyDisplay = document.getElementById('energy-display');
    const pcLevelDisplay = document.getElementById('pc-level-display');
    const bpsDisplay = document.getElementById('bps-display');
    const bitsDisplay = document.getElementById('bits-display');
    const createGameBtn = document.getElementById('create-game-btn');
    const createGlitchBtn = document.getElementById('create-glitch-btn');
    const eatBtn = document.getElementById('eat-btn');
    const minigamePanel = document.getElementById('minigame-panel');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const tapBtn = document.getElementById('tap-btn');
    const shopBtn = document.getElementById('shop-btn');
    const shopOverlay = document.getElementById('shop-overlay');
    const closeShopBtn = document.getElementById('close-shop-btn');
    const shopItemsContainer = document.getElementById('shop-items');
    const glitchOverlay = document.getElementById('glitch-overlay');
    const glitchSound = document.getElementById('glitch-sound');
    const hackerMinigamePanel = document.getElementById('hacker-minigame-panel');
    const playerProgressBarFill = document.getElementById('player-progress-bar-fill');
    const hackerProgressBarFill = document.getElementById('hacker-progress-bar-fill');
    const hackerResultText = document.getElementById('hacker-result-text');
    const hackerTapBtn = document.getElementById('hacker-tap-btn');
    const hackerCloseBtn = document.getElementById('hacker-close-btn');

    // --- GAME STATE ---
    let lang = 'es';
    const GLITCH_COST_BITS = 2500;
    const GLITCH_COST_ENERGY = 50;
    const defaultGameState = {
        bits: 0, energy: 50, maxEnergy: 100, pcLevel: 1, bitsPerSecond: 0,
        items: {
            cama: { owned: false, cost: 150, energyBonus: 50 },
            mesa: { owned: false, cost: 100, energyBonus: 25 },
            silla: { owned: false, cost: 75, energyBonus: 15 },
            cooler: { owned: false, cost: 250, effect: () => {} },
            ram: { owned: false, cost: 400, effect: () => {} },
            autoclicker: { owned: false, cost: 1000, effect: () => { gameState.bitsPerSecond += 5; }},
        }
    };
    let gameState = {};
    let characterMessageTimeout;
    
    // --- PERSISTENCE (SAVE/LOAD) ---
    function saveGame() {
        localStorage.setItem('eg_game2_save', JSON.stringify(gameState));
    }

    function loadGame() {
        const savedGame = localStorage.getItem('eg_game2_save');
        gameState = Object.assign({}, defaultGameState, JSON.parse(savedGame));
        lang = localStorage.getItem('eg_language') || 'es';
        for (const key in defaultGameState.items) {
           const itemKey = `buy${key.charAt(0).toUpperCase() + key.slice(1)}`;
           if (game2Texts[itemKey] && game2Texts[itemKey][lang]) {
               gameState.items[key].name = game2Texts[itemKey][lang];
           }
        }
    }

    // --- UI FUNCTIONS ---
    function applyText() {
        lang = localStorage.getItem('eg_language') || 'es';
        allTextElements.forEach(el => {
            const key = el.dataset.textKey;
            if (game2Texts[key] && game2Texts[key][lang]) {
                el.textContent = game2Texts[key][lang];
            }
        });
    }
    
    function updateUI() {
        energyDisplay.textContent = `${gameState.energy} / ${gameState.maxEnergy}`;
        pcLevelDisplay.textContent = gameState.pcLevel;
        bpsDisplay.textContent = gameState.bitsPerSecond;
        bitsDisplay.textContent = Math.floor(gameState.bits);
        
        if (gameState.pcLevel >= 5) {
            createGlitchBtn.disabled = false;
        }
    }

    function showCharacterMessage(messageKey, duration = 3000) {
        clearTimeout(characterMessageTimeout);
        const message = game2Texts[messageKey] ? game2Texts[messageKey][lang] : messageKey;
        characterDialogue.classList.remove('hidden');
        characterDialogueText.textContent = message;
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
            await delay(4000);
        }
        characterDialogue.classList.add('hidden');
    }

    async function startIntroSequence() {
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('title-screen-overlay').classList.remove('hidden');
        await delay(4000);
        document.getElementById('title-screen-overlay').classList.add('hidden');
        document.getElementById('character-container').classList.remove('hidden');
        await delay(1000);
        await showIntroDialogues();
        document.getElementById('character-container').classList.add('in-corner');
        await delay(1500);
        document.getElementById('main-interface').classList.remove('hidden');
        initializeGame();
    }

    function showGameDirectly() {
        loreOverlay.classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        document.getElementById('character-container').classList.remove('hidden');
        document.getElementById('character-container').classList.add('in-corner');
        document.getElementById('main-interface').classList.remove('hidden');
        initializeGame();
    }

    // --- GAME LOGIC ---
    function initializeGame() {
        // Intervalo de ganancia pasiva
        setInterval(() => {
            if (gameState.bitsPerSecond > 0) {
                gameState.bits += gameState.bitsPerSecond;
                updateUI();
                saveGame();
            }
        }, 1000);

        // Intervalo para evento aleatorio de hacker
        setInterval(() => {
            const isPlayerBusy = !minigamePanel.classList.contains('hidden') || !hackerMinigamePanel.classList.contains('hidden') || !shopOverlay.classList.contains('hidden');
            // 15% de probabilidad cada 10 segundos
            if (!isPlayerBusy && gameState.energy > 0 && Math.random() < 0.15) {
                startHackerFight();
            }
        }, 10000);

        updateUI();
    }

    let gameProgress = 0;
    createGameBtn.addEventListener('click', () => {
        const energyCost = gameState.items.cooler.owned ? 15 : 20;
        if (gameState.energy < energyCost) {
            showCharacterMessage(`${game2Texts.noEnergy[lang]} (${energyCost}⚡)`);
            return;
        }
        gameState.energy -= energyCost;
        gameProgress = 0;
        progressBarFill.style.width = '0%';
        minigamePanel.classList.remove('hidden');
        hackerMinigamePanel.classList.add('hidden');
        document.querySelectorAll('#actions-panel button').forEach(button => button.disabled = true);
        updateUI();
    });

    tapBtn.addEventListener('click', () => {
        gameProgress += (5 + gameState.pcLevel);
        progressBarFill.style.width = `${Math.min(gameProgress, 100)}%`;
        if (gameProgress >= 100) {
            let bitsEarned = 50 + (gameState.pcLevel * 10);
            if (gameState.items.ram.owned) bitsEarned *= 1.5;
            gameState.bits += bitsEarned;
            showCharacterMessage('gameCreated');
            minigamePanel.classList.add('hidden');
            document.querySelectorAll('#actions-panel button').forEach(button => button.disabled = false);
            if(gameState.pcLevel < 5) createGlitchBtn.disabled = true;
            updateUI();
            saveGame();
        }
    });

    eatBtn.addEventListener('click', () => {
        if (gameState.energy >= gameState.maxEnergy) {
            showCharacterMessage('fullEnergy');
            return;
        }
        if (gameState.bits < 5) {
            showCharacterMessage('noBits');
            return;
        }
        gameState.bits -= 5;
        gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 15);
        showCharacterMessage('ateFood');
        updateUI();
        saveGame();
    });
    
    // --- HACKER MINIGAME LOGIC ---
    let playerProgress, hackerProgress, hackerInterval;

    function startHackerFight() {
        gameState.energy -= 1; // Costo por ser atacado
        showCharacterMessage('hackerAppears', 4000);
        
        playerProgress = 0;
        hackerProgress = 0;
        playerProgressBarFill.style.width = '0%';
        hackerProgressBarFill.style.width = '0%';
        hackerResultText.textContent = '';
        
        minigamePanel.classList.add('hidden');
        hackerMinigamePanel.classList.remove('hidden');
        document.querySelectorAll('#actions-panel button').forEach(button => button.disabled = true);
        hackerTapBtn.disabled = false;
        hackerCloseBtn.classList.add('hidden');
        
        const hackerSpeed = Math.max(0.5, 2 - (gameState.pcLevel * 0.1));
        hackerInterval = setInterval(() => {
            hackerProgress += hackerSpeed;
            hackerProgressBarFill.style.width = `${Math.min(hackerProgress, 100)}%`;
            if (hackerProgress >= 100) {
                endHackerFight(false);
            }
        }, 50);

        updateUI();
    }

    hackerTapBtn.addEventListener('click', () => {
        playerProgress += 3 + (gameState.pcLevel * 0.5);
        playerProgressBarFill.style.width = `${Math.min(playerProgress, 100)}%`;
        if (playerProgress >= 100) {
            endHackerFight(true);
        }
    });

    function endHackerFight(playerWon) {
        clearInterval(hackerInterval);
        hackerTapBtn.disabled = true;
        hackerCloseBtn.classList.remove('hidden');

        if (playerWon) {
            gameState.bits += 30;
            hackerResultText.textContent = game2Texts.hackerWin[lang];
        } else {
            gameState.energy = Math.max(0, gameState.energy - 25);
            hackerResultText.textContent = game2Texts.hackerLoss[lang];
        }
        updateUI();
        saveGame();
    }

    hackerCloseBtn.addEventListener('click', () => {
        hackerMinigamePanel.classList.add('hidden');
        document.querySelectorAll('#actions-panel button').forEach(button => button.disabled = false);
        if(gameState.pcLevel < 5) createGlitchBtn.disabled = true;
    });

    // --- GLITCH LOGIC ---
    function triggerGlitchEffect() {
        if (gameState.bits < GLITCH_COST_BITS || gameState.energy < GLITCH_COST_ENERGY) {
            showCharacterMessage('glitchNoResources');
            return;
        }
        gameState.bits -= GLITCH_COST_BITS;
        gameState.energy -= GLITCH_COST_ENERGY;
        saveGame();
        updateUI();
        showCharacterMessage('glitchTriggered');
        if(glitchSound) {
            glitchSound.volume = localStorage.getItem('eg_sfxVolume') || 1.0;
            glitchSound.play();
        }
        glitchOverlay.classList.remove('hidden');
        setTimeout(() => {
            window.location.href = 'game3.html';
        }, 2800);
    }
    createGlitchBtn.addEventListener('click', triggerGlitchEffect);

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
                let description = item.name;
                 if(item.energyBonus) description += ` (+${item.energyBonus} E. Máx)`;
                 if(key === 'cooler') description += ` (Reduce coste ⚡)`;
                 if(key === 'ram') description += ` (+50% Bits)`;
                 if(key === 'autoclicker') description += ` (+5 Bits/s)`;

                shopItem.innerHTML = `<span>${description}</span>`;
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
            if (gameState.bits >= item.cost && !item.owned) {
                gameState.bits -= item.cost; 
                item.owned = true;
                if(item.energyBonus) {
                    gameState.maxEnergy += item.energyBonus;
                    gameState.energy = gameState.maxEnergy;
                }
                if(item.effect) item.effect();
            }
        }
        updateUI();
        renderShop();
        saveGame();
    }

    shopBtn.addEventListener('click', () => { renderShop(); shopOverlay.classList.remove('hidden'); });
    closeShopBtn.addEventListener('click', () => { shopOverlay.classList.add('hidden'); });

    // --- INITIALIZATION ---
    loadGame();
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