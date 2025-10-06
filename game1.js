document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('platformerCanvas');
    const ctx = canvas.getContext('2d');
    const healOverlay = document.getElementById('heal-overlay');
    const healButton = document.getElementById('heal-button');
    
    // Selector para la pantalla de carga de transición
    const loadingScreen = document.getElementById('loading-screen');
    const loadingDialogue = document.getElementById('loading-dialogue');

    const currentLanguage = localStorage.getItem('eg_language') || 'es';

    const gameTexts = {
        dialogue: { es: ["¿Dónde estoy?", "¿Qué es esto, plataformas?", "¿En dónde estoy?"], en: ["Where am I?", "What is this, platforms?", "Where am I?"] },
        missionTitle: { es: "Misión 1", en: "Mission 1" },
        missionObjective: { es: "Recoge todas las monedas", en: "Collect all the coins" },
        score: { es: "Puntos", en: "Score" },
        health: { es: "Vida", en: "Health" },
        errorTitle: { es: "ERROR: No se pueden encontrar los archivos del jugador o del suelo.", en: "ERROR: Cannot find player or ground assets." },
        errorSubtitle: { es: "Asegúrate de que están en la carpeta /imagenes/", en: "Make sure they are in the /imagenes/ folder." },
        firstJumpDialogue: { es: "¿¡Qué clase de bicho soy!?", en: "What kind of creature am I!?" },
        firstCoinDialogue: { es: "Quiero salir de aquí... ¿Qué coño es esto?", en: "I want to get out of here... What the hell is this?" },
        damageDialogue: { es: "¿Acaso eres imbécil? Es un juego, ¡pero a mí me duele!", en: "Are you an idiot? It's a game, but that hurts me!" },
        sevenCoinsDialogue: { es: "Anoche no sé qué tenía la sopa... me dormí y terminé aquí.", en: "I don't know what was in the soup last night... I fell asleep and ended up here." },
        fifthCoinConditionalDialogue: { es: "A ver, vamos a calmarnos... no fue tu culpa, ¡pero puedo morir!", en: "Okay, let's calm down... it wasn't your fault, but I can die!" },
        systemAlertIntro: { es: "Bienvenido al Internet. Vas a presenciar todo tipo de géneros de juego. Por ser nuevo, te daré un regalo.", en: "Welcome to the Internet. You will witness all kinds of game genres. As you are new, I will give you a gift." },
        postHealDialogue: { es: "¡Qué bien! Estoy como nuevo.", en: "Alright! I'm good as new." },
        transitionDialogue: { es: "Aquí vamos de nuevo...", en: "Here we go again..." }
    };

    const BASE_WIDTH = 800;
    const BASE_HEIGHT = 600;

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const ASSET_SOURCES = { player: 'imagenes/player_spritesheet.png', ground: 'imagenes/suelo.png', decor1: 'imagenes/1.png', decor2: 'imagenes/2.png', decor3: 'imagenes/3.png', decor4: 'imagenes/4.png', decor5: 'imagenes/5.png', decor6: 'imagenes/6.png', coin: 'imagenes/Gold_21.png' };
    const assets = {};

    let gameState = 'SPLASH_SCREEN';
    let splashAlpha = 0, splashPhase = 'FADING_IN', splashHoldTimer = 0; const SPLASH_HOLD_DURATION = 120;
    let currentDialogueIndex = 0; let dialogueLineTimer = 0; const DIALOGUE_LINE_DURATION = 180;
    let missionAlpha = 0, missionPhase = 'FADING_IN', missionHoldTimer = 0; const MISSION_HOLD_DURATION = 180;
    let systemAlertAlpha = 0, systemAlertPhase = 'FADING_IN', systemAlertTimer = 0; const SYSTEM_ALERT_HOLD_DURATION = 300;
    
    // Variables para el efecto de texto glitch
    let systemAlertTextProgress = 0;
    let systemAlertGlitchedText = "";
    const GLITCH_CHAR_SET = '█▓▒░abcdefghijklmnopqrstuvwxyz0123456789!?@#$%&/\\';
    const TEXT_REVEAL_SPEED = 2;
    let textRevealCounter = 0;

    let timedDialogue = { text: null, timer: 0 };
    let goodCoinsCollected = 0;
    let hasJumpedOnce = false, hasCollectedFirstCoin = false, hasTriggered7CoinDialogue = false;
    let hasTakenDamage = false, hasTriggeredSystemSequence = false;
    let isTransitioning = false; // Bandera para la transición final

    const TIMED_DIALOGUE_DURATION = 300;
    const GRAVITY = 0.5, MOVE_SPEED = 5, JUMP_FORCE = 15;
    const PLAYER_VISUAL_OFFSET_Y = 5, DECORATION_SIZE = 50, COIN_SIZE = 35;
    const FRAME_WIDTH = 33, FRAME_HEIGHT = 42, FRAME_SPEED = 4;
    const IDLE_FRAME = 0, JUMP_FRAME = 1, WALK_CYCLE_START_FRAME = 2, TOTAL_WALK_FRAMES = 4;

    let player, camera, platforms, decorations, coins, score, health;
    let groundPattern = null;

    function loadAssets(callback) {
        let loadedCount = 0; const totalAssets = Object.keys(ASSET_SOURCES).length;
        for (const key in ASSET_SOURCES) {
            const img = new Image();
            img.onload = () => { loadedCount++; assets[key] = img; if (loadedCount === totalAssets) { callback(); } };
            img.onerror = () => { console.error(`Error al cargar: ${ASSET_SOURCES[key]}`); loadedCount++; if (loadedCount === totalAssets) { callback(); } };
            img.src = ASSET_SOURCES[key];
        }
    }

    function initializeGame() {
        score = 0; health = 100;
        player = { x: 100, y: 400, width: 45, height: 52, velocityX: 0, velocityY: 0, isJumping: false, currentFrame: IDLE_FRAME, frameTimer: 0, facingDirection: 'right' };
        camera = { x: 0, y: 0 };
        timedDialogue = { text: null, timer: 0 };
        goodCoinsCollected = 0;
        hasJumpedOnce = false; hasCollectedFirstCoin = false; hasTriggered7CoinDialogue = false;
        hasTakenDamage = false; hasTriggeredSystemSequence = false;
        isTransitioning = false;
        if (assets.ground) { groundPattern = ctx.createPattern(assets.ground, 'repeat'); }
        platforms = [ { x: -1000, y: 590, width: 10000, height: 50 }, { x: 200, y: 450, width: 150, height: 20 }, { x: 450, y: 350, width: 150, height: 20 }, { x: 700, y: 450, width: 200, height: 20 }, { x: 1000, y: 400, width: 150, height: 20 }, { x: 1200, y: 300, width: 150, height: 20 }, { x: 1400, y: 200, width: 50, height: 20 }, { x: 1600, y: 350, width: 250, height: 20 }, { x: 1950, y: 280, width: 150, height: 20 } ];
        decorations = [ { x: 495, y: 350 - DECORATION_SIZE, assetKey: 'decor1' }, { x: 600, y: 590 - DEcoration_SIZE, assetKey: 'decor2' }, { x: 720, y: 450 - DECORATION_SIZE, assetKey: 'decor3' }, { x: 900, y: 590 - DECORATION_SIZE, assetKey: 'decor4' }, { x: 1250, y: 300 - DECORATION_SIZE, assetKey: 'decor5' }, { x: 1620, y: 350 - DECORATION_SIZE, assetKey: 'decor6' }, ];
        coins = [ { x: 250, y: 400, isVisible: true, isBad: false }, { x: 285, y: 400, isVisible: true, isBad: false }, { x: 500, y: 300, isVisible: true, isBad: false }, { x: 535, y: 300, isVisible: true, isBad: false }, { x: 800, y: 400, isVisible: true, isBad: true }, { x: 1050, y: 350, isVisible: true, isBad: false }, { x: 1250, y: 250, isVisible: true, isBad: false }, { x: 1405, y: 150, isVisible: true, isBad: false }, { x: 1700, y: 300, isVisible: true, isBad: false }, { x: 1735, y: 300, isVisible: true, isBad: false }, ];
        gameLoop();
    }

    const keys = { ArrowLeft: false, ArrowRight: false, Space: false };
    window.addEventListener('keydown', (e) => { if (e.code in keys) keys[e.code] = true; if (e.code === 'Space') e.preventDefault(); });
    window.addEventListener('keyup', (e) => { if (e.code in keys) keys[e.code] = false; });
    const btnLeft = document.getElementById('btn-left'), btnRight = document.getElementById('btn-right'), btnJump = document.getElementById('btn-jump');
    const handleButtonPress = (key, isPressed) => { keys[key] = isPressed; };
    btnLeft.addEventListener('mousedown', () => handleButtonPress('ArrowLeft', true)); btnLeft.addEventListener('mouseup', () => handleButtonPress('ArrowLeft', false)); btnLeft.addEventListener('mouseleave', () => handleButtonPress('ArrowLeft', false)); btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonPress('ArrowLeft', true); }); btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); handleButtonPress('ArrowLeft', false); });
    btnRight.addEventListener('mousedown', () => handleButtonPress('ArrowRight', true)); btnRight.addEventListener('mouseup', () => handleButtonPress('ArrowRight', false)); btnRight.addEventListener('mouseleave', () => handleButtonPress('ArrowRight', false)); btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonPress('ArrowRight', true); }); btnRight.addEventListener('touchend', (e) => { e.preventDefault(); handleButtonPress('ArrowRight', false); });
    btnJump.addEventListener('mousedown', () => handleButtonPress('Space', true)); btnJump.addEventListener('mouseup', () => handleButtonPress('Space', false)); btnJump.addEventListener('mouseleave', () => handleButtonPress('Space', false)); btnJump.addEventListener('touchstart', (e) => { e.preventDefault(); handleButtonPress('Space', true); }); btnJump.addEventListener('touchend', (e) => { e.preventDefault(); handleButtonPress('Space', false); });

    healButton.addEventListener('click', () => {
        if (gameState !== 'HEAL_BUTTON_PROMPT') return;
        health = 100;
        timedDialogue.text = gameTexts.postHealDialogue[currentLanguage];
        timedDialogue.timer = 240;
        healOverlay.classList.add('hidden');
        gameState = 'PLAYING';
    });

    function updateSplashScreen() {
        const FADE_SPEED = 0.02;
        if (splashPhase === 'FADING_IN') { splashAlpha += FADE_SPEED; if (splashAlpha >= 1) { splashAlpha = 1; splashPhase = 'HOLDING'; } }
        else if (splashPhase === 'HOLDING') { splashHoldTimer++; if (splashHoldTimer >= SPLASH_HOLD_DURATION) { splashPhase = 'FADING_OUT'; } }
        else if (splashPhase === 'FADING_OUT') { splashAlpha -= FADE_SPEED; if (splashAlpha <= 0) { splashAlpha = 0; gameState = 'DIALOGUE'; dialogueLineTimer = DIALOGUE_LINE_DURATION; } }
    }

    function updateDialogue() {
        dialogueLineTimer--;
        if (dialogueLineTimer <= 0) {
            currentDialogueIndex++;
            if (currentDialogueIndex >= gameTexts.dialogue[currentLanguage].length) { gameState = 'MISSION'; }
            else { dialogueLineTimer = DIALOGUE_LINE_DURATION; }
        }
    }

    function updateMission() {
        const FADE_SPEED = 0.025;
        if (missionPhase === 'FADING_IN') { missionAlpha += FADE_SPEED; if (missionAlpha >= 1) { missionAlpha = 1; missionPhase = 'HOLDING'; } }
        else if (missionPhase === 'HOLDING') { missionHoldTimer++; if (missionHoldTimer >= MISSION_HOLD_DURATION) { missionPhase = 'FADING_OUT'; } }
        else if (missionPhase === 'FADING_OUT') { missionAlpha -= FADE_SPEED; if (missionAlpha <= 0) { missionAlpha = 0; gameState = 'PLAYING'; } }
    }

    function updateSystemAlert(nextStateOnFinish) {
        const FADE_SPEED = 0.025;
        const originalText = gameTexts.systemAlertIntro[currentLanguage];
        
        textRevealCounter++;
        if (textRevealCounter >= TEXT_REVEAL_SPEED && systemAlertTextProgress < originalText.length) {
            systemAlertTextProgress++;
            textRevealCounter = 0;
        }

        let revealedPart = originalText.substring(0, systemAlertTextProgress);
        let glitchedPart = "";
        for (let i = systemAlertTextProgress; i < originalText.length; i++) {
            if (originalText[i] === ' ') {
                glitchedPart += ' ';
            } else {
                const randomIndex = Math.floor(Math.random() * GLITCH_CHAR_SET.length);
                glitchedPart += GLITCH_CHAR_SET[randomIndex];
            }
        }
        systemAlertGlitchedText = revealedPart + glitchedPart;

        if (systemAlertPhase === 'FADING_IN') { systemAlertAlpha += FADE_SPEED; if (systemAlertAlpha >= 1) { systemAlertAlpha = 1; systemAlertPhase = 'HOLDING'; } }
        else if (systemAlertPhase === 'HOLDING') { systemAlertTimer++; if (systemAlertTimer >= SYSTEM_ALERT_HOLD_DURATION) { systemAlertPhase = 'FADING_OUT'; } }
        else if (systemAlertPhase === 'FADING_OUT') {
            systemAlertAlpha -= FADE_SPEED;
            if (systemAlertAlpha <= 0) {
                systemAlertAlpha = 0;
                gameState = nextStateOnFinish;
                systemAlertTimer = 0;
                systemAlertPhase = 'FADING_IN';
                if (nextStateOnFinish === 'HEAL_BUTTON_PROMPT') {
                    healOverlay.classList.remove('hidden');
                }
            }
        }
    }

    function updatePlaying() {
        if (timedDialogue.timer > 0) { timedDialogue.timer--; if (timedDialogue.timer <= 0) { timedDialogue.text = null; } }
        let isMoving = false; let moveX = 0;
        if (keys.ArrowLeft) { moveX = -MOVE_SPEED; player.facingDirection = 'left'; isMoving = true; }
        if (keys.ArrowRight) { moveX = MOVE_SPEED; player.facingDirection = 'right'; isMoving = true; }
        player.x += moveX;
        for (const platform of platforms) { if (player.x < platform.x + platform.width && player.x + player.width > platform.x && player.y < platform.y + platform.height && player.y + player.height > platform.y) { if (moveX > 0) { player.x = platform.x - player.width; } else if (moveX < 0) { player.x = platform.x + platform.width; } } }
        if (keys.Space && !player.isJumping) {
            player.velocityY = -JUMP_FORCE; player.isJumping = true;
            if (!hasJumpedOnce) { timedDialogue.text = gameTexts.firstJumpDialogue[currentLanguage]; timedDialogue.timer = TIMED_DIALOGUE_DURATION; hasJumpedOnce = true; }
        }
        player.velocityY += GRAVITY; player.y += player.velocityY;
        let onPlatform = false;
        for (const platform of platforms) { if (player.x < platform.x + platform.width && player.x + player.width > platform.x) { if (player.velocityY >= 0 && player.y + player.height > platform.y && (player.y - player.velocityY) + player.height <= platform.y) { player.y = platform.y - player.height; player.velocityY = 0; onPlatform = true; } else if (player.velocityY < 0 && player.y < platform.y + platform.height && (player.y - player.velocityY) >= platform.y + platform.height) { player.y = platform.y + platform.height; player.velocityY = 0; } } }
        player.isJumping = !onPlatform;
        for (const coin of coins) {
            if (coin.isVisible && player.x < coin.x + COIN_SIZE && player.x + player.width > coin.x && player.y < coin.y + COIN_SIZE && player.y + player.height > coin.y) {
                coin.isVisible = false;
                if (coin.isBad) {
                    health -= 25; hasTakenDamage = true;
                    timedDialogue.text = gameTexts.damageDialogue[currentLanguage];
                    timedDialogue.timer = TIMED_DIALOGUE_DURATION;
                } else {
                    score += 10; goodCoinsCollected++;
                    if (!hasCollectedFirstCoin) { timedDialogue.text = gameTexts.firstCoinDialogue[currentLanguage]; timedDialogue.timer = TIMED_DIALOGUE_DURATION; hasCollectedFirstCoin = true;
                    } else if (goodCoinsCollected === 5 && hasTakenDamage && !hasTriggeredSystemSequence) { timedDialogue.text = gameTexts.fifthCoinConditionalDialogue[currentLanguage]; timedDialogue.timer = TIMED_DIALOGUE_DURATION;
                    } else if (goodCoinsCollected === 7 && !hasTriggered7CoinDialogue) { timedDialogue.text = gameTexts.sevenCoinsDialogue[currentLanguage]; timedDialogue.timer = TIMED_DIALOGUE_DURATION; hasTriggered7CoinDialogue = true; }
                    
                    if (goodCoinsCollected === 5 && !hasTriggeredSystemSequence) {
                        hasTriggeredSystemSequence = true;
                        gameState = 'SYSTEM_ALERT_INTRO';
                        systemAlertPhase = 'FADING_IN'; systemAlertAlpha = 0; systemAlertTimer = 0;
                        systemAlertTextProgress = 0;
                        systemAlertGlitchedText = "";
                        textRevealCounter = 0;
                    }

                    // Lógica de transición a la siguiente etapa
                    if (goodCoinsCollected === 9 && !isTransitioning) {
                        isTransitioning = true; // Prevenir activación múltiple
                        loadingDialogue.textContent = gameTexts.transitionDialogue[currentLanguage];
                        loadingScreen.classList.remove('hidden');

                        // Esperar 4 segundos antes de cambiar de página
                        setTimeout(() => {
                            window.location.href = 'game2.html';
                        }, 4000);
                    }
                }
            }
        }
        player.frameTimer++;
        if (player.frameTimer > FRAME_SPEED) {
            player.frameTimer = 0;
            if (player.isJumping) { player.currentFrame = JUMP_FRAME; }
            else if (isMoving) { let currentWalkFrame = player.currentFrame - WALK_CYCLE_START_FRAME; if (currentWalkFrame < 0 || currentWalkFrame >= TOTAL_WALK_FRAMES) { currentWalkFrame = 0; } else { currentWalkFrame = (currentWalkFrame + 1) % TOTAL_WALK_FRAMES; } player.currentFrame = WALK_CYCLE_START_FRAME + currentWalkFrame; }
            else { player.currentFrame = IDLE_FRAME; }
        }
        camera.x = player.x - BASE_WIDTH / 3;
        if (camera.x < 0) { camera.x = 0; }
    }

    function drawSystemAlert(text) {
        ctx.save();
        ctx.globalAlpha = systemAlertAlpha;
        const boxWidth = canvas.width * 0.7; const boxHeight = 200;
        const boxX = (canvas.width - boxWidth) / 2; const boxY = (canvas.height - boxHeight) / 2;
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 3; ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 15;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        ctx.fillStyle = 'rgba(0, 10, 20, 0.9)'; ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.fillStyle = '#00ffff'; ctx.font = '24px monospace'; ctx.textAlign = 'center';
        const words = text.split(' ');
        let line = ''; let textY = boxY + 50;
        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const testWidth = ctx.measureText(testLine).width;
            if (testWidth > boxWidth - 40 && n > 0) { ctx.fillText(line, canvas.width / 2, textY); line = words[n] + ' '; textY += 30; }
            else { line = testLine; }
        }
        ctx.fillText(line, canvas.width / 2, textY);
        ctx.restore();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!assets.ground || !assets.player) {
            ctx.fillStyle = 'red'; ctx.font = '20px monospace'; ctx.textAlign = 'center'; ctx.fillText(gameTexts.errorTitle[currentLanguage], canvas.width / 2, canvas.height / 2); ctx.fillText(gameTexts.errorSubtitle[currentLanguage], canvas.width / 2, canvas.height / 2 + 30); return;
        }
        
        ctx.save();
        const scale = canvas.height / BASE_HEIGHT;
        const offsetX = (canvas.width - BASE_WIDTH * scale) / 2;
        ctx.translate(offsetX, 0); ctx.scale(scale, scale);
        ctx.translate(-camera.x, -camera.y);

        if (groundPattern) { ctx.fillStyle = groundPattern; }
        for (const platform of platforms) { ctx.save(); ctx.translate(platform.x, platform.y); ctx.fillRect(0, 0, platform.width, platform.height); ctx.restore(); }
        for (const decor of decorations) { const img = assets[decor.assetKey]; if (img) { ctx.drawImage(img, decor.x, decor.y, DECORATION_SIZE, DECORATION_SIZE); } }
        for (const coin of coins) { if (coin.isVisible && assets.coin) { ctx.drawImage(assets.coin, coin.x, coin.y, COIN_SIZE, COIN_SIZE); } }
        
        ctx.save();
        const drawY = player.y + PLAYER_VISUAL_OFFSET_Y;
        const sx = player.currentFrame * FRAME_WIDTH; const sy = 0;
        if (player.facingDirection === 'left') { ctx.scale(-1, 1); ctx.drawImage(assets.player, sx, sy, FRAME_WIDTH, FRAME_HEIGHT, -player.x - player.width, drawY, player.width, player.height); }
        else { ctx.drawImage(assets.player, sx, sy, FRAME_WIDTH, FRAME_HEIGHT, player.x, drawY, player.width, player.height); }
        ctx.restore();

        if (timedDialogue.timer > 0 && timedDialogue.text) {
            const bubbleX = player.x + player.width / 2; const bubbleY = player.y - 30; const padding = 10;
            ctx.font = '16px monospace'; ctx.textAlign = 'center';
            const textWidth = ctx.measureText(timedDialogue.text).width;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; ctx.beginPath(); ctx.moveTo(bubbleX + 10, bubbleY); ctx.lineTo(bubbleX, bubbleY + 10); ctx.lineTo(bubbleX - 10, bubbleY); ctx.closePath(); ctx.fill();
            ctx.fillRect(bubbleX - textWidth / 2 - padding, bubbleY - 25 - padding, textWidth + (padding * 2), 25 + padding);
            ctx.fillStyle = '#000'; ctx.fillText(timedDialogue.text, bubbleX, bubbleY - padding);
        }
        ctx.restore();

        if (gameState === 'SPLASH_SCREEN') {
            ctx.fillStyle = `rgba(0, 0, 0, ${splashAlpha * 0.7})`; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.save(); ctx.globalAlpha = splashAlpha; ctx.textAlign = 'center'; ctx.font = '90px monospace'; ctx.fillStyle = 'white'; ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'; ctx.shadowBlur = 10; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 5; ctx.fillText('Acto 1', canvas.width / 2, canvas.height / 2); ctx.font = '45px monospace'; ctx.fillStyle = '#FFD700'; ctx.shadowColor = 'transparent'; ctx.fillText('Plataformas', canvas.width / 2, canvas.height / 2 + 60); ctx.restore();
        } else if (gameState === 'DIALOGUE') {
            const boxHeight = 150; const boxY = canvas.height - boxHeight - 20;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; ctx.fillRect(10, boxY, canvas.width - 20, boxHeight); ctx.strokeStyle = '#00ff00'; ctx.lineWidth = 2; ctx.strokeRect(10, boxY, canvas.width - 20, boxHeight); ctx.fillStyle = '#fff'; ctx.font = '30px monospace'; ctx.textAlign = 'left'; ctx.fillText(gameTexts.dialogue[currentLanguage][currentDialogueIndex], 30, boxY + 50);
        } else if (gameState === 'MISSION') {
            ctx.save(); ctx.globalAlpha = missionAlpha; ctx.textAlign = 'center'; ctx.font = '50px monospace'; ctx.fillStyle = 'white'; ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'; ctx.shadowBlur = 10; ctx.fillText(gameTexts.missionTitle[currentLanguage], canvas.width / 2, canvas.height / 2 - 30); ctx.font = '35px monospace'; ctx.fillStyle = '#FFD700'; ctx.fillText(gameTexts.missionObjective[currentLanguage], canvas.width / 2, canvas.height / 2 + 30); ctx.restore();
        } else if (gameState === 'PLAYING' || gameState === 'HEAL_BUTTON_PROMPT') { 
            ctx.fillStyle = 'white'; ctx.font = '40px monospace'; ctx.textAlign = 'left';
            ctx.fillText(`${gameTexts.score[currentLanguage]}: ${score}`, 20, 50);
            ctx.fillText(`${gameTexts.health[currentLanguage]}: ${health}`, 20, 90);
        }
        if (gameState === 'SYSTEM_ALERT_INTRO') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawSystemAlert(systemAlertGlitchedText);
        }
    }

    function gameLoop() {
        if (isTransitioning) {
            // Pausar el juego durante la transición
            return;
        }
        if (gameState === 'SYSTEM_ALERT_INTRO') { updateSystemAlert('HEAL_BUTTON_PROMPT');
        } else if (gameState === 'PLAYING') { updatePlaying();
        } else if (gameState === 'SPLASH_SCREEN') { updateSplashScreen();
        } else if (gameState === 'DIALOGUE') { updateDialogue();
        } else if (gameState === 'MISSION') { updateMission();
        }
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    loadAssets(initializeGame);
});