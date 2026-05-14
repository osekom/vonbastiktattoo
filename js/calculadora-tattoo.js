/* ========================================
   Von Bastik Tattoo Calculator - Game Logic
   ======================================== */

// State Management
const calculatorState = {
    currentStep: 0,
    totalSteps: 6,
    serviceType: null, // 'tattoo' | 'laser' | 'piercing'
    laserSize: null,
    laserPrice: 0,
    selections: {
        size: null,
        sizeMin: 0,
        sizeMax: 0,
        zone: null,
        xlargeArea: null,
        xlargeSessionsMin: 0,
        xlargeSessionsMax: 0,
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

// Piercing state
const piercingState = {
    step: 0,
    material: null,
    type: null,
    quantity: null
};

// Zone multipliers
const zoneMultipliers = {
    'head': 1.15, 'neck': 1.2,
    'shoulder-left': 1.0, 'shoulder-right': 1.0,
    'chest': 1.1,
    'arm-left': 1.0, 'arm-right': 1.0,
    'forearm-left': 1.0, 'forearm-right': 1.0,
    'hand-left': 1.25, 'hand-right': 1.25,
    'stomach': 1.05,
    'leg-left': 1.05, 'leg-right': 1.05,
    'shin-left': 1.05, 'shin-right': 1.05,
    'foot-left': 1.2, 'foot-right': 1.2,
    'back': 1.15
};

const BASE_XLARGE_SESSION_PRICE = 500;
const XLARGE_DISCOUNT = 0.2;
const xlargeConfigurations = {
    full_arm: { label: 'Brazo completo', sessionsMin: 5, sessionsMax: 8 },
    full_leg: { label: 'Pierna completa', sessionsMin: 10, sessionsMax: 15 },
    full_back: { label: 'Espalda completa', sessionsMin: 6, sessionsMax: 10 },
    chest_piece: { label: 'Pecho', sessionsMin: 3, sessionsMax: 3 },
    full_torso: { label: 'Torso completo', sessionsMin: 6, sessionsMax: 8 },
    outer_arm: { label: 'Brazo exterior', sessionsMin: 3, sessionsMax: 3 },
    outer_leg: { label: 'Pierna exterior', sessionsMin: 4, sessionsMax: 4 }
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
        confetti.style.animation = 'confettiFall ' + (2 + Math.random() * 3) + 's ease-out ' + (Math.random() * 2) + 's forwards';
        container.appendChild(confetti);
    }
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = '@keyframes confettiFall { 0% { opacity:1; transform:translateY(0) rotate(0deg); } 100% { opacity:0; transform:translateY(100vh) rotate(720deg); } }';
        document.head.appendChild(style);
    }
}

// ========================================
// Calculator Flow
// ========================================
function startCalculator() {
    const hero = document.querySelector('.calc-hero');
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(-30px)';
    setTimeout(function() {
        hero.style.display = 'none';
        showServiceSelector();
    }, 500);
}

function showServiceSelector() {
    document.getElementById('serviceSelector').classList.add('active');
}

function isXlargeSelection() {
    return calculatorState.selections.size === 'xlarge';
}

function getXlargeConfiguration() {
    return xlargeConfigurations[calculatorState.selections.xlargeArea] || null;
}

function formatSessionsRange(min, max) {
    return min === max ? min + ' sesiones' : min + ' a ' + max + ' sesiones';
}

function formatPriceRange(min, max) {
    return min === max ? min + '€' : min + '€ - ' + max + '€';
}

function updateTattooPlacementStep() {
    const title = document.getElementById('placementStepTitle');
    const subtitle = document.getElementById('placementStepSubtitle');
    const regularZones = document.getElementById('regularZoneOptions');
    const xlargeOptions = document.getElementById('xlargeOptions');
    const xlargeNote = document.getElementById('xlargeStepNote');
    if (!title || !subtitle || !regularZones || !xlargeOptions || !xlargeNote) return;

    if (isXlargeSelection()) {
        title.textContent = '¿Qué cobertura extra grande quieres?';
        subtitle.textContent = 'Selecciona la pieza completa para calcular sesiones y total estimado';
        regularZones.style.display = 'none';
        xlargeOptions.style.display = 'grid';
        xlargeNote.style.display = 'flex';
    } else {
        title.textContent = '¿En qué zona irá?';
        subtitle.textContent = 'Selecciona la parte del cuerpo para continuar con la estimación';
        regularZones.style.display = '';
        xlargeOptions.style.display = 'none';
        xlargeNote.style.display = 'none';
    }
}

