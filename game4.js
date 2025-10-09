document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const gameContainer = document.getElementById('game-container');
    const moneyDisplay = document.getElementById('money-display');
    const handsDisplay = document.getElementById('hands-display');
    const discardsDisplay = document.getElementById('discards-display');
    const roundDisplay = document.getElementById('round-display');
    const currentHandScoreDisplay = document.getElementById('current-hand-score');
    const totalScoreDisplay = document.getElementById('total-score');
    const targetScoreDisplay = document.getElementById('target-score');
    const manoJugadorContainer = document.getElementById('mano-jugador');
    const cartasJugadasContainer = document.getElementById('cartas-jugadas-container');
    const playHandBtn = document.getElementById('play-hand-btn');
    const discardHandBtn = document.getElementById('discard-hand-btn');
    const handNameDisplay = document.getElementById('hand-name-display').querySelector('p');
    const modificadoresList = document.getElementById('modificadores-list');
    const sortByRankBtn = document.getElementById('sort-by-rank-btn');
    const sortBySuitBtn = document.getElementById('sort-by-suit-btn');
    const characterDialogueBubble = document.getElementById('character-dialogue-bubble');
    const instructionsBtn = document.getElementById('instructions-btn');
    const instructionsOverlay = document.getElementById('instructions-overlay');
    const closeInstructionsBtn = document.getElementById('close-instructions-btn');
    const instructionsTableBody = document.getElementById('instructions-table-body');
    const loreOverlay = document.getElementById('lore-overlay');
    const loreFragmentText = document.getElementById('lore-fragment-text');
    const closeLoreBtn = document.getElementById('close-lore-btn');
    const introOverlay = document.getElementById('intro-overlay');
    const introDialogueBox = document.getElementById('intro-dialogue-box');
    const introDialogue = document.getElementById('intro-dialogue');
    const introContinueBtn = document.getElementById('intro-continue-btn');
    const cinematicOverlay = document.getElementById('cinematic-overlay');
    const shopOverlay = document.getElementById('shop-overlay');
    const shopItemsContainer = document.getElementById('shop-items');
    const shopContinueBtn = document.getElementById('shop-continue-btn');
    const winOverlay = document.getElementById('win-overlay');
    const playAgainBtn = document.getElementById('play-again-btn');

    // --- ESTADO DEL JUEGO ---
    let gameState = {};
    let selectedCards = [];
    const activeSlot = localStorage.getItem('eg_active_slot');
    const maxRounds = 5;

    // --- DATOS DEL JUEGO ---
    const HAND_TYPES = {
        STRAIGHT_FLUSH: { name: 'Escalera de Color', desc: 'Cinco cartas consecutivas del mismo palo.', example: '<code>5♥ 6♥ 7♥ 8♥ 9♥</code>', baseChips: 100, baseMult: 10 },
        FOUR_OF_A_KIND: { name: 'Póker', desc: 'Cuatro cartas del mismo valor.', example: '<code>A♠ A♥ A♦ A♣</code>', baseChips: 60, baseMult: 8 },
        FULL_HOUSE: { name: 'Full House', desc: 'Un trío y un par.', example: '<code>K♠ K♥ K♦ 9♣ 9♥</code>', baseChips: 40, baseMult: 7 },
        FLUSH: { name: 'Color', desc: 'Cinco cartas del mismo palo.', example: '<code>2♦ 5♦ 8♦ J♦ K♦</code>', baseChips: 35, baseMult: 4 },
        STRAIGHT: { name: 'Escalera', desc: 'Cinco cartas de valores consecutivos.', example: '<code>7♠ 8♥ 9♦ T♣ J♥</code>', baseChips: 40, baseMult: 5 },
        THREE_OF_A_KIND: { name: 'Trío', desc: 'Tres cartas del mismo valor.', example: '<code>Q♠ Q♥ Q♦</code>', baseChips: 30, baseMult: 4 },
        TWO_PAIR: { name: 'Doble Par', desc: 'Dos pares de cartas.', example: '<code>J♠ J♣ 4♥ 4♦</code>', baseChips: 20, baseMult: 3 },
        PAIR: { name: 'Par', desc: 'Dos cartas del mismo valor.', example: '<code>T♠ T♥</code>', baseChips: 10, baseMult: 2 },
        HIGH_CARD: { name: 'Carta Alta', desc: 'Cualquier otra mano.', example: '<code>A♠</code>', baseChips: 5, baseMult: 1 },
    };

    const MODIFICADORES_POOL = [
        { id: 1, name: "Chip Roto", desc: "+15 Puntos base", baseDesc: "+{v} Puntos base", cost: 8, baseCost: 8, type: 'chip', value: 15, baseValue: 15 },
        { id: 2, name: "Multiplicador Glitch", desc: "+2 Multiplicador", baseDesc: "+{v} Multiplicador", cost: 10, baseCost: 10, type: 'mult', value: 2, baseValue: 2 },
        { id: 3, name: "Par Aumentado", desc: "Pares dan x2 Mult", baseDesc: "Pares dan x{v} Mult", cost: 12, baseCost: 12, type: 'hand_mult', hand: 'PAIR', value: 2, baseValue: 2 },
        { id: 4, name: "Fuente de Datos", desc: "Ganas $4/ronda", baseDesc: "Ganas ${v}/ronda", cost: 10, baseCost: 10, type: 'passive_income', value: 4, baseValue: 4 },
        { id: 5, name: "Conector Lógico", desc: "+25 Pts base/Escaleras", baseDesc: "+{v} Pts base/Escaleras", cost: 15, baseCost: 15, type: 'hand_chip', hand: 'STRAIGHT', value: 25, baseValue: 25 }
    ];
    
    const DIALOGUE_POOL = {
        startRound: ["Espera... ¿cartas? ¿Dónde está mi espada?", "¿Qué son estas reglas? ¿'Full House'?", "Tengo que seguir jugando... sea lo que sea 'esto'.", "Siento al Administrador... disfruta con este cambio.", "De acuerdo, si tengo que ganar al póker para sobrevivir, que así sea."],
        bigHand: ["¡JA! ¡Toma eso, sistema!", "¡No sé qué he hecho, pero ha funcionado!", "Parece que le estoy cogiendo el truco a esto.", "Cada vez entiendo menos, pero gano más. Me vale."],
        shop: ["Veamos qué basura vende el sistema...", "¿Puedo corromper estos datos a mi favor?", "Necesito una ventaja. Cualquiera."],
        noMoney: ["Datos insuficientes. Maldita sea.", "No puedo permitirme ni un fallo de sistema.", "Vacío... como mi antiguo inventario."],
        // NUEVO: Diálogo para las instrucciones
        instructionsQuestion: ["¿Y ese signo de interrogación? ¿Serán las instrucciones de este... 'juego'?", "Me pregunto qué reglas retorcidas tendrá este sitio."]
    };
    
    const LORE_FRAGMENTS = ["Fragmento 7: El Administrador no es un programa. Es una conciencia atrapada que se volvió loca. Ahora, nos atrapa a nosotros.", "Fragmento 8: Este 'juego de cartas' es un sistema de purga de datos. Las 'manos' que jugamos son exploits que dañan su núcleo.", "Fragmento 9: Los 'Jokers' como tú son el virus original. Anomalías que el sistema no puede borrar y que, en cambio, intenta contener en estos juegos.", "Fragmento 10: Cada vez que 'ganamos', no escapamos. Solo forzamos un reinicio a una simulación más compleja. La única salida es un colapso total."];
    
    const SUITS = ['♦', '♣', '♥', '♠'];
    const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
    const RANK_VALUES = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

    // --- LÓGICA DE GUARDADO Y CARGA ---
    function saveGame() {
        if (activeSlot === null) return;
        try {
            let masterState = JSON.parse(localStorage.getItem('eg_current_game_state'));
            if (!masterState) masterState = {};

            masterState.current_game = 'game4';
            masterState.game4_data = gameState;

            localStorage.setItem('eg_current_game_state', JSON.stringify(masterState));

            let allSlots = JSON.parse(localStorage.getItem('eg_saveSlots'));
            if (allSlots && allSlots[activeSlot] !== undefined) {
                allSlots[activeSlot] = masterState;
                localStorage.setItem('eg_saveSlots', JSON.stringify(allSlots));
            }
        } catch (e) {
            console.error("Error guardando el juego:", e);
        }
    }
    
    function initNewGame() {
        gameState = {
            deck: [], hand: [], money: 10, handsRemaining: 4, discardsRemaining: 3,
            round: 1, targetScore: 100, currentScore: 0, playerModifiers: {}, collectedLore: [],
            instructionsDialogueShown: false // Flag para el nuevo diálogo
        };
    }

    function loadGame() {
        const defaultGameState = {
            deck: [], hand: [], money: 10, handsRemaining: 4, discardsRemaining: 3,
            round: 1, targetScore: 100, currentScore: 0, playerModifiers: {}, collectedLore: [],
            instructionsDialogueShown: false
        };
        if (activeSlot === null) {
            gameState = defaultGameState;
            return false;
        }
        try {
            const masterState = JSON.parse(localStorage.getItem('eg_current_game_state'));
            if (masterState && masterState.game4_data) {
                gameState = { ...defaultGameState, ...masterState.game4_data };
                return true;
            }
        } catch (e) {
            console.error("Error al cargar, iniciando nueva partida:", e);
        }
        initNewGame();
        return false;
    }


    // --- LÓGICA DE UI E INSTRUCCIONES ---
    function populateInstructions() {
        instructionsTableBody.innerHTML = '';
        for (const key in HAND_TYPES) {
            const handInfo = HAND_TYPES[key];
            const row = document.createElement('tr');
            row.innerHTML = `<td>${handInfo.name}</td><td>${handInfo.desc}</td><td>${handInfo.example}</td>`;
            instructionsTableBody.appendChild(row);
        }
    }

    function createDeck() { gameState.deck = []; SUITS.forEach(s => RANKS.forEach(r => gameState.deck.push({ rank: r, suit: s, value: RANK_VALUES[r] }))); }
    function shuffleDeck() { for (let i = gameState.deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]]; } }

    function drawCards(num) {
        for (let i = 0; i < num; i++) {
            if (gameState.deck.length === 0) { createDeck(); shuffleDeck(); }
            if (gameState.hand.length < 8) { gameState.hand.push(gameState.deck.pop()); }
        }
        renderHand();
    }
    
    function sortHandByRank() { gameState.hand.sort((a, b) => a.value - b.value); renderHand(); saveGame(); }
    function sortHandBySuit() { gameState.hand.sort((a, b) => SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit) || a.value - b.value); renderHand(); saveGame(); }
    
    function showCharacterDialogue(type) {
        const pool = DIALOGUE_POOL[type];
        characterDialogueBubble.textContent = pool[Math.floor(Math.random() * pool.length)];
        // Reinicia la animación
        characterDialogueBubble.style.animation = 'none';
        characterDialogueBubble.offsetHeight; /* trigger reflow */
        characterDialogueBubble.style.animation = null; 
        characterDialogueBubble.classList.remove('hidden');
    }

    function evaluateHand(cards) {
        if (cards.length === 0) return null;
        if (cards.length === 1) return HAND_TYPES.HIGH_CARD;
        cards.sort((a, b) => a.value - b.value);
        const rankCounts = cards.reduce((acc, c) => { acc[c.rank] = (acc[c.rank] || 0) + 1; return acc; }, {});
        const suitCounts = cards.reduce((acc, c) => { acc[c.suit] = (acc[c.suit] || 0) + 1; return acc; }, {});
        const counts = Object.values(rankCounts);
        const isFlush = Object.keys(suitCounts).length === 1;
        const values = cards.map(c => c.value);
        const isStraight = values.every((v, i) => i === 0 || v === values[i-1] + 1);
        for (const key in HAND_TYPES) {
            if (key === 'STRAIGHT_FLUSH' && isStraight && isFlush) return HAND_TYPES[key];
            if (key === 'FOUR_OF_A_KIND' && counts.includes(4)) return HAND_TYPES[key];
            if (key === 'FULL_HOUSE' && counts.includes(3) && counts.includes(2)) return HAND_TYPES[key];
            if (key === 'FLUSH' && isFlush) return HAND_TYPES[key];
            if (key === 'STRAIGHT' && isStraight) return HAND_TYPES[key];
            if (key === 'THREE_OF_A_KIND' && counts.includes(3)) return HAND_TYPES[key];
            if (key === 'TWO_PAIR' && counts.filter(c => c === 2).length === 2) return HAND_TYPES[key];
            if (key === 'PAIR' && counts.includes(2)) return HAND_TYPES[key];
        }
        return HAND_TYPES.HIGH_CARD;
    }

    function runIntro() {
        introOverlay.classList.remove('hidden');
        const dialogues = ["El universo se colapsa de nuevo...", "Ya no hay un cuerpo, ni un arma... solo esta mesa. Y estas... cartas.", "Las reglas han cambiado. Sobrevive al juego."];
        let i = 0;
        introDialogue.textContent = dialogues[i];
        const nextDialogue = () => {
            i++;
            if (i < dialogues.length) { introDialogue.textContent = dialogues[i]; } 
            else { introContinueBtn.classList.remove('hidden'); introOverlay.removeEventListener('click', nextDialogue); }
        };
        introOverlay.addEventListener('click', nextDialogue);
        introContinueBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            introDialogueBox.classList.add('hidden');
            cinematicOverlay.classList.remove('hidden');
            setTimeout(() => {
                localStorage.setItem('eg_game4_intro_completed', 'true');
                introOverlay.classList.add('hidden');
                cinematicOverlay.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                initNewGame();
                startGame();
            }, 4000);
        });
    }

    function startGame() {
        startRound();
        setInterval(saveGame, 3000); // Guardado periódico
    }

    function startRound() {
        gameState.currentScore = 0;
        gameState.handsRemaining = 4;
        gameState.discardsRemaining = 3;
        gameState.targetScore = 100 + (gameState.round * 80);
        gameState.hand = [];
        selectedCards = [];
        createDeck();
        shuffleDeck();
        drawCards(8);
        currentHandScoreDisplay.textContent = 0;
        handNameDisplay.textContent = '--';
        if (Math.random() < 0.6) { showCharacterDialogue('startRound'); }

        // NUEVO: Diálogo de las instrucciones
        if (!gameState.instructionsDialogueShown) {
            setTimeout(() => showCharacterDialogue('instructionsQuestion'), 2000);
            gameState.instructionsDialogueShown = true;
        }

        updateUI();
        saveGame();
    }
    
    function playHand() {
        if (selectedCards.length === 0 || gameState.handsRemaining <= 0) return;
        const handInfo = evaluateHand(selectedCards);
        if (!handInfo) return;
        showPlayedCardAnimation(selectedCards);
        let chips = handInfo.baseChips || 0;
        let mult = handInfo.baseMult || 1;
        for (const modId in gameState.playerModifiers) {
            const mod = gameState.playerModifiers[modId];
            if (mod.type === 'chip') chips += mod.value;
            if (mod.type === 'mult') mult += mod.value;
            if (mod.type === 'hand_chip' && handInfo.name === (HAND_TYPES[mod.hand] || {}).name) chips += mod.value;
            if (mod.type === 'hand_mult' && handInfo.name === (HAND_TYPES[mod.hand] || {}).name) mult += mod.value;
        }
        if (handInfo.baseMult >= 7 && Math.random() < 0.5) { showCharacterDialogue('bigHand'); }
        const score = chips * mult;
        gameState.currentScore += score;
        gameState.handsRemaining--;
        gameState.hand = gameState.hand.filter(card => !selectedCards.find(sc => sc.rank === card.rank && sc.suit === card.suit));
        drawCards(selectedCards.length);
        selectedCards = [];
        currentHandScoreDisplay.textContent = score;
        handNameDisplay.textContent = handInfo.name;
        updateUI();
        if (gameState.currentScore >= gameState.targetScore) { setTimeout(() => endRound(true), 1600); } 
        else if (gameState.handsRemaining <= 0) { setTimeout(() => endRound(false), 1600); }
        saveGame();
    }

    function discardHand() {
        if (selectedCards.length === 0 || gameState.discardsRemaining <= 0) return;
        gameState.discardsRemaining--;
        gameState.hand = gameState.hand.filter(card => !selectedCards.find(sc => sc.rank === card.rank && sc.suit === card.suit));
        drawCards(selectedCards.length);
        selectedCards = [];
        handNameDisplay.textContent = '--';
        updateUI();
        saveGame();
    }
    
    function endRound(win) {
        if (win) {
            if (gameState.round >= maxRounds) { showWinScreen(); return; }
            checkForLoreDrop();
            let moneyEarned = 10 + gameState.round * 2;
            for (const modId in gameState.playerModifiers) { if (gameState.playerModifiers[modId].type === 'passive_income') moneyEarned += gameState.playerModifiers[modId].value; }
            gameState.money += moneyEarned;
            gameState.round++;
            setTimeout(showShop, loreOverlay.classList.contains('hidden') ? 1000 : 3500);
        } else {
            alert("Has sido purgado. Reiniciando secuencia...");
            localStorage.removeItem('eg_game4_state');
            localStorage.removeItem('eg_game4_intro_completed'); // Para ver la intro de nuevo
            initNewGame(); // Resetea el estado
            saveGame(); // Guarda el estado reseteado
            location.reload();
        }
        saveGame();
    }

    function showShop() {
        if (Math.random() < 0.6) showCharacterDialogue('shop');
        shopItemsContainer.innerHTML = '';
        const items = [];
        const pool = [...MODIFICADORES_POOL];
        for(let i=0; i < 3; i++) { if(pool.length === 0) break; const idx = Math.floor(Math.random() * pool.length); items.push(pool.splice(idx, 1)[0]); }
        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'shop-item';
            const owned = gameState.playerModifiers[item.id];
            const cost = owned ? owned.cost : item.baseCost;
            const type = owned ? 'Mejorar' : 'Comprar';
            itemEl.innerHTML = `<h3>${item.name}</h3><p>${owned ? owned.desc : item.desc}</p><p class="cost">$${cost}</p><span class="purchase-type">${type}</span>`;
            if (gameState.money < cost) { itemEl.style.opacity = '0.5'; itemEl.style.cursor = 'not-allowed'; } 
            else { itemEl.addEventListener('click', () => buyItem(item, itemEl, cost)); }
            shopItemsContainer.appendChild(itemEl);
        });
        shopOverlay.classList.remove('hidden');
    }
    
    function showWinScreen() { 
        // Limpia los datos de este juego específico de la partida guardada
        const masterState = JSON.parse(localStorage.getItem('eg_current_game_state'));
        if (masterState) {
            masterState.game4_data = null;
            // Podríamos decidir a dónde va después, por ahora solo mostramos la pantalla de victoria
            localStorage.setItem('eg_current_game_state', JSON.stringify(masterState));
        }
        winOverlay.classList.remove('hidden'); 
    }

    function buyItem(item, element, cost) {
        if (gameState.money >= cost) {
            gameState.money -= cost;
            if (gameState.playerModifiers[item.id]) {
                const mod = gameState.playerModifiers[item.id];
                mod.level = (mod.level || 1) + 1;
                mod.value += mod.baseValue;
                mod.cost = Math.floor(mod.cost * 1.8);
                mod.desc = mod.baseDesc.replace('{v}', mod.value).replace('${v}', mod.value);
            } else {
                gameState.playerModifiers[item.id] = { ...item, level: 1, cost: Math.floor(item.baseCost * 1.8) };
            }
            element.style.opacity = '0.3';
            element.style.pointerEvents = 'none';
            updateUI();
            saveGame();
        } else {
            showCharacterDialogue('noMoney');
        }
    }

    function checkForLoreDrop() {
        if (Math.random() < 0.35 && LORE_FRAGMENTS.length > gameState.collectedLore.length) {
            const available = LORE_FRAGMENTS.map((_, i) => i).filter(i => !gameState.collectedLore.includes(i));
            if (available.length > 0) {
                const loreIndex = available[Math.floor(Math.random() * available.length)];
                gameState.collectedLore.push(loreIndex);
                showLoreFragment(LORE_FRAGMENTS[loreIndex]);
            }
        }
    }

    function showLoreFragment(text) { loreFragmentText.textContent = text; loreOverlay.classList.remove('hidden'); }
    
    function renderHand() {
        manoJugadorContainer.innerHTML = '';
        gameState.hand.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.innerHTML = `<span class="rank">${card.rank}</span><span class="suit suit-${card.suit}">${card.suit}</span>`;
            if (selectedCards.find(sc => sc.rank === card.rank && sc.suit === card.suit)) { cardEl.classList.add('selected'); }
            cardEl.addEventListener('click', () => toggleCardSelection(card, cardEl));
            manoJugadorContainer.appendChild(cardEl);
        });
    }

    function toggleCardSelection(card, element) {
        const index = selectedCards.findIndex(sc => sc.rank === card.rank && sc.suit === card.suit);
        if (index > -1) { selectedCards.splice(index, 1); element.classList.remove('selected'); } 
        else if (selectedCards.length < 5) { selectedCards.push(card); element.classList.add('selected'); }
        const tempHandInfo = evaluateHand(selectedCards);
        handNameDisplay.textContent = tempHandInfo ? tempHandInfo.name : '--';
    }
    
    function showPlayedCardAnimation(cards) {
        cartasJugadasContainer.innerHTML = '';
        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card played-card-animation';
            cardEl.innerHTML = `<span class="rank">${card.rank}</span><span class="suit suit-${card.suit}">${card.suit}</span>`;
            cartasJugadasContainer.appendChild(cardEl);
        });
        setTimeout(() => cartasJugadasContainer.innerHTML = '', 1500);
    }
    
    function renderModifiers() {
        modificadoresList.innerHTML = '';
        for (const modId in gameState.playerModifiers) {
            const mod = gameState.playerModifiers[modId];
            const modEl = document.createElement('div');
            modEl.className = 'modificador';
            modEl.innerHTML = `<h4>${mod.name} (Nvl ${mod.level || 1})</h4><p>${mod.desc}</p>`;
            modificadoresList.appendChild(modEl);
        }
    }

    function updateUI() {
        moneyDisplay.textContent = gameState.money;
        handsDisplay.textContent = gameState.handsRemaining;
        discardsDisplay.textContent = gameState.discardsRemaining;
        roundDisplay.textContent = `${gameState.round} / ${maxRounds}`;
        totalScoreDisplay.textContent = gameState.currentScore;
        targetScoreDisplay.textContent = gameState.targetScore;
        playHandBtn.disabled = gameState.handsRemaining <= 0;
        discardHandBtn.disabled = gameState.discardsRemaining <= 0;
        renderModifiers();
    }

    // --- INICIALIZACIÓN ---
    populateInstructions();
    instructionsBtn.addEventListener('click', () => instructionsOverlay.classList.remove('hidden'));
    closeInstructionsBtn.addEventListener('click', () => instructionsOverlay.classList.add('hidden'));
    closeLoreBtn.addEventListener('click', () => { loreOverlay.classList.add('hidden'); showShop(); });
    playHandBtn.addEventListener('click', playHand);
    discardHandBtn.addEventListener('click', discardHand);
    sortByRankBtn.addEventListener('click', sortHandByRank);
    sortBySuitBtn.addEventListener('click', sortHandBySuit);
    shopContinueBtn.addEventListener('click', () => { shopOverlay.classList.add('hidden'); startRound(); });
    playAgainBtn.addEventListener('click', () => { 
        localStorage.removeItem('eg_game4_intro_completed'); 
        initNewGame(); // Resetea el estado
        saveGame(); // Guarda el estado reseteado
        location.reload(); 
    });

    loadGame();
    
    if (localStorage.getItem('eg_game4_intro_completed') !== 'true') {
        runIntro();
    } else {
        gameContainer.classList.remove('hidden');
        introOverlay.classList.add('hidden');
        cinematicOverlay.classList.add('hidden');
        startGame();
        updateUI();
        renderHand();
    }
});