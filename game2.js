document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores del DOM ---
    const loreOverlay = document.getElementById('lore-intro-overlay');
    const gameContainer = document.getElementById('game-container');
    const loreTextEl = document.getElementById('lore-text');
    const continuePromptEl = document.getElementById('continue-prompt');

    // Usamos una clave específica para la intro de esta etapa
    const isFirstVisit = !localStorage.getItem('eg_game2_intro_completed');

    // Textos del juego para fácil modificación y traducción futura
    const game2Texts = {
        lore: {
            es: "???: Despierta, pequeño.",
            en: "???: Wake up, little one."
        },
        continue: {
            es: "[Toca para continuar]",
            en: "[Tap to continue]"
        }
    };
    
    // Determinar idioma actual (heredado del menú principal)
    const currentLanguage = localStorage.getItem('eg_language') || 'es';

    // Función para mostrar el contenido principal del juego
    const showGameContent = () => {
        // Ocultar el overlay de introducción
        loreOverlay.classList.add('hidden');
        
        // Mostrar el contenedor del juego
        gameContainer.classList.remove('hidden');

        // Marcar en el almacenamiento local que la intro ya se ha visto
        localStorage.setItem('eg_game2_intro_completed', 'true');
        
        // Quitar el event listener para no volver a activarlo
        loreOverlay.removeEventListener('click', showGameContent);

        // Aquí se iniciaría la lógica del juego real (que construiremos después)
        initializeGame();
    };

    // --- Lógica Principal al Cargar la Página ---
    if (isFirstVisit) {
        // 1. Si es la primera vez, configuramos y mostramos el overlay
        
        // Asignar los textos de la introducción
        loreTextEl.textContent = game2Texts.lore[currentLanguage];
        continuePromptEl.textContent = game2Texts.continue[currentLanguage];

        // Añadimos un event listener para que el jugador pueda continuar
        loreOverlay.addEventListener('click', showGameContent);

    } else {
        // 2. Si no es la primera vez, saltamos la intro y mostramos el juego directamente
        showGameContent();
    }

    // Función donde vivirá toda la lógica del Acto 2
    function initializeGame() {
        console.log("El Acto 2 ha comenzado.");
        // Por ahora, está vacío, pero aquí es donde construiremos la nueva interfaz y jugabilidad.
        const dialogueText = document.getElementById('dialogue-text');
        dialogueText.textContent = "¿Dónde... dónde estoy ahora?";
    }
});