function selectService(service) {
    calculatorState.serviceType = service;
    document.getElementById('serviceSelector').classList.remove('active');
    if (service === 'tattoo') {
        document.getElementById('calculator').classList.add('active');
        updateStepDisplay();
    } else if (service === 'laser') {
        calculatorState.laserSize = null;
        calculatorState.laserPrice = 0;
        document.querySelectorAll('#laserCalculator .option-card').forEach(function(c) { c.classList.remove('selected'); });
        document.getElementById('laserCalculator').classList.add('active');
    } else if (service === 'piercing') {
        piercingState.step = 0;
        piercingState.material = null;
        piercingState.type = null;
        piercingState.quantity = null;
        document.querySelectorAll('#piercingCalculator .option-card').forEach(function(c) { c.classList.remove('selected'); });
        document.querySelectorAll('#piercingCalculator .step').forEach(function(s) { s.classList.remove('active'); });
        document.querySelector('#piercingCalculator .step[data-step-p="0"]').classList.add('active');
        document.getElementById('piercingCalculator').classList.add('active');
        updatePiercingStepDisplay();
    }
}

function backToServiceSelector() {
    document.getElementById('calculator').classList.remove('active');
    document.getElementById('laserCalculator').classList.remove('active');
    document.getElementById('piercingCalculator').classList.remove('active');
    showServiceSelector();
}

function nextStep() {
    if (!validateCurrentStep()) return;
    if (calculatorState.currentStep < calculatorState.totalSteps - 1) {
        const currentStepEl = document.querySelector('.step[data-step="' + calculatorState.currentStep + '"]');
        currentStepEl.style.animation = 'slideOutLeft 0.3s ease-in forwards';
        setTimeout(function() {
            currentStepEl.classList.remove('active');
            currentStepEl.style.animation = '';
            calculatorState.currentStep++;
            calculatorState.xp += 100;
            updateStepDisplay();
            const newStepEl = document.querySelector('.step[data-step="' + calculatorState.currentStep + '"]');
            newStepEl.classList.add('active');
        }, 300);
    } else {
        showResults();
    }
}

function validateCurrentStep() {
    const step = calculatorState.currentStep;
    const s = calculatorState.selections;
    if (step === 0 && !s.size)       { shakeStep(); showToast('Por favor, selecciona un tamano'); return false; }
    if (step === 1 && isXlargeSelection() && !s.xlargeArea) { shakeStep(); showToast('Por favor, selecciona una cobertura extra grande'); return false; }
    if (step === 1 && !isXlargeSelection() && !s.zone)      { shakeStep(); showToast('Por favor, selecciona una zona'); return false; }
    if (step === 2 && !s.style)      { shakeStep(); showToast('Por favor, selecciona un estilo'); return false; }
    if (step === 3 && !s.complexity) { shakeStep(); showToast('Por favor, selecciona complejidad'); return false; }
    if (step === 4 && !s.color)      { shakeStep(); showToast('Por favor, selecciona color'); return false; }
    if (step === 5 && !s.artist)     { shakeStep(); showToast('Por favor, selecciona un artista'); return false; }
    return true;
}

function shakeStep() {
    const el = document.querySelector('.step[data-step="' + calculatorState.currentStep + '"]');
    if (!el) return;
    el.style.animation = 'shake 0.5s ease-in';
    setTimeout(function() { el.style.animation = ''; }, 500);
}

function prevStep() {
    if (calculatorState.currentStep > 0) {
        const currentStepEl = document.querySelector('.step[data-step="' + calculatorState.currentStep + '"]');
        currentStepEl.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(function() {
            currentStepEl.classList.remove('active');
            currentStepEl.style.animation = '';
            calculatorState.currentStep--;
            updateStepDisplay();
            const newStepEl = document.querySelector('.step[data-step="' + calculatorState.currentStep + '"]');
            newStepEl.classList.add('active');
            newStepEl.style.animation = 'slideInLeft 0.3s ease-out';
        }, 300);
    } else {
        backToServiceSelector();
    }
}

function goToStep(step) {
    if (step <= calculatorState.currentStep) {
        const currentStepEl = document.querySelector('.step[data-step="' + calculatorState.currentStep + '"]');
        currentStepEl.classList.remove('active');
        calculatorState.currentStep = step;
        updateStepDisplay();
        const newStepEl = document.querySelector('.step[data-step="' + calculatorState.currentStep + '"]');
        newStepEl.classList.add('active');
    }
}

function updateStepDisplay() {
    const step = calculatorState.currentStep;
    document.getElementById('stepLabel').textContent = 'Paso ' + (step + 1) + ' de ' + calculatorState.totalSteps;
    const xpPercent = (calculatorState.xp / calculatorState.totalXP) * 100;
    document.getElementById('xpBarFill').style.width = xpPercent + '%';
    document.getElementById('xpText').textContent = calculatorState.xp + ' XP';

    document.querySelectorAll('#calculator .dot').forEach(function(dot, index) {
        dot.classList.remove('active', 'completed');
        if (index === step) dot.classList.add('active');
        else if (index < step) dot.classList.add('completed');
    });

    const prevBtn = document.querySelector('#calculator .prev-btn');
    const nextBtn = document.querySelector('#calculator .next-btn');
    if (prevBtn) prevBtn.style.display = step > 0 ? 'flex' : 'none';
    if (nextBtn) {
        nextBtn.innerHTML = step === calculatorState.totalSteps - 1
            ? '<span>Ver Resultado</span><i class="fas fa-trophy"></i>'
            : '<span>Siguiente</span><i class="fas fa-arrow-right"></i>';
    }
}

