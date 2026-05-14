(function () {
    'use strict';

    var form = document.getElementById('promptForm');
    var promptInput = document.getElementById('promptInput');
    var chatThread = document.getElementById('chatThread');
    var statusText = document.getElementById('statusText');
    var versionText = document.getElementById('versionText');
    var chipButtons = document.querySelectorAll('.ai-chip');

    if (!form || !promptInput || !chatThread || !statusText || !versionText) {
        return;
    }

    var state = {
        prompt: '',
        version: 0,
        currentBlobUrl: '',
        pendingTimer: null,
        promoTimer: null,
        retryCount: 0,
        conversationCount: 0,
        finalPromoShown: false
    };

    appendAssistantMessage(
        'Escribe tu idea y yo te la devuelvo como si estuviera afinando un concepto serio de tatuaje. '
        + 'Luego te enseñaré el diseño y, si insistes, haré teatro con la IA.',
        'listo'
    );

    chipButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            promptInput.value = button.getAttribute('data-prompt') || '';
            promptInput.focus();
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var prompt = promptInput.value.trim();
        if (!prompt) {
            promptInput.focus();
            promptInput.placeholder = 'Escribe algo para que la IA pueda improvisar';
            return;
        }

        state.prompt = prompt;
        state.version += 1;
        state.conversationCount += 1;
        state.retryCount = 0;

        appendUserMessage(prompt);
        appendAssistantMessage('Déjame pensarlo... voy a generar un concepto visual para eso.', 'typing', true);
        setStatus('Generando diseño...');

        clearTimeout(state.pendingTimer);
        clearTimeout(state.promoTimer);
        state.pendingTimer = setTimeout(function () {
            updateAssistantMessage('typing', 'Ups... creo que no te ha gustado.');
            updateAssistantMessage('typing-note', 'La IA está haciendo lo que puede, pero quizá necesite un poco más de vida interior.');
            appendRenderMessage(state.prompt, state.version, 'Resultado ' + state.version);
            appendRetryMessage();
            setStatus('Esperando tu siguiente respuesta.');
            versionText.textContent = String(state.conversationCount);
        }, 1400);
    });

    function appendUserMessage(text) {
        chatThread.appendChild(createMessageElement('user', text, 'Tú'));
        scrollChatToBottom();
    }

    function appendAssistantMessage(text, type, withAction) {
        var message = createMessageElement('assistant', text, 'IA');
        if (type === 'typing') {
            message.dataset.role = 'typing';
        }
        if (type === 'typing-note') {
            message.dataset.role = 'typing-note';
        }
        if (withAction) {
            message.dataset.pendingActions = 'true';
        }
        chatThread.appendChild(message);
        scrollChatToBottom();
        return message;
    }

    function updateAssistantMessage(role, text) {
        var target = chatThread.querySelector('[data-role="' + role + '"]');
        if (!target) {
            target = appendAssistantMessage(text, role);
            target.dataset.role = role;
            return target;
        }

        var textNode = target.querySelector('.ai-chat-bubble p');
        if (textNode) {
            textNode.textContent = text;
        }
        scrollChatToBottom();
        return target;
    }

    function appendRenderMessage(prompt, version, label) {
        // Alternar entre dos imágenes de prueba según el intento
        var imageIndex = ((state.retryCount % 2) === 0) ? 0 : 1;
        var imageNames = ['GisusFacha.png', 'GokuFacha.png'];
        var imageSrc = 'public/images/' + imageNames[imageIndex];

        var message = document.createElement('article');
        message.className = 'ai-chat-message ai-chat-message--assistant';
        message.innerHTML = ''
            + '<div class="ai-chat-avatar" aria-hidden="true"><i class="fas fa-robot"></i></div>'
            + '<div class="ai-chat-bubble">'
            + '<div class="ai-chat-meta"><span>' + label + '</span><span>meme</span></div>'
            + '<div class="ai-chat-render">'
            + '<img class="ai-chat-render__image" src="' + imageSrc + '" alt="Diseño meme para: ' + escapeXml(prompt) + '">'
            + '<div class="ai-chat-render__note">Éste es el resultado de la IA 🤖 no es lo tuyo, ¿verdad?</div>'
            + '</div>';

        chatThread.appendChild(message);
        scrollChatToBottom();
        return message;
    }

    function appendRetryMessage() {
        var existing = chatThread.querySelector('.ai-chat-retry');
        if (existing) {
            existing.remove();
        }

        var wrap = document.createElement('div');
        wrap.className = 'ai-chat-message ai-chat-message--assistant ai-chat-retry';
        wrap.innerHTML = ''
            + '<div class="ai-chat-avatar" aria-hidden="true"><i class="fas fa-robot"></i></div>'
            + '<div class="ai-chat-bubble">'
            + '<p>¿Quieres que lo intente de nuevo con otro enfoque?</p>'
            + '<div class="ai-chat-actions">'
            + '<button type="button" class="ai-secondary" id="retryButton">'
            + '<i class="fas fa-rotate-right"></i><span>Reintentar</span>'
            + '</button>'
            + '</div>'
            + '</div>';

        chatThread.appendChild(wrap);
        var retryButton = wrap.querySelector('#retryButton');
        if (retryButton) {
            retryButton.addEventListener('click', handleRetry);
        }
        scrollChatToBottom();
    }

    function handleRetry() {
        if (!state.prompt) {
            return;
        }

        state.retryCount += 1;
        state.conversationCount += 1;
        versionText.textContent = String(state.conversationCount);

        appendUserMessage('Prueba otra versión del mismo concepto, pero más clara.');
        appendAssistantMessage('Voy a ajustar la composición y a darle otra lectura.', 'typing');
        setStatus('Retocando el segundo intento...');

        clearTimeout(state.pendingTimer);
        clearTimeout(state.promoTimer);

        state.pendingTimer = setTimeout(function () {
            appendRenderMessage(state.prompt + ' - intento ' + (state.retryCount + 1), state.version + state.retryCount, 'Resultado ' + (state.retryCount + 1));

            if (!state.finalPromoShown) {
                state.finalPromoShown = true;
                state.promoTimer = setTimeout(function () {
                    appendAssistantMessage('No te gustó cierto? Los mensajes de verdad estan en Von Bastik. Somos tres artistas especializados en realismo, blackwork y fine line. Si lo que buscas es una pieza con criterio y experiencia, nos encantaría ayudarte.', 'final');
                    appendFinalCTA();
                    setStatus('La conversación ya se ha salido de la IA.');
                }, 700);
            }
        }, 1100);
    }

    function appendFinalCTA() {
        var message = document.createElement('article');
        message.className = 'ai-chat-message ai-chat-message--assistant';
        message.innerHTML = ''
            + '<div class="ai-chat-avatar" aria-hidden="true"><i class="fas fa-map-pin"></i></div>'
            + '<div class="ai-chat-bubble">'
            + '<div class="ai-chat-meta"><span>Von Bastik</span><span>estudio real</span></div>'
            + '<div class="ai-contact-info">'
            + '<p><strong>📍 Ubicación:</strong> Calle Victoria, 1 local B, Alcalá de Henares, Madrid</p>'
            + '<p><strong>⏰ Horarios:</strong> Martes a Sábado, 11:30-14:00 y 16:00-20:00</p>'
            + '<p><strong>📞 Teléfono:</strong> +34 653 053 913</p>'
            + '<p><strong>✉️ Email:</strong> vonbastiktattoo@gmail.com</p>'
            + '<p><strong>📱 Instagram:</strong> @vonbastiktattoo</p>'
            + '<div class="ai-cta-buttons">'
            + '<a href="https://api.whatsapp.com/send?phone=34653053913&text=Hola%20Von%20Bastik%2C%20quiero%20reservar%20una%20cita" target="_blank" class="ai-primary-link"><i class="fab fa-whatsapp"></i> WhatsApp</a>'
            + '<a href="index.html#artistas" class="ai-secondary-link"><i class="fas fa-users"></i> Ver artistas</a>'
            + '</div>'
            + '</div>'
            + '</div>';
        chatThread.appendChild(message);
        scrollChatToBottom();
    }

    function createMessageElement(role, text, label) {
        var message = document.createElement('article');
        message.className = 'ai-chat-message ai-chat-message--' + role;
        message.innerHTML = ''
            + '<div class="ai-chat-avatar" aria-hidden="true"><i class="fas ' + (role === 'user' ? 'fa-user' : 'fa-robot') + '"></i></div>'
            + '<div class="ai-chat-bubble">'
            + '<div class="ai-chat-meta"><span>' + label + '</span><span>' + (role === 'user' ? 'tú' : 'IA') + '</span></div>'
            + '<p>' + escapeXml(text) + '</p>'
            + '</div>';
        return message;
    }

    function setStatus(text) {
        statusText.textContent = text;
    }

    function scrollChatToBottom() {
        chatThread.scrollTop = chatThread.scrollHeight;
    }

    function createTattooSvg(prompt, version) {
        var seed = hashString(prompt + '|' + version);
        var random = mulberry32(seed);
        var palettes = [
            ['#070707', '#1c1c1c', '#c9a96e', '#f0d89d'],
            ['#0b0912', '#1d1630', '#7d5cff', '#e4d7ff'],
            ['#060606', '#14211f', '#4fd1c5', '#c9a96e'],
            ['#0a0a0a', '#301818', '#ff8a5b', '#f5d0c5']
        ];
        var palette = palettes[seed % palettes.length];
        var motif = pickMotif(prompt, random);
        var ringCount = 3 + Math.floor(random() * 3);
        var accentCount = 12 + Math.floor(random() * 10);
        var lineCount = 5 + Math.floor(random() * 4);
        var promptLabel = escapeXml(shortenPrompt(prompt));

        var svg = [
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" preserveAspectRatio="xMidYMid slice">',
            '<defs>',
            '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">',
            '<stop offset="0%" stop-color="' + palette[0] + '"/>',
            '<stop offset="55%" stop-color="' + palette[1] + '"/>',
            '<stop offset="100%" stop-color="#040404"/>',
            '</linearGradient>',
            '<radialGradient id="glow" cx="50%" cy="42%" r="60%">',
            '<stop offset="0%" stop-color="' + palette[3] + '" stop-opacity="0.85"/>',
            '<stop offset="100%" stop-color="' + palette[3] + '" stop-opacity="0"/>',
            '</radialGradient>',
            '<filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">',
            '<feGaussianBlur stdDeviation="24" result="blur"/>',
            '<feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.7 0"/>',
            '</filter>',
            '</defs>',
            '<rect width="1200" height="1200" fill="url(#bg)"/>',
            '<rect width="1200" height="1200" fill="url(#glow)" opacity="0.42"/>',
            '<g opacity="0.16">'
        ].join('');

        for (var i = 0; i < 22; i += 1) {
            svg += '<circle cx="' + Math.round(random() * 1200) + '" cy="' + Math.round(random() * 1200) + '" r="' + (1 + random() * 3).toFixed(1) + '" fill="#ffffff" />';
        }

        svg += '</g>';
        svg += '<g fill="none" stroke="' + palette[2] + '" stroke-linecap="round" stroke-linejoin="round">';

        for (var r = 0; r < ringCount; r += 1) {
            var radius = 180 + r * 64 + random() * 18;
            svg += '<circle cx="600" cy="560" r="' + radius.toFixed(1) + '" opacity="' + (0.24 - r * 0.04).toFixed(2) + '" stroke-width="' + (2 + r).toFixed(1) + '" />';
        }

        for (var l = 0; l < lineCount; l += 1) {
            var angle = (Math.PI * 2 * l) / lineCount + random() * 0.2;
            var innerX = 600 + Math.cos(angle) * 140;
            var innerY = 560 + Math.sin(angle) * 140;
            var outerX = 600 + Math.cos(angle) * (360 + random() * 80);
            var outerY = 560 + Math.sin(angle) * (360 + random() * 80);
            svg += '<path d="M' + innerX.toFixed(1) + ',' + innerY.toFixed(1) + ' Q ' + (600 + Math.cos(angle) * 220).toFixed(1) + ',' + (560 + Math.sin(angle) * 220).toFixed(1) + ' ' + outerX.toFixed(1) + ',' + outerY.toFixed(1) + '" opacity="0.65" stroke-width="3" />';
        }

        svg += buildMotifPath(motif, random, palette[2]);
        svg += '</g>';

        svg += '<g fill="' + palette[3] + '" opacity="0.88">';
        for (var a = 0; a < accentCount; a += 1) {
            var x = 180 + random() * 840;
            var y = 170 + random() * 760;
            var size = 4 + random() * 12;
            svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + size.toFixed(1) + '" opacity="' + (0.12 + random() * 0.5).toFixed(2) + '" />';
        }
        svg += '</g>';

        svg += '<g filter="url(#softGlow)">';
        svg += '<text x="600" y="104" text-anchor="middle" fill="#f0d89d" font-family="Space Grotesk, sans-serif" font-size="28" letter-spacing="6">AI TATTOO STUDIO</text>';
        svg += '<text x="600" y="1090" text-anchor="middle" fill="#f0d89d" font-family="Space Grotesk, sans-serif" font-size="24" letter-spacing="2">Prompt: ' + promptLabel + '</text>';
        svg += '<text x="600" y="1130" text-anchor="middle" fill="#ffffff" opacity="0.75" font-family="Space Grotesk, sans-serif" font-size="18" letter-spacing="4">VERSION ' + version + '</text>';
        svg += '</g>';
        svg += '</svg>';

        return svg;
    }

    function buildMotifPath(motif, random, strokeColor) {
        var path = '';
        var centerX = 600;
        var centerY = 560;

        if (motif === 'dragon') {
            path += '<path d="M410 690 C 500 520, 620 470, 720 540 C 800 595, 760 700, 650 730 C 560 755, 480 725, 450 650 C 430 600, 470 535, 560 510 C 650 485, 730 510, 800 585" stroke-width="10" />';
            path += '<path d="M525 520 C 575 430, 720 410, 790 470" stroke-width="8" opacity="0.8" />';
        } else if (motif === 'rose') {
            path += '<path d="M600 450 C 540 450, 510 505, 525 555 C 540 610, 595 640, 650 630 C 705 620, 735 565, 720 515 C 705 465, 655 440, 600 450" stroke-width="10" />';
            path += '<path d="M600 640 C 590 710, 560 760, 505 820" stroke-width="8" opacity="0.8" />';
            path += '<path d="M565 585 C 625 560, 665 515, 690 455" stroke-width="7" opacity="0.85" />';
        } else if (motif === 'skull') {
            path += '<circle cx="600" cy="500" r="120" stroke-width="10" />';
            path += '<circle cx="555" cy="495" r="26" fill="none" stroke-width="12" />';
            path += '<circle cx="645" cy="495" r="26" fill="none" stroke-width="12" />';
            path += '<path d="M565 565 Q 600 605 635 565" stroke-width="9" />';
            path += '<path d="M525 650 L 675 650" stroke-width="8" opacity="0.8" />';
        } else if (motif === 'snake') {
            path += '<path d="M420 700 C 510 610, 560 530, 650 500 C 740 470, 770 560, 705 620 C 640 680, 545 660, 520 575 C 495 495, 575 425, 690 430" stroke-width="11" />';
            path += '<path d="M680 425 L 750 380 L 720 455 Z" stroke-width="8" fill="none" />';
        } else if (motif === 'eye') {
            path += '<path d="M380 560 C 470 470, 730 470, 820 560 C 730 650, 470 650, 380 560 Z" stroke-width="10" />';
            path += '<circle cx="600" cy="560" r="78" stroke-width="10" />';
            path += '<circle cx="600" cy="560" r="28" fill="none" stroke-width="12" />';
        } else {
            path += '<circle cx="600" cy="560" r="180" stroke-width="10" opacity="0.9" />';
            path += '<path d="M420 560 C 500 430, 700 430, 780 560 C 700 690, 500 690, 420 560 Z" stroke-width="8" opacity="0.88" />';
        }

        var ornaments = '';
        for (var i = 0; i < 8; i += 1) {
            var angle = (Math.PI * 2 * i) / 8 + random() * 0.12;
            var x1 = centerX + Math.cos(angle) * 220;
            var y1 = centerY + Math.sin(angle) * 220;
            var x2 = centerX + Math.cos(angle) * (300 + random() * 80);
            var y2 = centerY + Math.sin(angle) * (300 + random() * 80);
            ornaments += '<path d="M' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' L ' + x2.toFixed(1) + ',' + y2.toFixed(1) + '" stroke="' + strokeColor + '" stroke-width="5" opacity="0.55" />';
        }

        return path + ornaments;
    }

    function pickMotif(prompt, random) {
        var text = prompt.toLowerCase();
        if (text.indexOf('dragon') !== -1 || text.indexOf('dragón') !== -1) {
            return 'dragon';
        }
        if (text.indexOf('rosa') !== -1 || text.indexOf('rose') !== -1) {
            return 'rose';
        }
        if (text.indexOf('calavera') !== -1 || text.indexOf('skull') !== -1) {
            return 'skull';
        }
        if (text.indexOf('serpiente') !== -1 || text.indexOf('snake') !== -1) {
            return 'snake';
        }
        if (text.indexOf('ojo') !== -1 || text.indexOf('eye') !== -1) {
            return 'eye';
        }

        var motifs = ['mandala', 'dragon', 'rose', 'skull', 'snake', 'eye'];
        return motifs[Math.floor(random() * motifs.length)];
    }

    function hashString(text) {
        var hash = 2166136261;
        for (var i = 0; i < text.length; i += 1) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
    }

    function mulberry32(seed) {
        return function () {
            var t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function shortenPrompt(prompt) {
        if (prompt.length <= 72) {
            return prompt;
        }

        return prompt.slice(0, 69) + '...';
    }

    function escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
})();
