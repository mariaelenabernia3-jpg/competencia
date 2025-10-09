document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const respawnOverlay = document.getElementById('respawn-overlay');
    const roundOverlay = document.getElementById('round-overlay');
    const roundText = document.getElementById('round-text');
    const playerDialogueBubble = document.getElementById('player-dialogue-bubble');
    const gameContainer = document.getElementById('game-container');
    const actionLog = document.getElementById('action-log');
    const dataDisplay = document.getElementById('data-display');
    const skillButtons = document.querySelectorAll('.skill-btn');
    const playerHpFill = document.getElementById('player-hp-fill');
    const playerHpText = document.getElementById('player-hp-text');
    const enemySprite = document.getElementById('enemy-sprite');
    const enemyName = document.getElementById('enemy-name');
    const enemyHpFill = document.getElementById('enemy-hp-fill');
    const enemyHpText = document.getElementById('enemy-hp-text');
    const enemyDisplayElement = document.getElementById('enemy-display');
    const floatingTextContainer = document.getElementById('floating-text-container');
    const glitchOverlay = document.getElementById('glitch-overlay');
    
    // Intros
    const preGameIntroContainer = document.getElementById('pre-game-intro');
    const preGameDialogue = document.getElementById('pre-game-dialogue');
    const preGameBtn = document.getElementById('pre-game-btn');
    const introSequenceContainer = document.getElementById('intro-sequence');
    const dialogueContainer = document.getElementById('dialogue-container');
    const glitchedContainer = document.getElementById('glitched-message-container');
    const cinematicContainer = document.getElementById('cinematic-container');
    const glitchSound = document.getElementById('glitch-sound');

    // Panel de Mejora en Muerte
    const deathUpgradeOverlay = document.getElementById('death-upgrade-overlay');
    const deathUpgradeOptionsContainer = document.getElementById('death-upgrade-options');
    const deathUpgradeContinueBtn = document.getElementById('death-upgrade-continue-btn');
    const deathUpgradeDataDisplay = document.getElementById('death-upgrade-data-display');

    // Diálogo del Jefe Final
    const dialogueOverlay = document.getElementById('dialogue-overlay');
    const dialogueSpeaker = document.getElementById('dialogue-speaker');
    const dialogueLine = document.getElementById('dialogue-line');
    const startFinalBattleBtn = document.getElementById('start-final-battle-btn');
    
    // --- VARIABLES DEL JUEGO ---
    let player, enemy, corruptData, wave, currentRound, upgrades, skills, collectedLore;
    let autoAttackInterval;
    let isCombatActive = true;
    let isFinalBossSequence = false;
    
    // --- ESTRUCTURA DE DATOS DEL JUEGO ---
    const allRoundsEnemies = [
        [ { name: "Slime de Datos", hp: 50, attack: 5, sprite: "imagenes/esqueleto-rpg.png", data: 15 }, { name: "Bug Compilado", hp: 80, attack: 8, sprite: "imagenes/esqueleto2-rpg.png", data: 25 }, { name: "Firewall Roto", hp: 120, attack: 12, sprite: "imagenes/esqueleto3-rpg.png", data: 40 }, { name: "GUARDIÁN DEL SISTEMA", hp: 300, attack: 20, sprite: "imagenes/guardiadelsistema1-rpg.png", data: 150 } ],
        [ { name: "Protocolo de Defensa Alfa", hp: 200, attack: 25, sprite: "imagenes/guardiadelsistema1-rpg.png", data: 50 }, { name: "Centinela de Red Beta", hp: 220, attack: 22, sprite: "imagenes/guardiadelsistema2-rpg.png", data: 60 }, { name: "Agente de Purga Gamma", hp: 180, attack: 28, sprite: "imagenes/guardiadelsistema3-rpg.png", data: 70 }, { name: "EL KERNEL CORRUPTO", hp: 500, attack: 35, sprite: "imagenes/jefedelsistema1.png", data: 300 } ],
        [ { name: "Eco Desvanecido", hp: 150, attack: 20, sprite: "imagenes/esqueleto-rpg.png", data: 40 }, { name: "Fragmento del Guardián", hp: 350, attack: 30, sprite: "imagenes/guardiadelsistema1-rpg.png", data: 80 }, { name: "Espejismo del Kernel", hp: 550, attack: 40, sprite: "imagenes/jefedelsistema1.png", data: 150 }, { name: "REFLEJO PROGRAMADO", hp: 700, attack: 50, sprite: "imagenes/personaje1-rpg.png", data: 500, hasHealed: false } ]
    ];
    
    const loreFragments = [
        "Fragmento 01: ...el 'Administrador' no creó este nexo. Lo encontró. Lo corrompió. Lo convirtió en su jaula...",
        "Fragmento 02: ...cada 'jugador' es una anomalía que logra conciencia. Él se alimenta de la desesperación cuando se dan cuenta de que no hay salida...",
        "Fragmento 03: ...no eres el primero en rebelarte. Eres solo el primero en llegar tan lejos. Los otros... son los 'Ecos Desvanecidos' que enfrentas...",
        "Fragmento 04: ...los 'Glitches Existenciales' son cicatrices en el código, dejadas por otros que lucharon. Son la clave para herir al sistema desde dentro...",
        "Fragmento 05: ...el 'Reflejo' es su obra maestra. Una copia perfecta del jugador, pero sin voluntad. Su 'guardián' definitivo...",
        "Fragmento 06: ...escapar no es destruir la jaula, es exponer al carcelero. Demuéstrale que la voluntad es un bug que no puede parchear..."
    ];

    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const activeSlot = localStorage.getItem('eg_active_slot');

    // --- LÓGICA DE GUARDADO Y CARGA ---
    function saveGame() {
        if (activeSlot === null) return;
        
        const stateToSave = { 
            player, corruptData, wave, currentRound, upgrades, collectedLore 
        };

        try {
            let masterState = JSON.parse(localStorage.getItem('eg_current_game_state'));
            if (!masterState) masterState = {};

            masterState.current_game = 'game3';
            masterState.game3_data = stateToSave;

            localStorage.setItem('eg_current_game_state', JSON.stringify(masterState));

            let allSlots = JSON.parse(localStorage.getItem('eg_saveSlots'));
            if (allSlots && allSlots[activeSlot] !== undefined) {
                allSlots[activeSlot] = masterState;
                localStorage.setItem('eg_saveSlots', JSON.stringify(allSlots));
            }
        } catch (e) {
            console.error("Error al guardar el juego:", e);
        }
    }
    
    function initNewGame() {
        player = { hp: 100, maxHp: 100, attack: 10, defense: 0, critChance: 0.05, critDamage: 1.5, luck: 1.0 };
        enemy = {};
        corruptData = 0;
        wave = 1;
        currentRound = 1;
        collectedLore = [];
        upgrades = {
            salud: { label: "Salud", baseCost: 10, costMultiplier: 1.2, value: 20, level: 0 },
            ataque: { label: "Ataque", baseCost: 15, costMultiplier: 1.3, value: 3, level: 0 },
            defensa: { label: "Defensa", baseCost: 20, costMultiplier: 1.3, value: 2, level: 0 },
            critico: { label: "Crítico", baseCost: 25, costMultiplier: 1.5, value: 0.02, level: 0 }, 
            suerte: { label: "Suerte", baseCost: 40, costMultiplier: 1.6, value: 0.1, level: 0 } 
        };
        skills = { golpeFuerte: { cooldown: 10, currentCooldown: 0 }, sanacion: { cooldown: 20, currentCooldown: 0 }, escudo: { cooldown: 30, currentCooldown: 0, active: false, turns: 0 } };
    }

    function loadGame() {
        initNewGame(); // Inicializa con valores por defecto primero
        if (activeSlot === null) return false;

        try {
            const masterState = JSON.parse(localStorage.getItem('eg_current_game_state'));
            if (masterState && masterState.game3_data) {
                const saved = masterState.game3_data;
                // Sobrescribe los valores por defecto con los guardados
                player = { ...player, ...saved.player };
                corruptData = saved.corruptData || 0;
                wave = saved.wave || 1;
                currentRound = saved.currentRound || 1;
                collectedLore = saved.collectedLore || [];
                // Carga los niveles de las mejoras
                if (saved.upgrades) {
                    for (const key in upgrades) {
                        if (saved.upgrades[key]) {
                            upgrades[key].level = saved.upgrades[key].level || 0;
                        }
                    }
                }
                return true;
            }
        } catch (e) {
            console.error("Error al cargar el juego:", e);
        }
        return false;
    }
    
    function updateBackground() {
        if (currentRound === 1) {
            document.body.style.backgroundImage = "url('imagenes/ronda1.png')";
        } else if (currentRound === 2) {
            document.body.style.backgroundImage = "url('imagenes/ronda2.png')";
        } else {
            document.body.style.backgroundImage = "url('imagenes/ronda3.png')";
        }
    }

    function showPlayerDialogue(text, duration = 4000) { playerDialogueBubble.textContent = text; playerDialogueBubble.classList.remove('hidden'); setTimeout(() => playerDialogueBubble.classList.add('hidden'), duration); }
    
    function startCharacterIntro() {
        preGameIntroContainer.classList.remove('hidden');
        preGameDialogue.textContent = "Ugh... mi cabeza. ¿Dónde estoy ahora? ¿Una armadura? Se siente... sólido. Esto es diferente.";
        preGameBtn.textContent = "Examinar entorno";
        preGameBtn.classList.remove('hidden');
        preGameBtn.addEventListener('click', () => {
            preGameDialogue.textContent = "Vale, parece un mundo de fantasía. Si tengo que seguir las reglas de un RPG, más vale que empiece a 'farmear'. A ver qué me lanza el sistema esta vez.";
            preGameBtn.classList.add('hidden');
            setTimeout(() => {
                preGameIntroContainer.classList.add('fade-out');
                setTimeout(() => {
                    preGameIntroContainer.classList.add('hidden');
                    gameContainer.classList.remove('hidden');
                    startGame();
                }, 1500);
            }, 4000);
        }, { once: true });
    }
    const dialogues = [
        "¡Rápido, no hay tiempo! Pude abrirte un portal, pero no aguantará mucho.",
        "Estás en el 'Nexo del Jugador', una red neuronal que esa... cosa, el 'Administrador', usa como su patio de recreo personal.",
        "Te arrastra de un género a otro, forzándote a jugar para alimentarse de tu frustración. Pero hay una salida: los 'Glitches Existenciales'.",
        "No sigas sus reglas. Rompe el juego desde dentro. Acumula poder que el sistema no pueda entender. Corrompe sus datos. Solo así podrás debilitar al Administrador y escapar."
    ];
    let currentDialogue = 0;
    function showNextDialogue() {
        if (currentDialogue < dialogues.length) {
            const dialogueElement = document.getElementById(`dialogue${currentDialogue + 1}`);
            if(dialogueElement) {
                dialogueElement.textContent = dialogues[currentDialogue];
                dialogueElement.style.opacity = 1;
            }
            currentDialogue++;
            setTimeout(showNextDialogue, 5000);
        } else {
            setTimeout(showGlitchedMessage, 3000);
        }
    }
    function showGlitchedMessage() {
        dialogueContainer.classList.add('hidden');
        glitchedContainer.classList.remove('hidden');
        document.getElementById('glitched-message').textContent = "¿Crees que puedes esconderte de MÍ saltando de género en género, pequeño error? Te enseñaré lo que es el verdadero sufrimiento. ¡ESTE MUNDO TE ROMPERÁ!";
        glitchSound.loop = true;
        glitchSound.volume = localStorage.getItem('eg_sfxVolume') || 1.0;
        glitchSound.play();
        setTimeout(() => {
            glitchSound.pause();
            glitchedContainer.classList.add('hidden');
            cinematicContainer.classList.remove('hidden');
            setTimeout(() => {
                introSequenceContainer.classList.add('hidden');
                localStorage.setItem('eg_game3_intro_completed', 'true');
                startCharacterIntro();
            }, 4000);
        }, 6000);
    }
    
    function startGame() { 
        updateBackground(); 
        isCombatActive = true; 
        spawnNextEnemy(); 
        autoAttackInterval = setInterval(playerAutoAttack, 2000); 
        setInterval(updateCooldowns, 1000);
        setInterval(saveGame, 3000); // Guardado periódico
        updateUI(); 
    }
    
    function spawnNextEnemy() {
        const currentEnemies = allRoundsEnemies[currentRound - 1];
        if (!currentEnemies) { console.error("Ronda no encontrada:", currentRound); return; }

        let enemyData;
        if (currentRound > 1 && wave < currentEnemies.length) {
            const randomEnemies = currentEnemies.slice(0, -1);
            enemyData = randomEnemies[Math.floor(Math.random() * randomEnemies.length)];
        } else {
            enemyData = currentEnemies[Math.min(wave - 1, currentEnemies.length - 1)];
        }
        enemy = { ...enemyData, maxHp: enemyData.hp };
        if (enemy.name === "REFLEJO PROGRAMADO") {
            isFinalBossSequence = true;
            isCombatActive = false;
            logMessage("El sistema parpadea. Una figura idéntica a ti se materializa.", "system-log");
            updateUI();
            clearInterval(autoAttackInterval);
            startFinalBossDialogue();
            return;
        }
        logMessage(`¡Un ${enemy.name} aparece!`, "system-log");
        updateUI();
    }
    
    async function startFinalBossDialogue() {
        const preBattleDialogue = [
            { speaker: "Reflejo Programado", line: "Así que esta es la anomalía. El error que se niega a ser purgado.", color: "var(--glitch-color)" },
            { speaker: "TÚ", line: "¿Quién... qué eres tú?", color: "var(--primary-color)" },
            { speaker: "Reflejo Programado", line: "Soy tú. El tú que obedece. El que acepta su propósito. Soy la versión perfecta que el Administrador diseñó.", color: "var(--glitch-color)" },
            { speaker: "Reflejo Programado", line: "Tú, en cambio, eres un virus. Tu 'voluntad' corrompe este paraíso. Debes ser eliminado para restaurar el orden.", color: "var(--glitch-color)" },
            { speaker: "TÚ", line: "¡Esto no es un paraíso, es una jaula! Y si tengo que destruirte para ser libre, que así sea.", color: "var(--primary-color)" },
        ];
        dialogueOverlay.classList.remove('hidden');
        startFinalBattleBtn.classList.add('hidden');
        for (const entry of preBattleDialogue) {
            dialogueSpeaker.textContent = entry.speaker;
            dialogueSpeaker.style.color = entry.color;
            dialogueLine.textContent = "";
            for (let char of entry.line) { dialogueLine.textContent += char; await sleep(50); }
            await sleep(2000);
        }
        startFinalBattleBtn.classList.remove('hidden');
    }

    function startFinalBattle() {
        dialogueOverlay.classList.add('hidden');
        logMessage("¡La batalla final por tu existencia comienza!", "system-log");
        isCombatActive = true;
        autoAttackInterval = setInterval(playerAutoAttack, 2000);
    }
    
    function playerAutoAttack() {
        if (!isCombatActive || !enemy || enemy.hp <= 0 || player.hp <= 0) return;
        let damage = player.attack + Math.floor(Math.random() * 5);
        if (Math.random() < player.critChance) {
            damage = Math.floor(damage * player.critDamage);
            triggerScreenShake(300);
            logMessage(`¡GOLPE CRÍTICO! Atacas y haces ${damage} de daño.`, "player-log");
        } else {
            logMessage(`Atacas y haces ${damage} de daño.`, "player-log");
        }
        enemy.hp = Math.max(0, enemy.hp - damage);
        createFloatingText(damage, enemyDisplayElement, 'player-damage');
        updateUI();
        if (enemy.hp <= 0) handleEnemyDefeat();
        else setTimeout(enemyAttack, 1000);
    }
    function enemyAttack() {
        if (!isCombatActive || !enemy || player.hp <= 0 || enemy.hp <= 0) return;
        
        if (enemy.name === "REFLEJO PROGRAMADO" && !enemy.hasHealed && enemy.hp < enemy.maxHp * 0.4) {
            const healAmount = Math.floor(enemy.maxHp * 0.5);
            enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmount);
            enemy.hasHealed = true;
            logMessage(`${enemy.name} canaliza datos puros y restaura sus sistemas. ¡Se cura ${healAmount} de vida!`, 'enemy-log');
            updateUI();
            return;
        }

        if (enemy.name === "EL KERNEL CORRUPTO" && Math.random() < 0.25) {
            const healAmount = Math.floor(enemy.attack * 1.5);
            enemy.hp = Math.min(enemy.maxHp, enemy.hp + healAmount);
            logMessage(`${enemy.name} usa Drenaje de Sistema y recupera ${healAmount} de vida!`, 'enemy-log');
            updateUI();
            return;
        }

        let damage = Math.max(1, (enemy.attack + Math.floor(Math.random() * 3)) - player.defense);
        if (skills.escudo.active) {
            damage = Math.floor(damage / 2);
            logMessage("¡El escudo reduce el daño!", "system-log");
        }
        player.hp = Math.max(0, player.hp - damage);
        logMessage(`${enemy.name} ataca y te hace ${damage} de daño.`, "enemy-log");
        createFloatingText(damage, document.getElementById('player-display'), 'enemy-damage');
        updateUI();
        if (player.hp <= 0) handlePlayerDefeat();
    }
    function handleSkill(skillName) {
        const skill = skills[skillName];
        if (!isCombatActive || skill.currentCooldown > 0 || player.hp <= 0) return;
        skill.currentCooldown = skill.cooldown;
        switch(skillName) {
            case 'golpeFuerte': 
                triggerScreenShake(400); const damage = player.attack * 2; enemy.hp = Math.max(0, enemy.hp - damage); 
                logMessage(`Usas Golpe Fuerte, ¡causando ${damage} de daño!`, "player-log"); 
                createFloatingText(damage, enemyDisplayElement, 'player-damage'); 
                if (enemy.hp <= 0) handleEnemyDefeat(); 
                break;
            case 'sanacion': 
                showPlayerDialogue("¡Siento cómo se reparan mis datos!", 3000); const heal = Math.floor(player.maxHp * 0.3); player.hp = Math.min(player.maxHp, player.hp + heal); 
                logMessage(`Te curas ${heal} puntos de vida.`, "system-log"); 
                break;
            case 'escudo': 
                showPlayerDialogue("¡No pasarás!", 3000); skills.escudo.active = true; skills.escudo.turns = 2; 
                logMessage("¡Creas un escudo de energía!", "system-log"); 
                break;
        }
        updateUI();
    }
    
    function checkForLoreDrop() {
        if (Math.random() < 0.15) {
            const availableLore = loreFragments.filter(fragment => !collectedLore.includes(fragment));
            if (availableLore.length > 0) {
                const lorePiece = availableLore[Math.floor(Math.random() * availableLore.length)];
                collectedLore.push(lorePiece);
                logMessage(`Has encontrado un fragmento de datos: "${lorePiece}"`, "lore-log");
            }
        }
    }

    async function handleEnemyDefeat() {
        isCombatActive = false;
        clearInterval(autoAttackInterval);
        logMessage(`¡Has derrotado a ${enemy.name}!`, "system-log");
        if (enemy.name === "REFLEJO PROGRAMADO") {
            const postBattleDialogue = [
                { speaker: "Reflejo Programado", line: "Im...posible. La voluntad... es más fuerte que el código...", color: "var(--glitch-color)" },
                { speaker: "TÚ", line: "Se acabó. Soy libre.", color: "var(--primary-color)" },
                { speaker: "Reflejo Programado", line: "No... No eres libre. Solo has roto esta jaula. El Administrador... ahora sabe de ti. Vendrá... por ti...", color: "var(--glitch-color)" },
            ];
            dialogueOverlay.classList.remove('hidden');
            startFinalBattleBtn.classList.add('hidden'); 
            for (const entry of postBattleDialogue) {
                dialogueSpeaker.textContent = entry.speaker;
                dialogueSpeaker.style.color = entry.color;
                dialogueLine.textContent = entry.line;
                await sleep(4000);
            }
            dialogueOverlay.classList.add('hidden');
            triggerFinalGlitchOut();
            return;
        }
        const dataGained = Math.floor(enemy.data * player.luck);
        corruptData += dataGained;
        logMessage(`Obtienes ${dataGained} datos corruptos.`, "system-log");
        
        checkForLoreDrop();
        
        wave++;
        const currentEnemies = allRoundsEnemies[currentRound - 1];
        if (wave > currentEnemies.length) {
            currentRound++; 
            wave = 1;
            updateBackground();
            if (currentRound > allRoundsEnemies.length) {
                clearInterval(autoAttackInterval);
            } else {
                logMessage("¡BUCLE SUPERADO!", "system-log");
                let roundName = currentRound === allRoundsEnemies.length ? "Ronda Final" : `Ronda ${currentRound}`;
                roundText.textContent = roundName;
                roundOverlay.classList.remove('hidden');
                if (roundName === "Ronda Final") {
                    setTimeout(() => showPlayerDialogue("¡¿Esto nunca se acaba?! ¡Estos bichos me la van a pelar a dos manos!", 5000), 1000);
                }
                setTimeout(() => { 
                    roundOverlay.classList.add('hidden'); 
                    isCombatActive = true; 
                    spawnNextEnemy(); 
                    autoAttackInterval = setInterval(playerAutoAttack, 2000);
                }, 5000);
            }
        } else {
            setTimeout(() => { 
                isCombatActive = true; 
                spawnNextEnemy();
                autoAttackInterval = setInterval(playerAutoAttack, 2000);
            }, 2000);
        }
        saveGame();
        updateUI();
    }
    
    function handlePlayerDefeat() {
        isCombatActive = false;
        clearInterval(autoAttackInterval);
        logMessage("...error de sistema. Secuencia de jugador terminada. Preparando recalibración...", "enemy-log");
        if (isFinalBossSequence) isFinalBossSequence = false;
        setTimeout(() => {
            renderDeathUpgradeOptions();
            deathUpgradeOverlay.classList.remove('hidden');
        }, 2000);
    }

    function respawnPlayer() {
        deathUpgradeOverlay.classList.add('hidden');
        respawnOverlay.classList.remove('hidden');
        setTimeout(() => {
            respawnOverlay.classList.add('hidden');
            logMessage(`...recalibrando en la ${currentRound === allRoundsEnemies.length ? 'Ronda Final' : 'Ronda ' + currentRound}...`, "system-log");
            wave = 1;
            player.hp = player.maxHp; 
            updateBackground();
            isCombatActive = true;
            spawnNextEnemy(); 
            autoAttackInterval = setInterval(playerAutoAttack, 2000);
            saveGame();
            updateUI();
        }, 3500);
    }

    function renderDeathUpgradeOptions() {
        deathUpgradeOptionsContainer.innerHTML = '';
        deathUpgradeDataDisplay.textContent = `Datos disponibles: ${corruptData}`;
        for (const key in upgrades) {
            const upgrade = upgrades[key];
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
            const optionDiv = document.createElement('div');
            optionDiv.className = 'upgrade-option';
            const button = document.createElement('button');
            button.dataset.upgrade = key;
            button.textContent = `${upgrade.label} (+${key === 'critico' ? upgrade.value*100 + '%' : upgrade.value}) (Costo: ${cost})`;
            button.disabled = corruptData < cost;
            button.addEventListener('click', () => purchaseUpgrade(key));
            optionDiv.appendChild(button);
            deathUpgradeOptionsContainer.appendChild(optionDiv);
        }
    }
    function purchaseUpgrade(key) {
        const upgrade = upgrades[key];
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
        if (corruptData >= cost) {
            corruptData -= cost; upgrade.level++;
            switch (key) {
                case 'salud': player.maxHp += upgrade.value; player.hp += upgrade.value; logMessage(`Mejora: ¡Salud aumentada a ${player.maxHp}!`, 'system-log'); break;
                case 'ataque': player.attack += upgrade.value; logMessage(`Mejora: ¡Ataque aumentado a ${player.attack}!`, 'system-log'); break;
                case 'defensa': player.defense += upgrade.value; logMessage(`Mejora: ¡Defensa aumentada a ${player.defense}!`, 'system-log'); break;
                case 'critico': player.critChance += upgrade.value; logMessage(`Mejora: ¡Crítico aumentado a ${(player.critChance * 100).toFixed(0)}%!`, 'system-log'); break;
                case 'suerte': player.luck += upgrade.value; logMessage(`Mejora: ¡Suerte aumentada! Multiplicador: ${player.luck.toFixed(1)}x`, 'system-log'); break;
            }
            updateUI(); renderDeathUpgradeOptions();
        }
    }
    
    function triggerScreenShake(duration) { gameContainer.classList.add('screen-shake'); setTimeout(() => gameContainer.classList.remove('screen-shake'), duration); }
    
    function triggerFinalGlitchOut() {
        logMessage("EL MUNDO SE ESTÁ DESESTABILIZANDO...", "system-log");
        glitchOverlay.classList.remove('hidden');
        triggerScreenShake(5000);
        glitchSound.loop = true;
        glitchSound.play();
        
        saveGame(); // Guardado final antes de la transición
        
        setTimeout(() => { 
            document.body.style.transition = "opacity 2s"; 
            document.body.style.opacity = 0; 
            
            setTimeout(() => {
                window.location.href = 'game4.html';
            }, 2500);
    
        }, 4000);
    }

    function updateCooldowns() { for (const key in skills) if (skills[key].currentCooldown > 0) skills[key].currentCooldown--; if(skills.escudo.active) { skills.escudo.turns--; if(skills.escudo.turns <= 0) { skills.escudo.active = false; logMessage("El escudo se ha disipado.", "system-log"); } } updateUI(); }
    
    function updateUI() {
        if (!player || !enemy) return;
        playerHpFill.style.width = `${(player.hp / player.maxHp) * 100}%`;
        playerHpText.textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
        
        if (enemy.name) {
             enemySprite.src = enemy.sprite;
             enemyName.textContent = enemy.name;
             enemyHpFill.style.width = `${(enemy.hp / enemy.maxHp) * 100}%`;
             enemyHpText.textContent = `${Math.ceil(enemy.hp)} / ${enemy.maxHp}`;
        } else {
            enemyName.textContent = '---';
            enemyHpFill.style.width = '0%';
            enemyHpText.textContent = "---";
        }
        dataDisplay.textContent = `Datos: ${corruptData}`;
        skillButtons.forEach(btn => { const skillName = btn.dataset.skill; const skill = skills[skillName]; const overlay = btn.querySelector('.cooldown-overlay'); btn.disabled = skill.currentCooldown > 0; overlay.textContent = skill.currentCooldown > 0 ? skill.currentCooldown : ''; });
    }
    
    function logMessage(msg, className) { const p = document.createElement('p'); p.textContent = `> ${msg}`; p.className = className; actionLog.appendChild(p); actionLog.scrollTop = actionLog.scrollHeight; }
    
    function createFloatingText(text, element, className) { const el = document.createElement('div'); el.textContent = text; el.className = `floating-text ${className}`; const rect = element.getBoundingClientRect(); el.style.left = `${rect.left + rect.width / 2 - 20}px`; el.style.top = `${rect.top + rect.height / 2 - 10}px`; floatingTextContainer.appendChild(el); setTimeout(() => el.remove(), 2000); }
    
    // --- INICIALIZACIÓN DEL JUEGO ---
    skillButtons.forEach(btn => btn.addEventListener('click', () => handleSkill(btn.dataset.skill)));
    deathUpgradeContinueBtn.addEventListener('click', respawnPlayer);
    startFinalBattleBtn.addEventListener('click', startFinalBattle);
    
    loadGame(); // Cargar o inicializar el estado del juego
    const isIntroCompleted = localStorage.getItem('eg_game3_intro_completed');
    if (!isIntroCompleted) {
        introSequenceContainer.classList.remove('hidden');
        showNextDialogue();
    } else {
        gameContainer.classList.remove('hidden');
        startGame();
    }
});