// ========================================
// Selection Handlers
// ========================================
function handleSizeSelection(element) {
    document.querySelectorAll('.step[data-step="0"] .size-options .option-card').forEach(function(c) { c.classList.remove('selected'); });
    element.classList.add('selected');
    calculatorState.selections.size = element.dataset.value;
    calculatorState.selections.sizeMin = parseInt(element.dataset.min);
    calculatorState.selections.sizeMax = parseInt(element.dataset.max);
    calculatorState.selections.zone = null;
    calculatorState.selections.xlargeArea = null;
    calculatorState.selections.xlargeSessionsMin = 0;
    calculatorState.selections.xlargeSessionsMax = 0;
    document.querySelectorAll('.zone-option, .xlarge-option-card').forEach(function(c) { c.classList.remove('selected'); });
    updateTattooPlacementStep();
    playSelectionSound();
    triggerHaptic();
}

function handleZoneSelection(element) {
    document.querySelectorAll('.zone-option').forEach(function(z) { z.classList.remove('selected'); });
    document.querySelectorAll('.xlarge-option-card').forEach(function(card) { card.classList.remove('selected'); });
    element.classList.add('selected');
    const zoneValue = element.dataset.zone;
    document.querySelectorAll('.body-zone-group').forEach(function(g) { g.classList.remove('selected'); });
    if (zoneValue.includes(',')) {
        zoneValue.split(',').forEach(function(z) {
            const svgZone = document.querySelector('.body-zone[data-zone="' + z + '"]');
            if (svgZone) svgZone.classList.add('active');
            const svgGroup = document.querySelector('.body-zone-group[data-zone="' + z + '"]');
            if (svgGroup) svgGroup.classList.add('selected');
        });
    } else {
        const svgZone = document.querySelector('.body-zone[data-zone="' + zoneValue + '"]');
        if (svgZone) svgZone.classList.add('active');
        const svgGroup = document.querySelector('.body-zone-group[data-zone="' + zoneValue + '"]');
        if (svgGroup) svgGroup.classList.add('selected');
    }
    calculatorState.selections.zone = zoneValue;
    calculatorState.selections.xlargeArea = null;
    calculatorState.selections.xlargeSessionsMin = 0;
    calculatorState.selections.xlargeSessionsMax = 0;
    calculatorState.selections.zoneMultiplier = zoneMultipliers[zoneValue.split(',')[0]] || 1;
    playSelectionSound();
    triggerHaptic();
}

function handleXlargeSelection(element) {
    document.querySelectorAll('.xlarge-option-card').forEach(function(card) { card.classList.remove('selected'); });
    document.querySelectorAll('.zone-option').forEach(function(zone) { zone.classList.remove('selected'); });
    element.classList.add('selected');
    const config = xlargeConfigurations[element.dataset.area];
    calculatorState.selections.zone = null;
    calculatorState.selections.xlargeArea = element.dataset.area;
    calculatorState.selections.xlargeSessionsMin = config ? config.sessionsMin : 0;
    calculatorState.selections.xlargeSessionsMax = config ? config.sessionsMax : 0;
    playSelectionSound();
    triggerHaptic();
}

function handleStyleSelection(element) {
    document.querySelectorAll('.style-cards .style-card').forEach(function(c) { c.classList.remove('selected'); });
    element.classList.add('selected');
    calculatorState.selections.style = element.dataset.value;
    calculatorState.selections.styleMultiplier = parseFloat(element.dataset.price);
    playSelectionSound();
}

function handleComplexitySelection(element) {
    document.querySelectorAll('.complexity-options .complexity-card').forEach(function(c) { c.classList.remove('selected'); });
    element.classList.add('selected');
    calculatorState.selections.complexity = element.dataset.value;
    calculatorState.selections.complexityMultiplier = parseFloat(element.dataset.multiplier);
    playSelectionSound();
}

function handleColorSelection(element) {
    document.querySelectorAll('.color-choice').forEach(function(c) { c.classList.remove('selected'); });
    element.classList.add('selected');
    calculatorState.selections.color = element.dataset.value;
    calculatorState.selections.colorMultiplier = parseFloat(element.dataset.multiplier);
    playSelectionSound();
}

function handleArtistSelection(element) {
    document.querySelectorAll('.artist-cards .artist-card').forEach(function(c) { c.classList.remove('selected'); });
    element.classList.add('selected');
    calculatorState.selections.artist = element.dataset.artist;
    playSelectionSound();
}

