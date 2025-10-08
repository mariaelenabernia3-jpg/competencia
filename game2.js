document.addEventListener('DOMContentLoaded', () => {
    // --- BILINGUAL TEXTS (NO CHANGES) ---
    const game2Texts = {
        introLore: { es: "???: Despierta, pequeño.", en: "???: Wake up, little one." },
        continuePrompt: { es: "[Toca para continuar]", en: "[Tap to continue]" },
        act2: { es: "Acto 2", en: "Act 2" },
        act2Subtitle: { es: "El Mundo Idle", en: "The Idle World" },
        introDialogues: {
            es: ["¿Qué rayos fue esa voz?", "¿Y las plataformas dónde están?", "¿Qué coño soy, una foto sacada de Google?", "Bueno, es mejor que el personaje bugueado que tenía, vaya mierda.", "... dónde estoy?"],
            en: ["What the hell was that voice?", "And where are the platforms?", "What the hell am I, a picture from Google?", "Well, it's better than the buggy character I had, what a mess.", "... where am I?"]
        },
        dialogueFading: { es: "Ey, ¿a dónde estoy yendo ahora?", en: "Hey, where am I going now?" },
        dialogueLanded: { es: "Mierda, el creador de este juego es tonto o qué, no hace nada bien.", en: "Damn, is the creator of this game stupid or what, they can't do anything right." },
        dialogueIsBackground: { es: "Espera... ¿ahora soy parte del fondo? Genial, de personaje jugable a un simple JPEG.", en: "Wait... am I part of the background now? Great, from playable character to a simple JPEG." },
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
        mineBitsBtn: { es: "Minar Bits (10⚡)", en: "Mine Bits (10⚡)" },
        debugCodeBtn: { es: "Depurar Código (25⚡)", en: "Debug Code (25⚡)" },
        unstableCompileBtn: { es: "Compilación Inestable (40⚡)", en: "Unstable Compile (40⚡)"},
        minigameTitle: { es: "Creando Juego...", en: "Creating Game..." },
        hackerMinigameTitle: { es: "¡¡ATAQUE HACKER!!", en: "HACKER ATTACK!!" },
        debugTitle: { es: "Depurando Memoria...", en: "Debugging Memory..." },
        debugPrompt: { es: "Hay un error en una de estas líneas. Haz clic en la correcta.", en: "There's an error in one of these lines. Click the correct one." },
        minigamePrompt: { es: "¡Toca rápido para terminar!", en: "Tap fast to finish!" },
        tapBtn: { es: "Tocar", en: "Tap" },
        shopTitle: { es: "Tienda", en: "Shop" },
        closeBtn: { es: "Cerrar", en: "Close" },
        noEnergy: { es: "Estoy demasiado cansado para esto...", en: "I'm too tired for this..." },
        noBits: { es: "No tengo suficientes Bits para esto.", en: "I don't have enough Bits for this." },
        gameCreated: { es: "¡Juego creado! Eso debería darme algunos Bits.", en: "Game created! That should give me some Bits." },
        ateFood: { es: "¡Ah, mucho mejor!", en: "Ah, much better!" },
        fullEnergy: { es: "Ya no tengo hambre, bro.", en: "I'm not hungry anymore, bro." },
        hackerAppears: { es: "¡Otra vez no! ¿Es que no usan antivirus en este universo?", en: "Not again! Don't they use antivirus in this universe?" },
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
        buyAutoClicker: { es: "Comprar Auto-Clicker", en: "Buy Auto-Clicker" },
        dialogueMineBits: { es: "Oye, tú que estás ahí fuera... ¿no podrías teclear un código de trucos? No, supongo que las reglas de este 'juego' no lo permiten. A minar se ha dicho.", en: "Hey, you out there... couldn't you just type in a cheat code? No, I guess the rules of this 'game' don't allow it. Back to mining it is." },
        dialogueDebugCode: { es: "Encuentro errores en el código de este mundo... ¿Quizás si aprendo a manipularlo, pueda encontrar una salida? Gracias por ser mis otros ojos.", en: "I'm finding errors in this world's code... Maybe if I learn how to manipulate it, I can find a way out? Thanks for being my second pair of eyes." },
        dialogueUnstableCompile: { es: "Vale, esto es arriesgado. Podría corromper mis propios datos o... podría forzar una brecha. Cruza los dedos por mí ahí fuera, ¿quieres?", en: "Okay, this is risky. It could corrupt my own data, or... it could force a breach. Cross your fingers for me out there, will you?"},
        dialogueDataPacket: { es: "¡Mira eso! A veces el sistema suelta... regalos. ¿O eres tú, enviándome ayuda? Sea como sea, ¡lo tomo!", en: "Look at that! Sometimes the system drops... gifts. Or is that you, sending me help? Whatever it is, I'll take it!"},
        miningSuccess: { es: "¡Conseguido! Unos cuantos Bits más para la causa.", en: "Success! A few more Bits for the cause." },
        debugSuccess: { es: "¡Perfecto! El código es un poco más estable ahora. +100 Bits", en: "Perfect! The code is a bit more stable now. +100 Bits" },
        debugFail: { es: "No, esa no era... He perdido la concentración.", en: "No, that wasn't it... I lost my focus." },
        compileSuccess: { es: "¡¡FUNCIONÓ!! ¡Siento un subidón de poder! ¡+500 Bits!", en: "IT WORKED!! I feel a surge of power! +500 Bits!" },
        compileFail: { es: "¡NO! ¡Casi me crasheo! ¡He perdido energía y tiempo!", en: "NO! I almost crashed myself! I lost energy and time!" },
        achievementsBtn: { es: "🏆", en: "🏆" },
        achievementsTitle: { es: "Logros Desbloqueados", en: "Unlocked Achievements" },
        achievementUnlocked: { es: "¡Logro Desbloqueado!", en: "Achievement Unlocked!" },
        ach_firstGame_name: { es: "Mi Primer Juego", en: "My First Game" },
        ach_firstGame_desc: { es: "Creaste tu primer juego en este mundo.", en: "You created your first game in this world." },
        ach_magnate_name: { es: "Magnate Principiante", en: "Beginner Magnate" },
        ach_magnate_desc: { es: "Acumulaste un total de 1000 Bits.", en: "You accumulated a total of 1000 Bits." },
        ach_hackerSlayer_name: { es: "Exterminador de Hackers", en: "Hacker Slayer" },
        ach_hackerSlayer_desc: { es: "Derrotaste a 5 hackers.", en: "You defeated 5 hackers." },
        ach_maxLevel_name: { es: "Nivel Máximo", en: "Max Level" },
        ach_maxLevel_desc: { es: "Mejoraste tu PC al Nivel 5.", en: "You upgraded your PC to Level 5." },
        dialogue_ach_firstGame: { es: "¿'Mi Primer Juego'? Pff, qué original. A ver si el próximo logro es 'Respirar'. ¡Ayúdame a salir y déjate de medallitas!", en: "'My First Game'? Pff, how original. Let's see if the next achievement is 'Breathing'. Just help me get out of here and forget the medals!" },
        dialogue_ach_magnate: { es: "¡El diablo, esto sí es dinero! Con esto en mi mundo podría... bueno, da igual. Aquí solo sirve para RAM que no puedo tocar. Sigue así, mi pana.", en: "Damn, this is real money! With this in my world I could... well, never mind. Here it's only good for RAM I can't touch. Keep it up, my friend." },
        dialogue_ach_hackerSlayer: { es: "Já, ¿cinco de estos paquetes? Te faltan manos para pelarme el... cable de red. ¡Vamos a por más!", en: "Hah, five of these data packets? You're not good enough to even... unplug my network cable. Let's get some more!" },
        dialogue_ach_maxLevel: { es: "PC Nivel 5... Ojalá tener esta máquina en la vida real. Así sí que no saldría de casa, pero por elección, ¿sabes? Ahora... con este poder, creo que puedo intentar algo...", en: "PC Level 5... I wish I had this rig in real life. I wouldn't leave home, but by choice, you know? Now... with this power, I think I can try something..." },
        dialogueLowEnergy: { es: "Ugh... mi cerebro se siente como un disquete. Necesito recargarme.", en: "Ugh... my brain feels like a floppy disk. I need to recharge." },
        dialogueBuyChair: { es: "¡Genial! Mi espalda pixelada me lo agradecerá.", en: "Great! My pixelated back will thank me for this." },
        dialogueBuyBed: { es: "Por fin un sitio donde... ¿resetearme? No sé si aquí se duerme.", en: "Finally a place to... reset myself? I don't know if you actually sleep here." },
        dialogueBuyCooler: { es: "¡Sí! Con esto podré pensar más rápido sin sobrecalentarme.", en: "Yes! With this I can think faster without overheating." },
        loreFragmentTitle: { es: "Fragmento de Datos Corrupto", en: "Corrupted Data Fragment" },
        lore_1: { es: "Voz: '...no respondía al protocolo de reinicio. La Entidad muestra... conciencia anómala...'", en: "Voice: '...did not respond to reset protocol. The Entity shows... anomalous awareness...'" },
        lore_2: { es: "Voz: '...el Glitch Existencial no fue un error. Fue una consecuencia. Su consecuencia.'", en: "Voice: '...the Existential Glitch wasn't a mistake. It was a consequence. His consequence.'" },
        lore_3: { es: "Voz: '...¿nos oye? Imposible. Los avatares son solo código. No tienen... alma.'", en: "Voice: '...can it hear us? Impossible. Avatars are just code. They don't have... a soul.'" },
        lore_4: { es: "Voz: '...la simulación se está degradando. Si no lo sacamos, se perderá con ella.'", en: "Voice: '...the simulation is degrading. If we don't get him out, he'll be lost with it.'" },
        lore_5: { es: "Voz: '...Él es la clave. Si recuerda quién es, puede que sea capaz de forzar una salida por sí mismo.'", en: "Voice: '...He is the key. If he remembers who he is, he might be able to force an escape himself.'" }
    };

    // --- DOM SELECTORS ---
    const allTextElements = document.querySelectorAll('[data-text-key]');
    const loreOverlay = document.getElementById('lore-intro-overlay');
    const titleScreenOverlay = document.getElementById('title-screen-overlay');
    const gameContainer = document.getElementById('game-container');
    const mainInterface = document.getElementById('main-interface');
    const introCharacterContainer = document.getElementById('intro-character-container');
    const introCharacterDialogue = document.getElementById('intro-character-dialogue');
    const introCharacterDialogueText = introCharacterDialogue.querySelector('p');
    const dialogueBubble = document.getElementById('dialogue-bubble');
    const dialogueBubbleText = dialogueBubble.querySelector('p');
    const floatingNumbersContainer = document.getElementById('floating-numbers-container');
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
    const mineBitsBtn = document.getElementById('mine-bits-btn');
    const debugCodeBtn = document.getElementById('debug-code-btn');
    const unstableCompileBtn = document.getElementById('unstable-compile-btn');
    const dataPacket = document.getElementById('data-packet');
    const debugPanel = document.getElementById('debug-panel');
    const codeLinesContainer = document.getElementById('code-lines');
    const debugResultText = document.getElementById('debug-result-text');
    const achievementToast = document.getElementById('achievement-toast');
    const achievementNameEl = achievementToast.querySelector('.achievement-name');
    const achievementsBtn = document.getElementById('achievements-btn');
    const achievementsOverlay = document.getElementById('achievements-overlay');
    const closeAchievementsBtn = document.getElementById('close-achievements-btn');
    const achievementsListContainer = document.getElementById('achievements-list');
    const loreFragmentOverlay = document.getElementById('lore-fragment-overlay');
    const loreFragmentText = document.getElementById('lore-fragment-text');
    const closeLoreBtn = document.getElementById('close-lore-btn');

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
        },
        stats: { gamesCreated: 0, totalBitsEarned: 0, hackersDefeated: 0 },
        unlockedAchievements: [],
        unlockedLoreIds: []
    };
    let gameState = {};
    let characterMessageTimeout;
    let lowEnergyMessageShown = false;
    
    // --- PERSISTENCE ---
    function saveGame() {
        localStorage.setItem('eg_game2_save', JSON.stringify(gameState));
    }

    function loadGame() {
        const savedGame = localStorage.getItem('eg_game2_save');
        let parsedGame = null;
        try { parsedGame = JSON.parse(savedGame); } catch (error) { console.error("Error parsing saved data:", error); }
        if (parsedGame && typeof parsedGame === 'object') {
            gameState = { ...defaultGameState, ...parsedGame, items: { ...defaultGameState.items, ...parsedGame.items }, stats: { ...defaultGameState.stats, ...parsedGame.stats } };
        } else {
            gameState = JSON.parse(JSON.stringify(defaultGameState));
        }
        lang = localStorage.getItem('eg_language') || 'es';
    }

    // --- UI FUNCTIONS ---
    function applyText() {
        lang = localStorage.getItem('eg_language') || 'es';
        allTextElements.forEach(el => {
            const key = el.dataset.textKey;
            if (game2Texts[key] && game2Texts[key][lang]) el.textContent = game2Texts[key][lang];
        });
    }
    
    function updateUI() {
        energyDisplay.textContent = `${gameState.energy} / ${gameState.maxEnergy}`;
        pcLevelDisplay.textContent = gameState.pcLevel;
        bpsDisplay.textContent = gameState.bitsPerSecond;
        bitsDisplay.textContent = Math.floor(gameState.bits);
        createGlitchBtn.disabled = gameState.pcLevel < 5;
    }

    function showCharacterMessage(messageKey, duration = 4000) {
        clearTimeout(characterMessageTimeout);
        const message = game2Texts[messageKey] ? game2Texts[messageKey][lang] : messageKey;
        dialogueBubbleText.textContent = message;
        dialogueBubble.classList.remove('hidden');
        characterMessageTimeout = setTimeout(() => { dialogueBubble.classList.add('hidden'); }, duration);
    }

    function createFloatingNumber(text, sourceElement, type) {
        const numberEl = document.createElement('span');
        numberEl.textContent = text;
        numberEl.className = `floating-number ${type}`;
        const rect = sourceElement.getBoundingClientRect();
        numberEl.style.left = `${rect.left + rect.width / 2}px`;
        numberEl.style.top = `${rect.top}px`;
        floatingNumbersContainer.appendChild(numberEl);
        setTimeout(() => { numberEl.remove(); }, 2000);
    }

    // --- INTRO SEQUENCE ---
    const delay = ms => new Promise(res => setTimeout(res, ms));
    async function showIntroDialogues() {
        const dialogues = game2Texts.introDialogues[lang];
        introCharacterDialogue.classList.remove('hidden');
        for (let i = 0; i < dialogues.length; i++) {
            introCharacterDialogueText.textContent = dialogues[i];
            if (i < dialogues.length - 1) await delay(4000);
        }
    }
    async function startIntroSequence() {
        gameContainer.classList.remove('hidden');
        titleScreenOverlay.classList.remove('hidden');
        await delay(4000);
        titleScreenOverlay.classList.add('hidden');
        introCharacterContainer.classList.remove('hidden');
        await delay(1000);
        await showIntroDialogues();
        introCharacterContainer.classList.add('fading-out');
        introCharacterDialogueText.textContent = game2Texts.dialogueFading[lang];
        await delay(2000);
        introCharacterContainer.classList.add('hidden');
        mainInterface.classList.remove('hidden');
        await delay(1000);
        showCharacterMessage('dialogueLanded', 5000);
        setTimeout(() => { showCharacterMessage('dialogueIsBackground', 6000); }, 5500);
        initializeGame();
    }
    function showGameDirectly() {
        loreOverlay.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        mainInterface.classList.remove('hidden');
        initializeGame();
    }

    // --- LORE & ACHIEVEMENT SYSTEMS ---
    const ALL_LORE_FRAGMENTS = ['lore_1', 'lore_2', 'lore_3', 'lore_4', 'lore_5'];
    function tryToFindLore() {
        if (Math.random() < 0.15) {
            const availableLore = ALL_LORE_FRAGMENTS.filter(id => !gameState.unlockedLoreIds.includes(id));
            if (availableLore.length > 0) {
                const foundLoreId = availableLore[0];
                gameState.unlockedLoreIds.push(foundLoreId);
                showLoreFragment(foundLoreId);
                saveGame();
            }
        }
    }
    function showLoreFragment(loreId) {
        loreFragmentText.textContent = game2Texts[loreId][lang];
        loreFragmentOverlay.classList.remove('hidden');
    }
    closeLoreBtn.addEventListener('click', () => loreFragmentOverlay.classList.add('hidden'));

    const ALL_ACHIEVEMENTS = {
        'firstGame': { nameKey: 'ach_firstGame_name', descKey: 'ach_firstGame_desc', dialogueKey: 'dialogue_ach_firstGame', check: (state) => state.stats.gamesCreated >= 1 },
        'magnate': { nameKey: 'ach_magnate_name', descKey: 'ach_magnate_desc', dialogueKey: 'dialogue_ach_magnate', check: (state) => state.stats.totalBitsEarned >= 1000 },
        'hackerSlayer': { nameKey: 'ach_hackerSlayer_name', descKey: 'ach_hackerSlayer_desc', dialogueKey: 'dialogue_ach_hackerSlayer', check: (state) => state.stats.hackersDefeated >= 5 },
        'maxLevel': { nameKey: 'ach_maxLevel_name', descKey: 'ach_maxLevel_desc', dialogueKey: 'dialogue_ach_maxLevel', check: (state) => state.pcLevel >= 5 }
    };
    function checkAchievements() {
        for (const id in ALL_ACHIEVEMENTS) {
            if (!gameState.unlockedAchievements.includes(id)) {
                if (ALL_ACHIEVEMENTS[id].check(gameState)) unlockAchievement(id);
            }
        }
    }
    function unlockAchievement(id) {
        gameState.unlockedAchievements.push(id);
        const achievement = ALL_ACHIEVEMENTS[id];
        achievementNameEl.textContent = game2Texts[achievement.nameKey][lang];
        achievementToast.classList.add('show');
        setTimeout(() => { achievementToast.classList.remove('show'); }, 4000);
        showCharacterMessage(achievement.dialogueKey, 7000);
    }
    function renderAchievementsList() {
        achievementsListContainer.innerHTML = '';
        for (const id in ALL_ACHIEVEMENTS) {
            const achievement = ALL_ACHIEVEMENTS[id];
            const isUnlocked = gameState.unlockedAchievements.includes(id);
            const itemDiv = document.createElement('div');
            itemDiv.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
            itemDiv.innerHTML = isUnlocked ? `<p class="achievement-item-name">🏆 ${game2Texts[achievement.nameKey][lang]}</p><p class="achievement-item-desc">${game2Texts[achievement.descKey][lang]}</p>` : `<p class="achievement-item-name">🔒 ???</p>`;
            achievementsListContainer.appendChild(itemDiv);
        }
    }
    achievementsBtn.addEventListener('click', () => { renderAchievementsList(); achievementsOverlay.classList.remove('hidden'); });
    closeAchievementsBtn.addEventListener('click', () => achievementsOverlay.classList.add('hidden'));

    // --- GAME LOGIC ---
    function addBits(amount, sourceElement) {
        gameState.bits += amount;
        gameState.stats.totalBitsEarned += amount;
        if (sourceElement && amount > 0) createFloatingNumber(`+${Math.floor(amount)}`, sourceElement, 'gain');
        checkAchievements();
    }
    function initializeGame() {
        setInterval(() => {
            if (gameState.bitsPerSecond > 0) { addBits(gameState.bitsPerSecond, bpsDisplay); updateUI(); saveGame(); }
            if (gameState.energy < 20 && !lowEnergyMessageShown) { showCharacterMessage('dialogueLowEnergy', 4000); lowEnergyMessageShown = true; }
            else if (gameState.energy >= 20) { lowEnergyMessageShown = false; }
        }, 1000);
        setInterval(() => {
            const isPlayerBusy = !minigamePanel.classList.contains('hidden') || !hackerMinigamePanel.classList.contains('hidden') || !shopOverlay.classList.contains('hidden') || !debugPanel.classList.contains('hidden') || !loreFragmentOverlay.classList.contains('hidden');
            if (!isPlayerBusy && gameState.energy > 0) {
                const rand = Math.random();
                if (rand < 0.10) startHackerFight();
                else if (rand < 0.18) spawnDataPacket();
            }
        }, 10000);
        updateUI();
    }
    
    // --- ACTIONS ---
    let gameProgress = 0;
    function disableAllActions(state = true) { document.querySelectorAll('#actions-panel button, .header-btn').forEach(b => b.disabled = state); }
    createGameBtn.addEventListener('click', (e) => {
        const energyCost = gameState.items.cooler.owned ? 15 : 20;
        if (gameState.energy < energyCost) { showCharacterMessage('noEnergy'); return; }
        gameState.energy -= energyCost; gameProgress = 0; progressBarFill.style.width = '0%';
        createFloatingNumber(`-${energyCost}`, e.currentTarget, 'loss');
        minigamePanel.classList.remove('hidden'); debugPanel.classList.add('hidden'); hackerMinigamePanel.classList.add('hidden');
        disableAllActions(); updateUI();
    });
    tapBtn.addEventListener('click', () => {
        gameProgress += (5 + gameState.pcLevel);
        progressBarFill.style.width = `${Math.min(gameProgress, 100)}%`;
        if (gameProgress >= 100) {
            let bitsEarned = 50 + (gameState.pcLevel * 10);
            if (gameState.items.ram.owned) bitsEarned *= 1.5;
            addBits(bitsEarned, minigamePanel); gameState.stats.gamesCreated++; checkAchievements();
            showCharacterMessage('gameCreated');
            minigamePanel.classList.add('hidden');
            disableAllActions(false); updateUI(); saveGame();
            tryToFindLore();
        }
    });
    eatBtn.addEventListener('click', (e) => {
        if (gameState.energy >= gameState.maxEnergy) { showCharacterMessage('fullEnergy'); return; }
        if (gameState.bits < 5) { showCharacterMessage('noBits'); return; }
        gameState.bits -= 5;
        createFloatingNumber(`+15`, energyDisplay, 'gain');
        gameState.energy = Math.min(gameState.maxEnergy, gameState.energy + 15);
        showCharacterMessage('ateFood'); updateUI(); saveGame();
    });
    mineBitsBtn.addEventListener('click', (e) => {
        const energyCost = 10;
        if (gameState.energy < energyCost) { showCharacterMessage('noEnergy'); return; }
        gameState.energy -= energyCost; updateUI(); showCharacterMessage('dialogueMineBits', 5000);
        createFloatingNumber(`-${energyCost}`, e.currentTarget, 'loss');
        disableAllActions();
        setTimeout(() => {
            addBits(20 + (gameState.pcLevel * 5), e.currentTarget);
            showCharacterMessage('miningSuccess');
            disableAllActions(false); updateUI(); saveGame();
        }, 3000);
    });
    unstableCompileBtn.addEventListener('click', (e) => {
        const energyCost = 40;
        if (gameState.energy < energyCost) { showCharacterMessage('noEnergy'); return; }
        gameState.energy -= energyCost; updateUI(); showCharacterMessage('dialogueUnstableCompile', 6000);
        createFloatingNumber(`-${energyCost}`, e.currentTarget, 'loss');
        disableAllActions();
        setTimeout(() => {
            if (Math.random() < 0.25) { addBits(500, e.currentTarget); showCharacterMessage('compileSuccess'); }
            else { gameState.energy = Math.max(0, gameState.energy - 20); createFloatingNumber(`-20`, energyDisplay, 'loss'); showCharacterMessage('compileFail'); }
            disableAllActions(false); updateUI(); saveGame();
        }, 3000);
    });
    
    // --- DEBUG MINIGAME ---
    let correctLineIndex; const baseCodeLine = "return (user.bits > price);";
    debugCodeBtn.addEventListener('click', (e) => {
        const energyCost = 25;
        if (gameState.energy < energyCost) { showCharacterMessage('noEnergy'); return; }
        if (gameState.bits < 50) { showCharacterMessage('noBits'); return; }
        gameState.energy -= energyCost; gameState.bits -= 50;
        createFloatingNumber(`-${energyCost}`, e.currentTarget, 'loss');
        updateUI(); showCharacterMessage('dialogueDebugCode', 6000);
        debugPanel.classList.remove('hidden'); minigamePanel.classList.add('hidden'); hackerMinigamePanel.classList.add('hidden');
        disableAllActions(); debugResultText.textContent = ''; generateDebugPuzzle();
    });
    function generateDebugPuzzle() {
        codeLinesContainer.innerHTML = '';
        const lines = []; const errors = [';', '>', '=', '(', ')', 'user', 'bits', 'price'];
        correctLineIndex = Math.floor(Math.random() * 4);
        for (let i = 0; i < 4; i++) {
            let lineText = (i === correctLineIndex) ? baseCodeLine : baseCodeLine.replace(errors[Math.floor(Math.random() * errors.length)], "x#@!?"[Math.floor(Math.random() * 5)]);
            lines.push(lineText);
        }
        lines.forEach((line, index) => {
            const lineDiv = document.createElement('div'); lineDiv.className = 'code-line';
            lineDiv.textContent = `0${index + 1}  ${line}`;
            lineDiv.addEventListener('click', (e) => checkDebugAnswer(index, e.currentTarget), { once: true });
            codeLinesContainer.appendChild(lineDiv);
        });
    }
    function checkDebugAnswer(selectedIndex, sourceElement) {
        if (selectedIndex === correctLineIndex) { addBits(150, sourceElement); debugResultText.textContent = game2Texts.debugSuccess[lang]; tryToFindLore(); }
        else { debugResultText.textContent = game2Texts.debugFail[lang]; }
        document.querySelectorAll('.code-line').forEach(line => line.style.pointerEvents = 'none');
        setTimeout(() => { debugPanel.classList.add('hidden'); disableAllActions(false); updateUI(); saveGame(); }, 2500);
    }

    // --- POSITIVE EVENT & HACKER MINIGAME ---
    function spawnDataPacket() {
        showCharacterMessage('dialogueDataPacket', 4000);
        dataPacket.style.left = `${Math.random() * (window.innerWidth - 60) + 10}px`;
        dataPacket.style.top = `${Math.random() * (window.innerHeight - 200) + 10}px`;
        dataPacket.classList.remove('hidden');
        const onPacketClick = () => { addBits(50 + Math.floor(Math.random() * 50), dataPacket); dataPacket.classList.add('hidden'); updateUI(); saveGame(); };
        dataPacket.addEventListener('click', onPacketClick, { once: true });
        setTimeout(() => { if (!dataPacket.classList.contains('hidden')) dataPacket.classList.add('hidden'); }, 7000);
    }
    let playerProgress, hackerProgress, hackerInterval;
    function startHackerFight() {
        gameState.energy -= 1; showCharacterMessage('hackerAppears', 4000);
        playerProgress = 0; hackerProgress = 0;
        playerProgressBarFill.style.width = '0%'; hackerProgressBarFill.style.width = '0%';
        hackerResultText.textContent = '';
        minigamePanel.classList.add('hidden'); debugPanel.classList.add('hidden'); hackerMinigamePanel.classList.remove('hidden');
        disableAllActions(); hackerTapBtn.disabled = false; hackerCloseBtn.classList.add('hidden');
        const hackerSpeed = Math.max(0.5, 2 - (gameState.pcLevel * 0.1));
        hackerInterval = setInterval(() => {
            hackerProgress += hackerSpeed;
            hackerProgressBarFill.style.width = `${Math.min(hackerProgress, 100)}%`;
            if (hackerProgress >= 100) endHackerFight(false);
        }, 50);
        updateUI();
    }
    hackerTapBtn.addEventListener('click', () => {
        playerProgress += 3 + (gameState.pcLevel * 0.5);
        playerProgressBarFill.style.width = `${Math.min(playerProgress, 100)}%`;
        if (playerProgress >= 100) endHackerFight(true);
    });
    function endHackerFight(playerWon) {
        clearInterval(hackerInterval); hackerTapBtn.disabled = true; hackerCloseBtn.classList.remove('hidden');
        if (playerWon) {
            addBits(30, hackerMinigamePanel); gameState.stats.hackersDefeated++; checkAchievements();
            hackerResultText.textContent = game2Texts.hackerWin[lang];
        } else {
            createFloatingNumber('-25', energyDisplay, 'loss');
            gameState.energy = Math.max(0, gameState.energy - 25);
            hackerResultText.textContent = game2Texts.hackerLoss[lang];
        }
        updateUI(); saveGame();
    }
    hackerCloseBtn.addEventListener('click', () => { hackerMinigamePanel.classList.add('hidden'); disableAllActions(false); updateUI(); });
    
    // --- GLITCH & SHOP ---
    function triggerGlitchEffect() {
        if (gameState.bits < GLITCH_COST_BITS || gameState.energy < GLITCH_COST_ENERGY) { showCharacterMessage('glitchNoResources'); return; }
        
        // Inicia la secuencia de Glitch
        disableAllActions();
        createFloatingNumber(`-${GLITCH_COST_ENERGY}`, energyDisplay, 'loss');
        gameState.bits -= GLITCH_COST_BITS; gameState.energy -= GLITCH_COST_ENERGY;
        saveGame(); updateUI(); showCharacterMessage('glitchTriggered');
        
        if(glitchSound) {
            glitchSound.loop = true; // El sonido se repetirá para más caos
            glitchSound.volume = localStorage.getItem('eg_sfxVolume') || 1.0;
            glitchSound.play();
        }

        // 1. Glitch de la interfaz principal
        mainInterface.classList.add('glitching');
        
        // 2. Aparece el overlay final después de un momento
        setTimeout(() => {
            glitchOverlay.classList.remove('hidden');
        }, 500);

        // 3. Redirige después de que todo termine
        setTimeout(() => {
            window.location.href = 'game3.html';
        }, 3500);
    }
    createGlitchBtn.addEventListener('click', triggerGlitchEffect);
    shopBtn.addEventListener('click', () => { renderShop(); shopOverlay.classList.remove('hidden'); });
    closeShopBtn.addEventListener('click', () => { shopOverlay.classList.add('hidden'); });
    function renderShop() {
        shopItemsContainer.innerHTML = '';
        const pcCost = 50 * Math.pow(2, gameState.pcLevel);
        const pcItem = document.createElement('div'); pcItem.className = 'shop-item';
        pcItem.innerHTML = `<span>${game2Texts.improvePC[lang]} ${gameState.pcLevel + 1}</span>`;
        const pcButton = document.createElement('button'); pcButton.textContent = `${pcCost} Bits`;
        pcButton.disabled = gameState.bits < pcCost;
        pcButton.addEventListener('click', () => buyItem('pc'));
        pcItem.appendChild(pcButton); shopItemsContainer.appendChild(pcItem);
        for (const key in gameState.items) {
            const item = gameState.items[key];
            if (!item.owned) {
                const shopItem = document.createElement('div'); shopItem.className = 'shop-item';
                let desc = game2Texts[`buy${key.charAt(0).toUpperCase() + key.slice(1)}`] ? game2Texts[`buy${key.charAt(0).toUpperCase() + key.slice(1)}`][lang] : key;
                if(item.energyBonus) desc += ` (+${item.energyBonus} E. Máx)`;
                if(key === 'cooler') desc += ` (Reduce coste ⚡)`;
                if(key === 'ram') desc += ` (+50% Bits)`;
                if(key === 'autoclicker') desc += ` (+5 Bits/s)`;
                shopItem.innerHTML = `<span>${desc}</span>`;
                const itemButton = document.createElement('button'); itemButton.textContent = `${item.cost} Bits`;
                itemButton.disabled = gameState.bits < item.cost;
                itemButton.addEventListener('click', () => buyItem(key));
                shopItem.appendChild(itemButton); shopItemsContainer.appendChild(shopItem);
            }
        }
    }
    function buyItem(itemId) {
        if (itemId === 'pc') {
            const cost = 50 * Math.pow(2, gameState.pcLevel);
            if (gameState.bits >= cost) { gameState.bits -= cost; gameState.pcLevel++; checkAchievements(); }
        } else {
            const item = gameState.items[itemId];
            if (gameState.bits >= item.cost && !item.owned) {
                gameState.bits -= item.cost; item.owned = true;
                if (item.energyBonus) { 
                    createFloatingNumber(`+${item.energyBonus}`, energyDisplay, 'gain');
                    gameState.maxEnergy += item.energyBonus; 
                    gameState.energy = gameState.maxEnergy; 
                }
                if (item.effect) item.effect();
                switch (itemId) {
                    case 'silla': showCharacterMessage('dialogueBuyChair'); break;
                    case 'cama': showCharacterMessage('dialogueBuyBed'); break;
                    case 'cooler': showCharacterMessage('dialogueBuyCooler'); break;
                }
            }
        }
        if (gameState.pcLevel >= 5 && createGlitchBtn.disabled) showCharacterMessage('glitchReady');
        updateUI(); renderShop(); saveGame();
    }

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
    checkAchievements();
});