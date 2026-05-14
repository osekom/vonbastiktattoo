/* ========================================
   Von Bastik Tattoo - Artist Profile Template
   Dynamic rendering from WordPress REST API
   Fallback: data/artists.json
   Usage: artist.html?id=<slug>
   ======================================== */

(function () {
    'use strict';

    // WordPress REST API endpoint for single artist
    // Falls back to local JSON for static site development
    var WORDPRESS_API_URL = 'https://vonbastiktattoo.es/wp-json/tam/v1/artists';
    var LOCAL_FALLBACK_URL = 'data/artists.json';
    var ALL_ARTISTS_URL = 'https://vonbastiktattoo.es/wp-json/tam/v1/artists';
    
    var currentArtist = null;

    /**
     * Normalize image path: prepend domain for WordPress paths
     */
    function normalizeImagePath(path) {
        if (!path) return '';
        if (path.indexOf('wp-content') === 0) {
            return 'https://vonbastiktattoo.es/' + path;
        }
        return path;
    }

    function getArtistId() {
        var params = new URLSearchParams(window.location.search);
        return params.get('id') || 'selene';
    }

    /**
     * Fetch artist data from WordPress API or local fallback
     */
    function fetchArtistData(artistId) {
        // Try WordPress API first
        return fetch(WORDPRESS_API_URL + '/' + encodeURIComponent(artistId))
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
                // If 404, try all-artists endpoint
                if (res.status === 404) {
                    return fetchAllArtistsThenFind(artistId);
                }
                throw new Error('API error: ' + res.status);
            })
            .then(function (data) {
                // API returns {"slug": {...}}, extract the artist object
                if (data && typeof data === 'object' && !Array.isArray(data)) {
                    // If the response has the artistId as a key, use that
                    if (data[artistId]) {
                        return data[artistId];
                    }
                    // If there's only one key, use its value
                    var keys = Object.keys(data);
                    if (keys.length === 1 && data[keys[0]]) {
                        return data[keys[0]];
                    }
                }
                return data;
            })
            .catch(function (err) {
                console.warn('[artist-template] WordPress API failed, trying fallback:', err);
                // Fallback to local JSON
                return fetchLocalFallback(artistId);
            });
    }

    /**
     * Fetch all artists and find by slug
     */
    function fetchAllArtistsThenFind(artistId) {
        return fetch(WORDPRESS_API_URL)
            .then(function (res) {
                if (!res.ok) throw new Error('API error: ' + res.status);
                return res.json();
            })
            .then(function (data) {
                if (!data[artistId]) {
                    throw new Error('Artist not found: ' + artistId);
                }
                return data[artistId];
            });
    }

    /**
     * Load from local JSON fallback
     */
    function fetchLocalFallback(artistId) {
        return fetch(LOCAL_FALLBACK_URL)
            .then(function (res) {
                if (!res.ok) throw new Error('Local fallback failed: ' + res.status);
                return res.json();
            })
            .then(function (data) {
                if (!data[artistId]) {
                    throw new Error('Artist not found in local data: ' + artistId);
                }
                return data[artistId];
            });
    }

    function init() {
        var artistId = getArtistId();
        var loader = document.getElementById('pageLoader');

        fetchArtistData(artistId)
            .then(function (artistData) {
                currentArtist = artistData;
                renderPage(currentArtist);
                if (loader) loader.classList.add('hidden');
            })
            .catch(function (err) {
                console.error('Error loading artist data:', err);
                if (loader) loader.classList.add('hidden');
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#e5e5e5;background:#0a0a0a;font-family:Space Grotesk,sans-serif;"><div style="text-align:center;"><h1 style="font-size:2rem;margin-bottom:1rem;">Artista no encontrado</h1><a href="index.html" style="color:#c9a96e;">&larr; Volver al inicio</a></div></div>';
            });
    }

    function setMeta(name, content) {
        var meta = document.querySelector('meta[name="' + name + '"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    function setOg(name, content) {
        var meta = document.querySelector('meta[property="' + name + '"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', name);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    function renderPage(artist) {
        // SEO
        document.title = artist.seo.title;
        setMeta('description', artist.seo.description);
        setMeta('keywords', artist.seo.keywords);

        var canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = artist.seo.canonical;

        // OG Tags
        setOg('og:title', artist.seo.title);
        setOg('og:description', artist.seo.description);
        setOg('og:image', artist.hero.cover);
        setOg('og:url', artist.seo.canonical);

        // Twitter Cards
        setMeta('twitter:title', artist.seo.title);
        setMeta('twitter:description', artist.seo.description);
        setMeta('twitter:image', artist.hero.cover);

        // JSON-LD Schema
        var schema = buildSchema(artist);
        var scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(scriptTag);

        // Render content
        var main = document.getElementById('pageContent');
        main.innerHTML = '';

        renderHero(main, artist);
        renderBio(main, artist);
        renderGallery(main, artist);
        renderContact(main, artist);

        // Initialize dynamic content features (scroll reveal, gallery lazy load, etc.)
        if (typeof window.initDynamicContent === 'function') {
            window.initDynamicContent();
        }
    }

    function buildSchema(artist) {
        return {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": artist.name,
            "description": "Tatuador/a especialista en " + artist.genres.join(', ') + " en Von Bastik Tattoo.",
            "image": artist.hero.cover,
            "jobTitle": "Tatuador/a Profesional",
            "worksFor": {
                "@type": "TattooParlor",
                "name": "Von Bastik Tattoo & Piercing",
                "url": "https://vonbastik.com",
                "telephone": "+346****3913",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Calle Victoria, 1, local B",
                    "addressLocality": "Alcalá de Henares",
                    "addressRegion": "Comunidad de Madrid",
                    "addressCountry": "ES"
                }
            },
            "genre": artist.genres,
            "url": artist.seo.canonical,
            "sameAs": artist.social || [],
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "vonbastiktattoo@gmail.com",
                "telephone": "+346****3913",
                "contactType": "booking",
                "availableLanguage": ["Spanish", "English"]
            },
            "award": artist.awards || [],
            "knowsAbout": artist.genres,
            "hasOccupation": {
                "@type": "Occupation",
                "name": "Tatuador",
                "occupationLocation": {
                    "@type": "City",
                    "name": "Alcalá de Henares"
                }
            }
        };
    }

    function renderHero(container, a) {
        var section = document.createElement('section');
        section.className = 'artist-hero-section';
        section.setAttribute('aria-label', 'Presentación de ' + a.name);

        // Find Instagram URL from social links
        var instagramUrl = '';
        if (a.social && Array.isArray(a.social)) {
            for (var i = 0; i < a.social.length; i++) {
                if (a.social[i].indexOf('instagram.com') !== -1) {
                    instagramUrl = a.social[i];
                    break;
                }
            }
        }

        var instagramBtn = instagramUrl ?
            '<a href="' + instagramUrl + '" target="_blank" rel="noopener noreferrer" class="hero-cta-instagram" aria-label="Instagram">' +
                '<i class="fab fa-instagram"></i>' +
            '</a>' : '';

        section.innerHTML =
            '<div class="artist-hero-bg" style="background-image: url(\'' + normalizeImagePath(a.hero.cover) + '\');"></div>' +
            '<div class="artist-hero-overlay"></div>' +
            '<div class="max-w-7xl mx-auto w-full">' +
                '<div class="artist-hero-content px-6">' +
                    '<h1>' + a.hero.title + '</h1>' +
                    '<p class="artist-hero-specialty">' + a.hero.specialty + '</p>' +
                    '<p class="artist-hero-subtitle">' + a.hero.subtitle + '</p>' +
                    '<div class="hero-cta-wrapper">' +
                        '<a href="#contacto" class="hero-cta">' + a.hero.cta + '</a>' +
                        instagramBtn +
                    '</div>' +
                '</div>' +
            '</div>';

        container.appendChild(section);
    }

    // Nota: Los géneros no se muestran en el hero (original no los tiene)
    // Solo se usan para Schema.org JSON-LD

    function renderBio(container, a) {
        var section = document.createElement('section');
        section.className = 'bio-section px-6';
        section.id = 'biografia';
        section.setAttribute('aria-labelledby', 'bio-title');

        var bioParagraphs = a.bio.map(function (p) {
            return '<p class="mb-6">' + p + '</p>';
        }).join('');

        var skillsHtml = '';
        if (a.skills_labels && a.skills_labels.length > 0) {
            var skillsHtmlBuilder = '';
            for (var i = 0; i < a.skills_labels.length; i++) {
                skillsHtmlBuilder += '<span class="skill-pill">' + a.skills_labels[i] + '</span>';
            }
            skillsHtml = '\
                <div class="skills-section mt-12 reveal">' +
                    '<h3 class="text-2xl font-bold mb-6" style="font-family:\'Space Grotesk\',sans-serif;">Estilos y Especialidades</h3>' +
                    '<div class="skills-grid">' + skillsHtmlBuilder + '\
                    </div>' +
                '</div>';
        }

        section.innerHTML =
            '<div class="max-w-4xl mx-auto">' +
                '<div class="reveal">' +
                    '<p class="uppercase tracking-[4px] text-[#c9a96e] text-sm mb-4">Sobre la Artista</p>' +
                    '<h2 class="section-title text-4xl font-bold mb-8" id="bio-title">Sobre ' + a.name + '</h2>' +
                    '<div class="bio-text">' + bioParagraphs + '\
                    </div>' +
                '</div>' +
                skillsHtml +
            '</div>';

        container.appendChild(section);
    }

    function renderGallery(container, a) {
        var section = document.createElement('section');
        section.className = 'py-24 px-6';
        section.id = 'galeria';

        var galleryGridId = 'galleryGrid' + capitalize(a.name);

        var galleryItems = a.gallery.map(function (item) {
            var overlay = '';
            if (item.title && item.title !== 'Work') {
                overlay = '<h4>' + item.title + '</h4>';
                if (item.category) overlay += '<p class="text-[#888] text-sm mt-1">' + item.category + '</p>';
            }
            return '<div class="gallery-item" data-category="' + (item.category || '') + '" onclick="openLightbox(this)" role="button" tabindex="0" aria-label="Ver tatuaje">\n                        <img src="' + normalizeImagePath(item.src) + '" alt="' + (item.alt || '') + '" loading="lazy" decoding="async">\n                        <div class="gallery-overlay">\n' + overlay + '\
                        </div>\n                    </div>';
        }).join('');

        section.innerHTML =
            '<div class="max-w-7xl mx-auto">' +
                '<div class="text-center mb-16 reveal">' +
                    '<p class="uppercase tracking-[4px] text-[#c9a96e] text-sm mb-4">Portfolio</p>' +
                    '<h2 class="section-title section-title-center text-4xl font-bold inline-block" id="gallery-title">Galería de Trabajos</h2>' +
                '</div>' +
                '<div class="gallery-grid reveal" id="' + galleryGridId + '" data-artist="' + a.slug + '">' + galleryItems + '\
                </div>' +
            '</div>';

        container.appendChild(section);
    }

    function renderContact(container, a) {
        var section = document.createElement('section');
        section.className = 'py-24 px-6 bg-[#0d0d0d]';
        section.id = 'contacto';
        section.setAttribute('aria-labelledby', 'contact-title');

        section.innerHTML =
            '<div class="max-w-7xl mx-auto">' +
                '<div class="text-center mb-16 reveal">' +
                    '<p class="uppercase tracking-[4px] text-[#c9a96e] text-sm mb-4">Reserva tu cita</p>' +
                    '<h2 class="section-title section-title-center text-4xl font-bold inline-block" id="contact-title">Agenda tu Cita con ' + a.name + '</h2>' +
                    '<p class="text-[#888] max-w-2xl mx-auto mt-6 leading-relaxed">Completa el formulario y ' + a.name + ' te contactará para coordinar tu cita.</p>' +
                '</div>' +
                '<div class="grid lg:grid-cols-2 gap-16">' +
                    '<div class="reveal">' +
                        '<form id="artistContactForm" aria-label="Formulario de contacto con ' + a.name + '">' +
                            '<div class="grid md:grid-cols-2 gap-6 mb-6">' +
                                '<div>' +
                                    '<label for="artist-contact-name" class="block text-[#888] text-sm mb-2 uppercase tracking-wider">Nombre completo</label>' +
                                    '<input type="text" id="artist-contact-name" class="form-input" placeholder="Tu nombre" required>' +
                                '</div>' +
                                '<div>' +
                                    '<label for="artist-contact-email" class="block text-[#888] text-sm mb-2 uppercase tracking-wider">Email</label>' +
                                    '<input type="email" id="artist-contact-email" class="form-input" placeholder="tu@email.com" required>' +
                                '</div>' +
                            '</div>' +
                            '<div class="grid md:grid-cols-2 gap-6 mb-6">' +
                                '<div>' +
                                    '<label for="artist-contact-phone" class="block text-[#888] text-sm mb-2 uppercase tracking-wider">Teléfono</label>' +
                                    '<input type="tel" id="artist-contact-phone" class="form-input" placeholder="+34 600 000 000">' +
                                '</div>' +
                                '<div>' +
                                    '<label for="artist-contact-style" class="block text-[#888] text-sm mb-2 uppercase tracking-wider">Estilo deseado</label>' +
                                    '<select id="artist-contact-style" class="form-input">' +
                                        '<option value="">Seleccionar estilo</option>' +
                                        (function() { var opts = ''; if (a.genres) { for (var i = 0; i < a.genres.length; i++) { opts += '<option value="' + a.genres[i] + '">' + a.genres[i] + '</option>'; } } return opts; })() +
                                    '</select>' +
                                '</div>' +
                            '</div>' +
                            '<div class="mb-6">' +
                                '<label for="artist-contact-message" class="block text-[#888] text-sm mb-2 uppercase tracking-wider">Cuéntanos tu idea</label>' +
                                '<textarea id="artist-contact-message" class="form-input" placeholder="Describe lo que buscas: estilo, zona del cuerpo, tamaño aproximado, referencias..." rows="5"></textarea>' +
                            '</div>' +
                            '<button type="submit" class="btn-primary w-full">Enviar Solicitud a ' + a.name + '</button>' +
                        '</form>' +
                    '</div>' +
                    '<div class="reveal">' +
                        '<div class="mb-10">' +
                            '<h3 class="text-2xl font-bold mb-6" style="font-family:\'Space Grotesk\',sans-serif;">Sobre ' + a.name + '</h3>' +
                            '<div class="space-y-6">' +
                                '<div class="flex items-start gap-4">' +
                                    '<div class="w-10 h-10 inkborder inkborder-[#333] rounded-full flex items-center justify-center flex-shrink-0 mt-1">' +
                                        '<i class="fas fa-palette text-[#c9a96e] text-sm"></i>' +
                                    '</div>' +
                                    '<div>' +
                                        '<h4 class="font-bold text-sm uppercase tracking-wider mb-1">Especialidad</h4>' +
                                        '<p class="text-[#888] text-sm leading-relaxed">' + (a.hero ? a.hero.specialty : '') + '</p>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="flex items-start gap-4">' +
                                    '<div class="w-10 h-10 inkborder inkborder-[#333] rounded-full flex items-center justify-center flex-shrink-0 mt-1">' +
                                        '<i class="fas fa-map-marker-alt text-[#c9a96e] text-sm"></i>' +
                                    '</div>' +
                                    '<div>' +
                                        '<h4 class="font-bold text-sm uppercase tracking-wider mb-1">Estudio</h4>' +
                                        '<p class="text-[#888] text-sm leading-relaxed">Von Bastik Tattoo & Piercing<br>Calle Victoria, 1, local B<br>Alcalá de Henares, Madrid</p>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="flex items-start gap-4">' +
                                    '<div class="w-10 h-10 inkborder inkborder-[#333] rounded-full flex items-center justify-center flex-shrink-0 mt-1">' +
                                        '<i class="fas fa-clock text-[#c9a96e] text-sm"></i>' +
                                    '</div>' +
                                    '<div>' +
                                        '<h4 class="font-bold text-sm uppercase tracking-wider mb-1">Horario</h4>' +
                                        '<p class="text-[#888] text-sm leading-relaxed">Mar - Sáb: 11:30 - 14:00 | 16:00 - 20:00<br>Dom - Lun: Cerrado</p>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div>' +
                            '<h3 class="text-lg font-bold mb-4 uppercase tracking-wider" style="font-family:\'Space Grotesk\',sans-serif;">Sigue a ' + a.name + '</h3>' +
                            '<div class="flex gap-3">' +
                                (function() {
                                    var socials = a.social || [];
                                    var html = '';
                                    for (var i = 0; i < socials.length; i++) {
                                        var url = socials[i];
                                        var icon = '';
                                        if (url.indexOf('instagram.com') !== -1) icon = 'fab fa-instagram';
                                        else if (url.indexOf('tiktok.com') !== -1) icon = 'fab fa-tiktok';
                                        else if (url.indexOf('youtube.com') !== -1) icon = 'fab fa-youtube';
                                        else if (url.indexOf('facebook.com') !== -1) icon = 'fab fa-facebook';
                                        else icon = 'fas fa-link';
                                        html += '<a href="' + url + '" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Red social">' +
                                                '<i class="' + icon + '"></i>' +
                                                '</a>';
                                    }
                                    return html;
                                })() +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

        container.appendChild(section);
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    document.addEventListener('DOMContentLoaded', function () {
        init();
    });

})();