// ========================================
// Laser Flow
// ========================================
function handleLaserSelection(el) {
    document.querySelectorAll('#laserCalculator .option-card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
    calculatorState.laserSize = el.dataset.value;
    calculatorState.laserPrice = parseInt(el.dataset.price);
    playSelectionSound();
    triggerHaptic();
}

function showLaserResult() {
    if (!calculatorState.laserSize) { showToast('Por favor, selecciona un tamano'); return; }
    showResults();
}

// ========================================
// Piercing Flow
// ========================================
function handlePiercingMaterial(el) {
    document.querySelectorAll('#piercingCalculator .piercing-material-card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
    piercingState.material = el.dataset.value;
    playSelectionSound();
    triggerHaptic();
}

function handlePiercingType(el) {
    document.querySelectorAll('#piercingCalculator .piercing-type-card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
    piercingState.type = el.dataset.value;
    playSelectionSound();
    triggerHaptic();
}

function handlePiercingQuantity(el) {
    document.querySelectorAll('#piercingCalculator .piercing-qty-card').forEach(function(c) { c.classList.remove('selected'); });
    el.classList.add('selected');
    piercingState.quantity = el.dataset.value;
    playSelectionSound();
    triggerHaptic();
}

function nextPiercingStep() {
    const step = piercingState.step;
    if (step === 0 && !piercingState.material) { showToast('Selecciona el material'); return; }
    if (step === 1 && !piercingState.type)     { showToast('Selecciona el tipo de piercing'); return; }
    if (step === 2 && !piercingState.quantity) { showToast('Selecciona la cantidad'); return; }
    if (step === 1 && piercingState.type === 'avanzado') { showResults(); return; }
    if (step === 2) { showResults(); return; }
    const currentEl = document.querySelector('#piercingCalculator .step[data-step-p="' + step + '"]');
    currentEl.classList.remove('active');
    piercingState.step++;
    if (piercingState.step === 2) {
        const unitPrice = piercingState.material === 'titanio' ? 30 : 20;
        const packPrice = piercingState.material === 'titanio' ? 50 : 30;
        document.getElementById('piercingUnitPrice').textContent = unitPrice + '€';
        document.getElementById('piercingPackPrice').textContent = packPrice + '€';
    }
    const nextEl = document.querySelector('#piercingCalculator .step[data-step-p="' + piercingState.step + '"]');
    nextEl.classList.add('active');
    updatePiercingStepDisplay();
}

function prevPiercingStep() {
    if (piercingState.step === 0) {
        document.getElementById('piercingCalculator').classList.remove('active');
        backToServiceSelector();
        return;
    }
    const currentEl = document.querySelector('#piercingCalculator .step[data-step-p="' + piercingState.step + '"]');
    currentEl.classList.remove('active');
    piercingState.step--;
    const prevEl = document.querySelector('#piercingCalculator .step[data-step-p="' + piercingState.step + '"]');
    prevEl.classList.add('active');
    updatePiercingStepDisplay();
}

function updatePiercingStepDisplay() {
    const step = piercingState.step;
    const totalSteps = piercingState.type === 'avanzado' ? 2 : 3;
    document.getElementById('piercingStepLabel').textContent = 'Piercing · Paso ' + (step + 1) + ' de ' + totalSteps;
    document.querySelectorAll('#piercingDots .dot').forEach(function(dot, i) {
        dot.classList.remove('active', 'completed');
        if (i === step) dot.classList.add('active');
        else if (i < step) dot.classList.add('completed');
    });
    const xpFill = document.getElementById('piercingXpFill');
    if (xpFill) xpFill.style.width = (((step + 1) / totalSteps) * 100) + '%';
    const nextBtn = document.getElementById('piercingNextBtn');
    const isLast = (step === 1 && piercingState.type === 'avanzado') || step === 2;
    nextBtn.innerHTML = isLast ? '<span>Ver Precio</span><i class="fas fa-trophy"></i>' : '<span>Siguiente</span><i class="fas fa-arrow-right"></i>';
    const prevBtn = document.getElementById('piercingPrevBtn');
    prevBtn.innerHTML = step === 0 ? '<i class="fas fa-arrow-left"></i><span>Volver</span>' : '<i class="fas fa-arrow-left"></i><span>Anterior</span>';
}

// ========================================
// Price Calculation
// ========================================
function calculatePrice() {
    var s = calculatorState.selections;
    if (s.size === 'xlarge') {
        var config = getXlargeConfiguration();
        if (!config) {
            return { min: BASE_XLARGE_SESSION_PRICE, max: BASE_XLARGE_SESSION_PRICE };
        }
        var min = config.sessionsMin * BASE_XLARGE_SESSION_PRICE;
        var max = config.sessionsMax * BASE_XLARGE_SESSION_PRICE;
        return {
            min: min,
            max: max,
            sessionPrice: BASE_XLARGE_SESSION_PRICE,
            sessionsMin: config.sessionsMin,
            sessionsMax: config.sessionsMax,
            discountMin: Math.round(min * (1 - XLARGE_DISCOUNT)),
            discountMax: Math.round(max * (1 - XLARGE_DISCOUNT))
        };
    }
    return { min: s.sizeMin || 0, max: s.sizeMax || 0 };
}

function calculateLaserPrice() {
    return calculatorState.laserPrice;
}

function calculatePiercingPrice() {
    var m = piercingState.material, t = piercingState.type, q = piercingState.quantity;
    if (t === 'avanzado') return m === 'acero' ? 50 : 70;
    if (q === 'pack2')    return m === 'acero' ? 30 : 50;
    return m === 'acero' ? 20 : 30;
}

// ========================================
// Show Results
// ========================================
function showResults() {
    document.getElementById('calculator').classList.remove('active');
    document.getElementById('laserCalculator').classList.remove('active');
    document.getElementById('piercingCalculator').classList.remove('active');
    document.getElementById('serviceSelector').classList.remove('active');
    var results = document.getElementById('results');
    setTimeout(function() {
        results.classList.add('active');
        createConfetti();
        var service = calculatorState.serviceType;
        var titleEl = document.getElementById('resultsTitle');
        var priceMin = document.getElementById('priceMin');
        var priceMax = document.getElementById('priceMax');
        var separator = document.querySelector('.price-separator');
        var priceNote = document.querySelector('.price-note');
        var xlNote = document.getElementById('xlarge-consult-note');
        if (xlNote) xlNote.style.display = 'none';
        if (separator) separator.style.display = '';
        if (service === 'laser') {
            titleEl.textContent = 'Precio estimado por sesión';
            priceMin.textContent = calculateLaserPrice() + '€';
            priceMax.textContent = '';
            if (separator) separator.style.display = 'none';
            priceNote.textContent = 'Precio por sesión. El número total varía según el tatuaje, colores y tipo de piel.';
        } else if (service === 'piercing') {
            titleEl.textContent = 'Precio estimado para tu piercing';
            priceMin.textContent = calculatePiercingPrice() + '€';
            priceMax.textContent = '';
            if (separator) separator.style.display = 'none';
            priceNote.textContent = 'Precio orientativo. Incluye joya y perforación profesional.';
        } else {
            var price = calculatePrice();
            titleEl.textContent = calculatorState.selections.size === 'xlarge' ? 'Tu tatuaje extra grande estimado es...' : 'Tu tatuaje estimado es...';
            if (price.min === price.max) {
                priceMin.textContent = price.min + '€';
                priceMax.textContent = '';
                if (separator) separator.style.display = 'none';
                if (calculatorState.selections.size === 'xlarge' && xlNote) {
                    xlNote.style.display = 'flex';
                    xlNote.innerHTML = '<i class="fas fa-info-circle"></i><span><strong>Tarifa base:</strong> ' + BASE_XLARGE_SESSION_PRICE + '€/sesión. <strong>Sesiones estimadas:</strong> ' + formatSessionsRange(price.sessionsMin || 1, price.sessionsMax || 1) + '. <strong>Promo web:</strong> ' + formatPriceRange(price.discountMin || price.min, price.discountMax || price.max) + ' con el 20% aplicado.</span>';
                }
                priceNote.textContent = calculatorState.selections.size === 'xlarge' ? 'Precio total orientativo para la pieza extra grande elegida.' : 'Precio base por sesión. Habla con nosotros para el presupuesto total.';
            } else {
                priceMin.textContent = price.min + '€';
                priceMax.textContent = price.max + '€';
                if (calculatorState.selections.size === 'xlarge' && xlNote) {
                    xlNote.style.display = 'flex';
                    xlNote.innerHTML = '<i class="fas fa-info-circle"></i><span><strong>Tarifa base:</strong> ' + BASE_XLARGE_SESSION_PRICE + '€/sesión. <strong>Sesiones estimadas:</strong> ' + formatSessionsRange(price.sessionsMin, price.sessionsMax) + '. <strong>Promo web:</strong> ' + formatPriceRange(price.discountMin, price.discountMax) + ' con el 20% aplicado.</span>';
                }
                priceNote.textContent = calculatorState.selections.size === 'xlarge' ? 'Rango total orientativo para la cobertura extra grande seleccionada.' : 'Precio orientativo. Zona, estilo, detalle y artista pueden variar el precio final.';
            }
        }
        buildResultsSummary(service);
    }, 400);
}

function buildResultsSummary(service) {
    var summaryItems = document.getElementById('summaryItems');
    summaryItems.innerHTML = '';
    var summaryData = [];
    if (service === 'laser') {
        var laserLabels = { small_laser: 'Pequeño (<=5cm)', medium_laser: 'Mediano (5-15cm)', large_laser: 'Grande (+15cm)' };
        summaryData = [
            { icon: 'fas fa-bolt', label: 'Servicio', value: 'Eliminación Láser' },
            { icon: 'fas fa-ruler-combined', label: 'Tamaño', value: laserLabels[calculatorState.laserSize] || '-' }
        ];
    } else if (service === 'piercing') {
        var matLabels  = { acero: 'Acero Quirúrgico', titanio: 'Titanio Grado Implante' };
        var typeLabels = { basico: 'Básico', avanzado: 'Avanzado' };
        var qtyLabels  = { unidad: '1 unidad', pack2: 'Pack 2 piercings' };
        summaryData = [
            { icon: 'fas fa-ring', label: 'Servicio', value: 'Piercing' },
            { icon: 'fas fa-circle-notch', label: 'Material', value: matLabels[piercingState.material] || '-' },
            { icon: 'fas fa-layer-group', label: 'Tipo', value: typeLabels[piercingState.type] || '-' }
        ];
        if (piercingState.quantity) summaryData.push({ icon: 'fas fa-hashtag', label: 'Cantidad', value: qtyLabels[piercingState.quantity] || '-' });
    } else {
        var s = calculatorState.selections;
        var sizeLabels = { chiqui: 'Chiqui (<=3cm)', small: 'Pequeño (<=10cm)', medium: 'Mediano (10-20cm)', large: 'Grande (20-30cm)', xlarge: 'Extra Grande (+30cm)' };
        var zoneLabels = {
            'head':'Cabeza','neck':'Cuello','shoulder-left':'Hombro','shoulder-right':'Hombro',
            'chest':'Pecho','arm-left':'Brazo','arm-right':'Brazo',
            'forearm-left':'Antebrazo','forearm-right':'Antebrazo',
            'hand-left':'Mano','hand-right':'Mano','stomach':'Estómago',
            'leg-left':'Muslo','leg-right':'Muslo','shin-left':'Pierna','shin-right':'Pierna',
            'foot-left':'Pie','foot-right':'Pie','back':'Espalda'
        };
        var styleLabels = { realism:'Realismo', blackwork:'Blackwork', fineline:'Fine Line', watercolor:'Acuarela', japanese:'Japonés', minimalist:'Minimalista', color:'Color', traditional:'Traditional' };
        var complexityLabels = { simple:'Sencillo', moderate:'Moderado', detailed:'Detallado', intricate:'Intrincado' };
        var colorLabels = { bw:'Blanco y Negro', color:'Color', mixed:'Mixto' };
        var artistLabels = { selene:'Selene', inkbo:'Inkbo', bigtorres:'Big Torres', ciervo:'Ciervo' };
        var zoneDisplay = s.zone ? (zoneLabels[s.zone.split(',')[0]] || s.zone) : 'No seleccionada';
        var xlargeConfig = getXlargeConfiguration();
        summaryData = [
            { icon:'fas fa-pen-nib', label:'Servicio', value:'Tatuaje' },
            { icon:'fas fa-ruler-combined', label:'Tamaño', value: sizeLabels[s.size] || '-' },
            { icon:'fas fa-palette', label:'Estilo', value: styleLabels[s.style] || '-' },
            { icon:'fas fa-layer-group', label:'Complejidad', value: complexityLabels[s.complexity] || '-' },
            { icon:'fas fa-swatchbook', label:'Color', value: colorLabels[s.color] || '-' },
            { icon:'fas fa-user-edit', label:'Artista', value: artistLabels[s.artist] || 'Sin seleccionar' }
        ];
        if (s.size === 'xlarge' && xlargeConfig) {
            var xlargePrice = calculatePrice();
            summaryData.splice(2, 0,
                { icon:'fas fa-expand-arrows-alt', label:'Cobertura XL', value: xlargeConfig.label },
                { icon:'fas fa-clock', label:'Sesiones estimadas', value: formatSessionsRange(xlargeConfig.sessionsMin, xlargeConfig.sessionsMax) },
                { icon:'fas fa-euro-sign', label:'Tarifa por sesión', value: BASE_XLARGE_SESSION_PRICE + '€/sesión' },
                { icon:'fas fa-tags', label:'Promo web', value: formatPriceRange(xlargePrice.discountMin, xlargePrice.discountMax) }
            );
        } else {
            summaryData.splice(2, 0, { icon:'fas fa-map-marker-alt', label:'Zona', value: zoneDisplay });
        }
    }
    summaryData.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = '<span class="summary-item-label"><i class="' + item.icon + '"></i>' + item.label + '</span><span class="summary-item-value">' + item.value + '</span>';
        summaryItems.appendChild(div);
    });
}

// ========================================
// Reset Calculator
// ========================================
function resetCalculator() {
    calculatorState.currentStep = 0;
    calculatorState.serviceType = null;
    calculatorState.laserSize = null;
    calculatorState.laserPrice = 0;
    calculatorState.selections = { size:null, sizeMin:0, sizeMax:0, zone:null, xlargeArea:null, xlargeSessionsMin:0, xlargeSessionsMax:0, zoneMultiplier:1, style:null, styleMultiplier:1, complexity:null, complexityMultiplier:1, color:null, colorMultiplier:1, artist:null };
    calculatorState.xp = 0;
    piercingState.step = 0; piercingState.material = null; piercingState.type = null; piercingState.quantity = null;
    document.getElementById('results').classList.remove('active');
    document.getElementById('calculator').classList.remove('active');
    document.getElementById('laserCalculator').classList.remove('active');
    document.getElementById('piercingCalculator').classList.remove('active');
    document.getElementById('serviceSelector').classList.remove('active');
    var hero = document.querySelector('.calc-hero');
    hero.style.display = 'flex';
    setTimeout(function() { hero.style.opacity = '1'; hero.style.transform = 'translateY(0)'; }, 50);
    document.querySelectorAll('.option-card, .style-card, .complexity-card, .color-choice, .artist-card, .zone-option').forEach(function(el) { el.classList.remove('selected'); });
    document.querySelectorAll('.body-zone').forEach(function(z) { z.classList.remove('active'); });
    document.querySelectorAll('.body-zone-group').forEach(function(g) { g.classList.remove('selected'); });
    var sep = document.querySelector('.price-separator');
    if (sep) sep.style.display = '';
    var xlNote = document.getElementById('xlarge-consult-note');
    if (xlNote) {
        xlNote.innerHTML = '<i class="fas fa-info-circle"></i><span>Precio base por sesión para tatuajes extra grandes. El número de sesiones depende de la cobertura elegida.</span>';
        xlNote.style.display = 'none';
    }
    updateTattooPlacementStep();
    var moderateCard = document.querySelector('.complexity-card[data-value="moderate"]');
    if (moderateCard) { moderateCard.classList.add('selected'); calculatorState.selections.complexity = 'moderate'; calculatorState.selections.complexityMultiplier = 1.3; }
    updateStepDisplay();
}

// ========================================
// WhatsApp
// ========================================
function openWhatsApp() {
    var btn = document.getElementById('whatsappBtn');
    btn.style.transform = 'scale(0.95)';
    btn.style.filter = 'brightness(0.9)';
    setTimeout(function() {
        btn.style.transform = '';
        btn.style.filter = '';
        createMiniConfetti(btn);
        var service = calculatorState.serviceType;
        var message = 'Hola! He consultado precios en Von Bastik:\n\n';
        if (service === 'laser') {
            var laserLabels = { small_laser:'Pequeño (<=5cm)', medium_laser:'Mediano (5-15cm)', large_laser:'Grande (+15cm)' };
            message += 'Servicio: Eliminacion Laser\n';
            message += 'Tamano: ' + (laserLabels[calculatorState.laserSize] || '-') + '\n';
            message += 'Estimado/sesion: ' + calculateLaserPrice() + 'EUR\n\n';
            message += 'Me gustaria pedir mas informacion!';
        } else if (service === 'piercing') {
            var matLabels = { acero:'Acero Quirurgico', titanio:'Titanio Grado Implante' };
            var typeLabels = { basico:'Basico', avanzado:'Avanzado' };
            var qtyLabels = { unidad:'1 unidad', pack2:'Pack 2 piercings' };
            message += 'Servicio: Piercing\n';
            message += 'Material: ' + (matLabels[piercingState.material] || '-') + '\n';
            message += 'Tipo: ' + (typeLabels[piercingState.type] || '-') + '\n';
            if (piercingState.quantity) message += 'Cantidad: ' + (qtyLabels[piercingState.quantity] || '-') + '\n';
            message += 'Estimado: ' + calculatePiercingPrice() + 'EUR\n\nMe gustaria reservar cita!';
        } else {
            var s = calculatorState.selections;
            var price = calculatePrice();
            var sizeLabels = { chiqui:'Chiqui (<=3cm)', small:'Pequeno (<=10cm)', medium:'Mediano (10-20cm)', large:'Grande (20-30cm)', xlarge:'Extra Grande (+30cm)' };
            var styleLabels = { realism:'Realismo', blackwork:'Blackwork', fineline:'Fine Line', watercolor:'Acuarela', japanese:'Japones', minimalist:'Minimalista', color:'Color', traditional:'Traditional' };
            message += 'Servicio: Tatuaje\n';
            message += 'Tamano: ' + (sizeLabels[s.size] || '-') + '\n';
            if (s.size === 'xlarge' && getXlargeConfiguration()) {
                var xlConfig = getXlargeConfiguration();
                message += 'Cobertura XL: ' + xlConfig.label + '\n';
                message += 'Sesiones estimadas: ' + formatSessionsRange(xlConfig.sessionsMin, xlConfig.sessionsMax) + '\n';
                message += 'Promo web: ' + formatPriceRange(price.discountMin, price.discountMax) + '\n';
            }
            message += 'Estilo: ' + (styleLabels[s.style] || '-') + '\n';
            message += 'Artista: ' + (s.artist || 'Sin seleccionar') + '\n';
            message += price.min === price.max ? 'Estimacion: ' + price.min + 'EUR/sesion\n\n' : 'Estimacion: ' + price.min + 'EUR - ' + price.max + 'EUR\n\n';
            message += 'Me gustaria reservar una cita!';
        }
        window.open('https://wa.me/34653053913?text=' + encodeURIComponent(message), '_blank');
    }, 150);
}

function createMiniConfetti(element) {
    var rect = element.getBoundingClientRect();
    var colors = ['#c9a96e', '#f0d89d', '#25D366', '#fff'];
    for (var i = 0; i < 20; i++) {
        var confetti = document.createElement('div');
        confetti.style.cssText = 'position:fixed;width:' + (5+Math.random()*8) + 'px;height:' + (5+Math.random()*8) + 'px;background:' + colors[Math.floor(Math.random()*colors.length)] + ';border-radius:' + (Math.random()>0.5?'50%':'0') + ';left:' + (rect.left+rect.width/2) + 'px;top:' + rect.top + 'px;pointer-events:none;z-index:10000;transition:all ' + (0.5+Math.random()*0.5) + 's ease-out;';
        document.body.appendChild(confetti);
        (function(c) {
            requestAnimationFrame(function() {
                c.style.left = (rect.left+rect.width/2+(Math.random()-0.5)*200) + 'px';
                c.style.top = (rect.top-50-Math.random()*100) + 'px';
                c.style.opacity = '0';
            });
            setTimeout(function() { c.remove(); }, 1000);
        })(confetti);
    }
}

// ========================================
// Audio & Feedback
// ========================================
function playSelectionSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
}

