/* ========================================
   Von Bastik Tattoo Calculator - Game Logic
   ======================================== */

// State Management
const calculatorState = {
    currentStep: 0,
    totalSteps: 6,
    selections: {
        size: null,
        sizePrice: 0,
        zone: null,
        zoneMultiplier: 1,
        style: null,
        styleMultiplier: 1,
        complexity: null,
        complexityMultiplier: 1,
        color: null,
        colorMultiplier: 1,
        artist: null
    },
    xp: 0,
    totalXP: 600
};

// Zone multipliers (difficult areas take more time)
const zoneMultipliers = {
    'head': 1.15,
    'neck': 1.2,
    'shoulder-left': 1.0,
    'shoulder-right': 1.0,
    'chest': 1.1,
    'arm-left': 1.0,
    'arm-right': 1.0,
    'forearm-left': 1.0,
    'forearm-right': 1.0,
    'hand-left': 1.25,
    'hand-right': 1.25,
    'stomach': 1.05,
    'leg-left': 1.05,
    'leg-right': 1.05,
    'shin-left': 1.05,
    'shin-right': 1.05,
    'foot-left': 1.2,
    'foot-right': 1.2,
    'back': 1.15
};

// ========================================
// Particle System
// ========================================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ========================================
// Confetti System
// ========================================
function createConfetti() {
    const container = document.getElementById('confetti');
    if (!container) return;
    
    const colors = ['#c9a96e', '#f0d89d', '#d4b87a', '#fff', '#ff6b6b', '#feca57', '#48dbfb'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (5 + Math.random() * 10) + 'px';
        confetti.style.height = (5 + Math.random() * 10) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s ease-out ${Math.random() * 2}s forwards`;
        container.appendChild(confetti);
    }
    
    // Add confetti animation dynamically
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    opacity: 1;
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translateY(100vh) rotate(720deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// Calculator Flow
// ========================================
function startCalculator() {
    const hero = document.querySelector('.calc-hero');
    const calculator = document.getElementById('calculator');
    
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(-30px)';
    
    setTimeout(() => {
        hero.style.display = 'none';
        calculator.classList.add('active');
        updateStepDisplay();
    }, 500);
}

function nextStep() {
    // Validate that a selection has been made before advancing
    if (!validateCurrentStep()) {
        return;
    }

    if (calculatorState.currentStep < calculatorState.totalSteps - 1) {
        const currentStepEl = document.querySelector(`.step[data-step="${calculatorState.currentStep}"]`);
        currentStepEl.style.animation = 'slideOutLeft 0.3s ease-in forwards';
        
        setTimeout(() => {
            currentStepEl.classList.remove('active');
            currentStepEl.style.animation = '';
            calculatorState.currentStep++;
            calculatorState.xp += 100;
            updateStepDisplay();
            
            // Slide in new step
            const newStepEl = document.querySelector(`.step[data-step="${calculatorState.currentStep}"]`);
            newStepEl.classList.add('active');
        }, 300);
    } else {
        showResults();
    }
}

function validateCurrentStep() {
    const step = calculatorState.currentStep;
    const selections = calculatorState.selections;
    
    // Step 0: Size selection required
    if (step === 0 && !selections.size) {
        shakeStep();
        showToast('⚠️ Por favor, selecciona un tamaño');
        return false;
    }
    
    // Step 1: Zone selection required
    if (step === 1 && !selections.zone) {
        shakeStep();
        showToast('⚠️ Por favor, selecciona una zona');
        return false;
    }
    
    // Step 2: Style selection required
    if (step === 2 && !selections.style) {
        shakeStep();
        showToast('⚠️ Por favor, selecciona un estilo');
        return false;
    }
    
    // Step 3: Complexity selection required
    if (step === 3 && !selections.complexity) {
        shakeStep();
        showToast('⚠️ Por favor, selecciona un nivel de complejidad');
        return false;
    }
    
    // Step 4: Color selection required
    if (step === 4 && !selections.color) {
        shakeStep();
        showToast('⚠️ Por favor, selecciona color');
        return false;
    }
    
    // Step 5: Artist selection required
    if (step === 5 && !selections.artist) {
        shakeStep();
        showToast('⚠️ Por favor, selecciona un artista');
        return false;
    }
    
    return true;
}

function shakeStep() {
    const currentStepEl = document.querySelector(`.step[data-step="${calculatorState.currentStep}"]`);
    currentStepEl.style.animation = 'shake 0.5s ease-in';
    setTimeout(() => {
        currentStepEl.style.animation = '';
    }, 500);
}

function prevStep() {
    if (calculatorState.currentStep > 0) {
        const currentStepEl = document.querySelector(`.step[data-step="${calculatorState.currentStep}"]`);
        currentStepEl.style.animation = 'slideOutRight 0.3s ease-in forwards';
        
        setTimeout(() => {
            currentStepEl.classList.remove('active');
            currentStepEl.style.animation = '';
            calculatorState.currentStep--;
            updateStepDisplay();
            
            const newStepEl = document.querySelector(`.step[data-step="${calculatorState.currentStep}"]`);
            newStepEl.classList.add('active');
            newStepEl.style.animation = 'slideInLeft 0.3s ease-out';
        }, 300);
    }
}

function goToStep(step) {
    if (step <= calculatorState.currentStep) {
        const currentStepEl = document.querySelector(`.step[data-step="${calculatorState.currentStep}"]`);
        currentStepEl.classList.remove('active');
        
        calculatorState.currentStep = step;
        updateStepDisplay();
        
        const newStepEl = document.querySelector(`.step[data-step="${calculatorState.currentStep}"]`);
        newStepEl.classList.add('active');
    }
}

function updateStepDisplay() {
    const step = calculatorState.currentStep;
    
    // Update step label
    document.getElementById('stepLabel').textContent = `Paso ${step + 1} de ${calculatorState.totalSteps}`;
    
    // Update XP bar
    const xpPercent = (calculatorState.xp / calculatorState.totalXP) * 100;
    document.getElementById('xpBarFill').style.width = xpPercent + '%';
    document.getElementById('xpText').textContent = `${calculatorState.xp} XP`;
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index === step) {
            dot.classList.add('active');
        } else if (index < step) {
            dot.classList.add('completed');
        }
    });
    
    // Update navigation buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.style.display = step > 0 ? 'flex' : 'none';
    
    if (step === calculatorState.totalSteps - 1) {
        nextBtn.innerHTML = '<span>Ver Resultado</span><i class="fas fa-trophy"></i>';
    } else {
        nextBtn.innerHTML = '<span>Siguiente</span><i class="fas fa-arrow-right"></i>';
    }
}

// ========================================
// Selection Handlers
// ========================================
function handleSizeSelection(element) {
    const cards = document.querySelectorAll('.size-options .option-card');
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    calculatorState.selections.size = element.dataset.value;
    calculatorState.selections.sizePrice = parseInt(element.dataset.price);
    
    playSelectionSound();
    triggerHaptic();
}

function handleZoneSelection(element) {
    const zones = document.querySelectorAll('.zone-option');
    zones.forEach(zone => zone.classList.remove('selected'));
    element.classList.add('selected');
    
    // Also highlight SVG zones
    const zoneValue = element.dataset.zone;
    const zoneGroups = document.querySelectorAll('.body-zone-group');
    zoneGroups.forEach(g => g.classList.remove('selected'));
    
    if (zoneValue.includes(',')) {
        const zoneList = zoneValue.split(',');
        zoneList.forEach(z => {
            const svgZone = document.querySelector(`.body-zone[data-zone="${z}"]`);
            if (svgZone) svgZone.classList.add('active');
            const svgGroup = document.querySelector(`.body-zone-group[data-zone="${z}"]`);
            if (svgGroup) svgGroup.classList.add('selected');
        });
    } else {
        const svgZone = document.querySelector(`.body-zone[data-zone="${zoneValue}"]`);
        if (svgZone) svgZone.classList.add('active');
        const svgGroup = document.querySelector(`.body-zone-group[data-zone="${zoneValue}"]`);
        if (svgGroup) svgGroup.classList.add('selected');
    }
    
    calculatorState.selections.zone = zoneValue;
    calculatorState.selections.zoneMultiplier = zoneMultipliers[zoneValue.split(',')[0]] || 1;
    
    playSelectionSound();
    triggerHaptic();
}

function handleStyleSelection(element) {
    const cards = document.querySelectorAll('.style-cards .style-card');
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    calculatorState.selections.style = element.dataset.value;
    calculatorState.selections.styleMultiplier = parseFloat(element.dataset.price);
    
    playSelectionSound();
}

function handleComplexitySelection(element) {
    const cards = document.querySelectorAll('.complexity-options .complexity-card');
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    calculatorState.selections.complexity = element.dataset.value;
    calculatorState.selections.complexityMultiplier = parseFloat(element.dataset.multiplier);
    
    playSelectionSound();
}

function handleColorSelection(element) {
    const choices = document.querySelectorAll('.color-choice');
    choices.forEach(choice => choice.classList.remove('selected'));
    element.classList.add('selected');
    
    calculatorState.selections.color = element.dataset.value;
    calculatorState.selections.colorMultiplier = parseFloat(element.dataset.multiplier);
    
    playSelectionSound();
}

function handleArtistSelection(element) {
    const cards = document.querySelectorAll('.artist-cards .artist-card');
    cards.forEach(card => card.classList.remove('selected'));
    element.classList.add('selected');
    
    calculatorState.selections.artist = element.dataset.artist;
    
    playSelectionSound();
}

// ========================================
// Price Calculation
// ========================================
function calculatePrice() {
    const s = calculatorState.selections;
    
    let basePrice = s.sizePrice;
    let multiplier = s.zoneMultiplier * s.styleMultiplier * s.complexityMultiplier * s.colorMultiplier;
    
    let minPrice = Math.round(basePrice * multiplier * 0.9);
    let maxPrice = Math.round(basePrice * multiplier * 1.2);
    
    return { min: minPrice, max: maxPrice };
}

// ========================================
// Show Results
// ========================================
function showResults() {
    const calculator = document.getElementById('calculator');
    const results = document.getElementById('results');
    
    calculator.classList.remove('active');
    
    setTimeout(() => {
        results.classList.add('active');
        createConfetti();
        
        // Calculate and display price
        const price = calculatePrice();
        document.getElementById('priceMin').textContent = price.min + '€';
        document.getElementById('priceMax').textContent = price.max + '€';
        
        // Build summary
        const summaryItems = document.getElementById('summaryItems');
        summaryItems.innerHTML = '';
        
        const s = calculatorState.selections;
        
        const sizeLabels = { small: 'Pequeño', medium: 'Mediano', large: 'Grande', xlarge: 'Extra Grande' };
        
        const zoneLabels = {
            'head': 'Cabeza / Pantalla',
            'neck': 'Cuello',
            'shoulder-left': 'Hombro Izquierdo',
            'shoulder-right': 'Hombro Derecho',
            'chest': 'Pecho',
            'arm-left': 'Brazo Izquierdo',
            'arm-right': 'Brazo Derecho',
            'forearm-left': 'Antebrazo Izquierdo',
            'forearm-right': 'Antebrazo Derecho',
            'hand-left': 'Mano Izquierda',
            'hand-right': 'Mano Derecha',
            'stomach': 'Estómago',
            'leg-left': 'Muslo Izquierdo',
            'leg-right': 'Muslo Derecho',
            'shin-left': 'Pierna Izquierda',
            'shin-right': 'Pierna Derecha',
            'foot-left': 'Pie Izquierdo',
            'foot-right': 'Pie Derecho',
            'back': 'Espalda'
        };
        
        const zoneDisplay = s.zone ? (zoneLabels[s.zone.split(',')[0]] || s.zone.split(',')[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())) : 'No seleccionada';
        
        const styleLabels = {
            realism: 'Realismo',
            blackwork: 'Blackwork',
            fineline: 'Fine Line',
            watercolor: 'Acuarela',
            japanese: 'Japonés',
            minimalist: 'Minimalista',
            color: 'Color',
            traditional: 'Traditional'
        };
        const complexityLabels = {
            simple: 'Sencillo', moderate: 'Moderado', detailed: 'Detectado', intricate: 'Intricado'
        };
        const colorLabels = { bw: 'Blanco y Negro', color: 'Color', mixed: 'Mixto' };
        const artistLabels = { selene: 'Selene', inkbo: 'Inkbo', bigtorres: 'Big Torres' };
        
        const summaryData = [
            { icon: 'fas fa-ruler-combined', label: 'Tamaño', value: sizeLabels[s.size] || '-' },
            { icon: 'fas fa-map-marker-alt', label: 'Zona', value: zoneDisplay },
            { icon: 'fas fa-palette', label: 'Estilo', value: styleLabels[s.style] || '-' },
            { icon: 'fas fa-layer-group', label: 'Complejidad', value: complexityLabels[s.complexity] || '-' },
            { icon: 'fas fa-swatchbook', label: 'Color', value: colorLabels[s.color] || '-' },
            { icon: 'fas fa-user-edit', label: 'Artista', value: artistLabels[s.artist] || 'Sin seleccionar' }
        ];
        
        summaryData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'summary-item';
            div.innerHTML = `
                <span class="summary-item-label"><i class="${item.icon}"></i>${item.label}</span>
                <span class="summary-item-value">${item.value}</span>
            `;
            summaryItems.appendChild(div);
        });
    }, 400);
}

// ========================================
// Reset Calculator
// ========================================
function resetCalculator() {
    // Reset state
    calculatorState.currentStep = 0;
    calculatorState.selections = {
        size: null, sizePrice: 0,
        zone: null, zoneMultiplier: 1,
        style: null, styleMultiplier: 1,
        complexity: null, complexityMultiplier: 1,
        color: null, colorMultiplier: 1,
        artist: null
    };
    calculatorState.xp = 0;
    
    // Hide results, show hero
    document.getElementById('results').classList.remove('active');
    document.getElementById('calculator').classList.remove('active');
    
    const hero = document.querySelector('.calc-hero');
    hero.style.display = 'flex';
    
    setTimeout(() => {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 50);
    
    // Reset all selections
    document.querySelectorAll('.option-card, .style-card, .complexity-card, .color-choice, .artist-card, .zone-option')
        .forEach(el => el.classList.remove('selected'));
    
    // Reset SVG zones and groups
    document.querySelectorAll('.body-zone').forEach(z => z.classList.remove('active'));
    document.querySelectorAll('.body-zone-group').forEach(g => g.classList.remove('selected'));
    
    // Reset complexity (default to moderate)
    document.querySelector('.complexity-card[data-value="moderate"]').classList.add('selected');
    calculatorState.selections.complexity = 'moderate';
    calculatorState.selections.complexityMultiplier = 1.3;
    
    updateStepDisplay();
}

// ========================================
// WhatsApp with Completion Animation
// ========================================
function openWhatsApp() {
    const btn = document.getElementById('whatsappBtn');
    
    // Button animation feedback
    btn.style.transform = 'scale(0.95)';
    btn.style.filter = 'brightness(0.9)';
    
    setTimeout(() => {
        btn.style.transform = '';
        btn.style.filter = '';
        
        // Create mini confetti burst
        createMiniConfetti(btn);
        
        // Build WhatsApp message
        const s = calculatorState.selections;
        const price = calculatePrice();
        const sizeLabels = { small: 'Pequeño', medium: 'Mediano', large: 'Grande', xlarge: 'Extra Grande' };
        const zoneLabels = {
            'head': 'Cabeza', 'neck': 'Cuello', 'shoulder-left': 'Hombro Izquierdo', 'shoulder-right': 'Hombro Derecho',
            'chest': 'Pecho', 'arm-left': 'Brazo Izquierdo', 'arm-right': 'Brazo Derecho',
            'forearm-left': 'Antebrazo Izquierdo', 'forearm-right': 'Antebrazo Derecho',
            'hand-left': 'Mano Izquierda', 'hand-right': 'Mano Derecha',
            'stomach': 'Estómago', 'leg-left': 'Muslo Izquierdo', 'leg-right': 'Muslo Derecho',
            'shin-left': 'Pierna Izquierda', 'shin-right': 'Pierna Derecha',
            'foot-left': 'Pie Izquierdo', 'foot-right': 'Pie Derecho', 'back': 'Espalda'
        };
        const styleLabels = { realism: 'Realismo', blackwork: 'Blackwork', fineline: 'Fine Line', watercolor: 'Acuarela', japanese: 'Japonés', minimalist: 'Minimalista', color: 'Color', traditional: 'Traditional' };
        const complexityLabels = { simple: 'Sencillo', moderate: 'Moderado', detailed: 'Detectado', intricate: 'Intricado' };
        const colorLabels = { bw: 'Blanco y Negro', color: 'Color', mixed: 'Mixto' };
        
        const message = `¡Hola! 👋\n\nHe completado la calculadora de tatuaje en Von Bastik Studio:\n\n` +
            `📏 *Tamaño:* ${sizeLabels[s.size] || '-'}\n` +
            `📍 *Zona:* ${zoneLabels[s.zone?.split(',')[0]] || '-'}\n` +
            `🎨 *Estilo:* ${styleLabels[s.style] || '-'}\n` +
            `🔧 *Complejidad:* ${complexityLabels[s.complexity] || '-'}\n` +
            `🎭 *Color:* ${colorLabels[s.color] || '-'}\n` +
            `👨‍🎨 *Artista:* ${s.artist ? s.artist.charAt(0).toUpperCase() + s.artist.slice(1) : 'Sin seleccionar'}\n\n` +
            `💰 *Estimación:* ${price.min}€ - ${price.max}€\n\n¡Me gustaría reservar una cita!`;
        
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/34653053913?text=${encoded}`, '_blank');
    }, 150);
}

function createMiniConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#c9a96e', '#f0d89d', '#25D366', '#fff'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${5 + Math.random() * 8}px;
            height: ${5 + Math.random() * 8}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            pointer-events: none;
            z-index: 10000;
            transition: all ${0.5 + Math.random() * 0.5}s ease-out;
        `;
        document.body.appendChild(confetti);
        
        requestAnimationFrame(() => {
            confetti.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 200}px`;
            confetti.style.top = `${rect.top - 50 - Math.random() * 100}px`;
            confetti.style.opacity = '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        });
        
        setTimeout(() => confetti.remove(), 1000);
    }
}

// ========================================
// Audio & Feedback
// ========================================
function playSelectionSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
        // Audio not supported
    }
}

function triggerHaptic() {
    if (navigator.vibrate) {
        navigator.vibrate(30);
    }
}

// ========================================
// Toast Notification
// ========================================
function showToast(message) {
    const toast = document.getElementById('calcToast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ========================================
// Animation Keyframes (inject dynamically)
// ========================================
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutLeft {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(-50px); }
        }
        @keyframes slideOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(50px); }
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// Event Listeners Initialization
// ========================================
function initEventListeners() {
    // Size options
    document.querySelectorAll('.size-options .option-card').forEach(card => {
        card.addEventListener('click', () => handleSizeSelection(card));
    });
    
    // Zone options
    document.querySelectorAll('.zone-option').forEach(option => {
        option.addEventListener('click', () => handleZoneSelection(option));
    });
    
    // SVG body zones (using groups now)
    document.querySelectorAll('.body-zone-group').forEach(group => {
        group.addEventListener('click', () => {
            const zoneValue = group.dataset.zone;
            const matchingOption = document.querySelector(`.zone-option[data-zone="${zoneValue}"]`);
            if (matchingOption) {
                handleZoneSelection(matchingOption);
            }
        });
    });
    
    // Style cards
    document.querySelectorAll('.style-cards .style-card').forEach(card => {
        card.addEventListener('click', () => handleStyleSelection(card));
    });
    
    // Complexity cards
    document.querySelectorAll('.complexity-options .complexity-card').forEach(card => {
        card.addEventListener('click', () => handleComplexitySelection(card));
    });
    
    // Color options
    document.querySelectorAll('.color-choice').forEach(choice => {
        choice.addEventListener('click', () => handleColorSelection(choice));
    });
    
    // Artist cards
    document.querySelectorAll('.artist-cards .artist-card').forEach(card => {
        card.addEventListener('click', () => handleArtistSelection(card));
    });
    
    // Step dots navigation
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const step = parseInt(dot.dataset.step);
            goToStep(step);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
            e.preventDefault();
            nextStep();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevStep();
        }
    });
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    injectAnimationStyles();
    initEventListeners();
    
    // Set initial complexity to moderate (default)
    const defaultComplexity = document.querySelector('.complexity-card[data-value="moderate"]');
    if (defaultComplexity) {
        handleComplexitySelection(defaultComplexity);
    }
});