function triggerHaptic() { if (navigator.vibrate) navigator.vibrate(30); }

function showToast(message) {
    var toast = document.getElementById('calcToast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2500);
}

function injectAnimationStyles() {
    var style = document.createElement('style');
    style.textContent = '@keyframes slideOutLeft{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-50px)}}@keyframes slideOutRight{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(50px)}}@keyframes slideInLeft{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}';
    document.head.appendChild(style);
}

// ========================================
// Event Listeners
// ========================================
function initEventListeners() {
    document.querySelectorAll('.step[data-step="0"] .size-options .option-card').forEach(function(c) { c.addEventListener('click', function() { handleSizeSelection(c); }); });
    document.querySelectorAll('.zone-option').forEach(function(o) { o.addEventListener('click', function() { handleZoneSelection(o); }); });
    document.querySelectorAll('.xlarge-option-card').forEach(function(card) { card.addEventListener('click', function() { handleXlargeSelection(card); }); });
    document.querySelectorAll('.body-zone-group').forEach(function(g) {
        g.addEventListener('click', function() {
            var m = document.querySelector('.zone-option[data-zone="' + g.dataset.zone + '"]');
            if (m) handleZoneSelection(m);
        });
    });
    document.querySelectorAll('.style-cards .style-card').forEach(function(c) { c.addEventListener('click', function() { handleStyleSelection(c); }); });
    document.querySelectorAll('.complexity-options .complexity-card').forEach(function(c) { c.addEventListener('click', function() { handleComplexitySelection(c); }); });
    document.querySelectorAll('.color-choice').forEach(function(c) { c.addEventListener('click', function() { handleColorSelection(c); }); });
    document.querySelectorAll('.artist-cards .artist-card').forEach(function(c) { c.addEventListener('click', function() { handleArtistSelection(c); }); });
    document.querySelectorAll('#calculator .dot').forEach(function(dot) {
        dot.addEventListener('click', function() { goToStep(parseInt(dot.dataset.step)); });
    });
    document.querySelectorAll('#laserCalculator .option-card').forEach(function(c) { c.addEventListener('click', function() { handleLaserSelection(c); }); });
    document.querySelectorAll('.piercing-material-card').forEach(function(c) { c.addEventListener('click', function() { handlePiercingMaterial(c); }); });
    document.querySelectorAll('.piercing-type-card').forEach(function(c) { c.addEventListener('click', function() { handlePiercingType(c); }); });
    document.querySelectorAll('.piercing-qty-card').forEach(function(c) { c.addEventListener('click', function() { handlePiercingQuantity(c); }); });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); nextStep(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
    });
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    injectAnimationStyles();
    initEventListeners();
    updateTattooPlacementStep();
    var moderateCard = document.querySelector('.complexity-card[data-value="moderate"]');
    if (moderateCard) {
        moderateCard.classList.add('selected');
        calculatorState.selections.complexity = 'moderate';
        calculatorState.selections.complexityMultiplier = 1.3;
    }
});
