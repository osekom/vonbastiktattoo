/* ========================================
   Von Bastik Tattoo Studio - JavaScript
   ======================================== */

(function () {
    'use strict';

    // --- DOM Ready ---
    document.addEventListener('DOMContentLoaded', function () {
        initNavbar();
        initMobileMenu();
        initCustomCursor();
        initScrollReveal();
        initStatCounters();
        initGalleryFilter();
        initGalleryLazyLoad();
        initLightbox();
        initTabs();
        initGalleryTabs();
        initContactForm();
        initSmoothScroll();
        initHeroSlideshow();
        initTypewriter();
        initParallax();
        initScrollProgress();
        loadArtistsFromAPI();
    });

    // --- Navbar Scroll State ---
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 80) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        });
    }

    // --- Mobile Menu ---
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        if (!hamburger || !mobileMenu) return;

        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMenu();
            });
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });

        function closeMenu() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }

        // Expose globally for inline onclick handlers
        window.closeMenu = closeMenu;
    }

    // --- Custom Cursor (Disabled) ---
    function initCustomCursor() {
        // Disabled per user request
    }

    // --- Scroll Reveal ---
    function initScrollReveal() {
        var revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        var isTouchDevice = ('ontouchstart' in window) || window.innerWidth <= 1024;
        var observerOptions = isTouchDevice
            ? { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
            : { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            },
            observerOptions
        );

        revealElements.forEach(function (el) {
            observer.observe(el);
        });

        // Fallback: reveal all after 3 seconds if observer hasn't fired
        setTimeout(function () {
            revealElements.forEach(function (el) {
                if (!el.classList.contains('active')) {
                    el.classList.add('active');
                }
            });
        }, 3000);
    }

    // --- Stat Counter Animation ---
    function initStatCounters() {
        var statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length === 0) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(function (el) {
            observer.observe(el);
        });

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-count'));
            var current = 0;
            var increment = target / 60;
            var timer = setInterval(function () {
                current += increment;
                if (current >= target) {
                    el.textContent = target.toLocaleString() + '+';
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current).toLocaleString();
                }
            }, 30);
        }
    }

    // --- Gallery Filter ---
    function initGalleryFilter() {
        var filterBtns = document.querySelectorAll('.filter-btn');
        var galleryItems = document.querySelectorAll('.gallery-item');
        if (filterBtns.length === 0 || galleryItems.length === 0) return;

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                var filter = btn.getAttribute('data-filter');
                galleryItems.forEach(function (item) {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeUp 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Gallery Lazy Load ---
    function initGalleryLazyLoad() {
        var galleryGrids = document.querySelectorAll('.gallery-grid');
        if (galleryGrids.length === 0) return;

        var INITIAL_COUNT = 10;
        var LOAD_MORE_COUNT = 10;

        galleryGrids.forEach(function (grid) {
            var items = grid.querySelectorAll('.gallery-item');
            if (items.length <= INITIAL_COUNT) return;

            // Hide items beyond the first 10
            for (var i = INITIAL_COUNT; i < items.length; i++) {
                items[i].classList.add('gallery-hidden');
                items[i].setAttribute('data-lazy', 'true');
            }

            // Create load more button wrapper
            var wrapper = document.createElement('div');
            wrapper.className = 'load-more-wrapper';

            function updateButton() {
                var hiddenCount = grid.querySelectorAll('.gallery-item[data-lazy="true"]').length;
                
                if (hiddenCount <= 0) {
                    wrapper.remove();
                    return;
                }

                var loadCount = Math.min(LOAD_MORE_COUNT, hiddenCount);
                
                // Update or create button
                var btn = wrapper.querySelector('.btn-load-more');
                if (!btn) {
                    btn = document.createElement('button');
                    btn.className = 'btn-load-more';
                    wrapper.appendChild(btn);
                    
                    btn.addEventListener('click', function () {
                        var hiddenItems = grid.querySelectorAll('.gallery-item[data-lazy="true"]');
                        for (var j = 0; j < Math.min(LOAD_MORE_COUNT, hiddenItems.length); j++) {
                            hiddenItems[j].classList.remove('gallery-hidden');
                            hiddenItems[j].removeAttribute('data-lazy');
                            hiddenItems[j].style.animation = 'fadeUp 0.5s ease forwards';
                        }
                        updateButton();
                    });
                }
                
                btn.innerHTML = '<i class="fas fa-chevron-down"></i> Ver ' + loadCount + ' foto' + (loadCount === 1 ? '' : 's') + ' m\u00e1s';
            }

            updateButton();
            grid.parentElement.appendChild(wrapper);
        });
    }

    // --- Lightbox ---
    function initLightbox() {
        var lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        window.openLightbox = function (item) {
            var img = item.querySelector('img');
            if (img) {
                document.getElementById('lightboxImg').src = img.src;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        };

        window.closeLightbox = function () {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        };

        var closeBtn = lightbox.querySelector('.lightbox-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                window.closeLightbox();
            });
        }

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                window.closeLightbox();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                window.closeLightbox();
            }
        });
    }

    // --- Content Tabs ---
    function initTabs() {
        var tabBtns = document.querySelectorAll('.tab-btn');
        if (tabBtns.length === 0) return;

        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tabId = btn.getAttribute('data-tab');

                // Deactivate all buttons in the same group
                var parent = btn.parentElement;
                parent.querySelectorAll('.tab-btn').forEach(function (b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(function (content) {
                    content.classList.remove('active');
                });

                // Show target tab
                var targetTab = document.getElementById('tab-' + tabId);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });
    }

    // --- Gallery Tabs ---
    function initGalleryTabs() {
        var galleryTabs = document.querySelectorAll('.gallery-tab');
        if (galleryTabs.length === 0) return;

        galleryTabs.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var tabId = btn.getAttribute('data-tab');

                // Deactivate all gallery buttons
                document.querySelectorAll('.gallery-tab').forEach(function (b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                // Hide all gallery panels
                document.querySelectorAll('.gallery-panel').forEach(function (panel) {
                    panel.classList.remove('active');
                    panel.style.display = 'none';
                });

                // Show target gallery panel
                var targetPanel = document.getElementById('panel-' + tabId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.style.display = 'block';
                }
            });
        });
    }

    // --- Contact Form → WordPress API ---
    function initContactForm() {
        var forms = document.querySelectorAll('form[id*="contact"], form[id*="booking"]');
        if (forms.length === 0) return;

        forms.forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                // Basic validation
                var requiredFields = form.querySelectorAll('[required]');
                var isValid = true;

                requiredFields.forEach(function (field) {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.style.borderColor = '#ff4444';
                        setTimeout(function () {
                            field.style.borderColor = '';
                        }, 3000);
                    }
                });

                // Email validation
                var emailField = form.querySelector('input[type="email"]');
                if (emailField && emailField.value) {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(emailField.value)) {
                        isValid = false;
                        emailField.style.borderColor = '#ff4444';
                        setTimeout(function () {
                            emailField.style.borderColor = '';
                        }, 3000);
                    }
                }

                if (isValid) {
                    sendToWordPress(form);
                }
            });
        });

        function sendToWordPress(form) {
            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn ? submitBtn.textContent : '';
            
            if (submitBtn) {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
            }

            // Collect form data
            var nameInput = form.querySelector('#contact-name, input[name="nombre"], input[type="text"]');
            var emailInput = form.querySelector('#contact-email, input[name="email"], input[type="email"]');
            var phoneInput = form.querySelector('#contact-phone, input[name="telefono"], input[type="tel"]');
            var styleInput = form.querySelector('#contact-style, select[name="estilo"], select[name="tipo_tatuaje"]');
            var messageInput = form.querySelector('#contact-message, textarea[name="mensaje"], textarea');

            var formData = {
                nombre: nameInput ? nameInput.value : '',
                email: emailInput ? emailInput.value : '',
                telefono: phoneInput ? phoneInput.value : '',
                estilo: styleInput ? styleInput.value : '',
                mensaje: messageInput ? messageInput.value : '',
                website: '' // Honeypot anti-spam
            };

            // Honeypot field check
            var honeypot = form.querySelector('#website, input[name="website"]');
            if (honeypot) {
                honeypot.value = '';
            }

            const wordpressUrl = 'https://vonbastiktattoo.es';
            
            fetch(`${wordpressUrl}/wp-json/vbt/v1/contacto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.success) {
                    showSuccessToast(form);
                    form.reset();
                } else {
                    showErrorToast(data.error || 'Error al enviar');
                    if (submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                }
            })
            .catch(function(error) {
                showErrorToast('No se pudo conectar. Inténtalo de nuevo.');
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
        }

        function showSuccessToast(form) {
            var toast = document.getElementById('toast');
            if (toast) {
                toast.innerHTML = '<i class="fas fa-check-circle" style="color:#0a0a0a;margin-right:8px;"></i> Solicitud enviada correctamente. Te contactaremos pronto.';
                toast.classList.add('show', 'success');
                setTimeout(function () {
                    toast.classList.remove('show', 'success');
                }, 5000);
            }
            
            // Also show the success message div if it exists
            var successMsg = document.querySelector('.form-success-message');
            if (successMsg) {
                successMsg.classList.add('show');
                setTimeout(function() {
                    successMsg.classList.remove('show');
                }, 5000);
            }
        }

        function showErrorToast(message) {
            var toast = document.getElementById('toast');
            if (toast) {
                toast.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#ff4444;margin-right:8px;"></i> ' + message;
                toast.classList.add('show', 'error');
                setTimeout(function () {
                    toast.classList.remove('show', 'error');
                }, 5000);
            }
        }

        window.showToast = function(message, type) {
            var toast = document.getElementById('toast');
            if (!toast) return;
            
            if (type === 'success') {
                toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + (message || 'Mensaje enviado');
            } else {
                toast.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (message || 'Error');
            }
            
            toast.classList.add('show');
            setTimeout(function () {
                toast.classList.remove('show');
            }, 4000);
        };
    }

    // --- Smooth Scroll for Anchor Links ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;

                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    var offset = 80;
                    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        });
    }

    // --- Hero Slideshow ---
    function initHeroSlideshow() {
        var slides = document.querySelectorAll('.hero-slide');
        var dots = document.querySelectorAll('.hero-dot');
        var hero = document.querySelector('.hero-section');
        if (slides.length === 0 || !hero) return;

        var current = 0;
        var interval;

        function showSlide(index) {
            slides.forEach(function (s, i) {
                s.classList.toggle('active', i === index);
            });
            dots.forEach(function (d, i) {
                d.classList.toggle('active', i === index);
            });
            current = index;
        }

        function next() {
            showSlide((current + 1) % slides.length);
        }

        function start() {
            interval = setInterval(next, 5000);
        }

        function stop() {
            clearInterval(interval);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                stop();
                showSlide(i);
                start();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);

        start();
    }

    // --- Typewriter Effect ---
    function initTypewriter() {
        var textEl = document.getElementById('typewriterText');
        if (!textEl) return;

        var phrases = [
            'Tres artistas, un estudio.',
            'Realismo, Blackwork, Fine Line.',
            'Arte que permanece en tu piel.',
            'Tu historia, nuestra tinta.'
        ];

        var phraseIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typingSpeed = 60;
        var deletingSpeed = 30;
        var pauseDuration = 2000;

        function type() {
            var currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                charIndex--;
                textEl.textContent = currentPhrase.substring(0, charIndex);
            } else {
                charIndex++;
                textEl.textContent = currentPhrase.substring(0, charIndex);
            }

            var speed = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && charIndex === currentPhrase.length) {
                speed = pauseDuration;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                speed = 300;
            }

            setTimeout(type, speed);
        }

        setTimeout(type, 2500);
    }

    // --- Parallax on Scroll ---
    function initParallax() {
        if ('ontouchstart' in window || window.innerWidth <= 1024) return;

        var parallaxElements = document.querySelectorAll('[data-parallax]');
        var parallaxImages = document.querySelectorAll('[data-parallax-img]');

        if (parallaxElements.length === 0 && parallaxImages.length === 0) return;

        function update() {
            var scrollY = window.pageYOffset;

            parallaxElements.forEach(function (el) {
                var speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                var rect = el.getBoundingClientRect();
                var yPos = rect.top * speed;
                el.style.transform = 'translateY(' + yPos + 'px)';
            });

            parallaxImages.forEach(function (el) {
                var speed = parseFloat(el.getAttribute('data-parallax-img')) || 0.5;
                var rect = el.getBoundingClientRect();
                var yPos = (rect.top + scrollY - scrollY) * speed * 0.3;
                el.style.transform = 'translateY(' + yPos + 'px)';
            });

            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // --- Scroll Progress Indicator ---
    function initScrollProgress() {
        var progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        window.addEventListener('scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // --- Re-initialize for dynamically added content ---
    // This is called after artist profile content is loaded dynamically
    window.initDynamicContent = function () {
        // Re-run scroll reveal for newly added elements
        var revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length > 0) {
            var isTouchDevice = ('ontouchstart' in window) || window.innerWidth <= 1024;
            var observerOptions = isTouchDevice
                ? { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
                : { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                observerOptions
            );

            revealElements.forEach(function (el) {
                // Only observe elements that haven't been observed yet
                if (!el.classList.contains('active') && !el.classList.contains('revealed-dynamic')) {
                    el.classList.add('revealed-dynamic');
                    observer.observe(el);
                }
            });
        }

        // Re-run stat counter animation for newly added elements
        var statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length > 0) {
            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );

            statNumbers.forEach(function (el) {
                if (!el.classList.contains('countered')) {
                    el.classList.add('countered');
                    observer.observe(el);
                }
            });
        }

        // Re-init lightbox for newly added gallery items
        var lightbox = document.getElementById('lightbox');
        if (lightbox) {
            // The lightbox is already initialized on DOMContentLoaded,
            // but we need to ensure openLightbox works for dynamic items
            // (it already does since openLightbox is called inline via onclick)
        }

        // Re-init gallery lazy load for newly added galleries
        var galleryGrids = document.querySelectorAll('.gallery-grid');
        if (galleryGrids.length > 0) {
            var INITIAL_COUNT = 10;
            var LOAD_MORE_COUNT = 10;

            galleryGrids.forEach(function (grid) {
                // Skip if already processed
                if (grid.hasAttribute('data-lazy-initialized')) return;
                grid.setAttribute('data-lazy-initialized', 'true');

                var items = grid.querySelectorAll('.gallery-item');
                if (items.length <= INITIAL_COUNT) return;

                var wrapper = grid.nextElementSibling;
                if (!wrapper || !wrapper.classList.contains('load-more-wrapper')) {
                    wrapper = document.createElement('div');
                    wrapper.className = 'load-more-wrapper';
                }

                function updateButton() {
                    var hiddenCount = grid.querySelectorAll('.gallery-item[data-lazy="true"]').length;
                    
                    if (hiddenCount <= 0) {
                        if (wrapper.previousElementSibling === grid) {
                            wrapper.remove();
                        }
                        return;
                    }

                    var loadCount = Math.min(LOAD_MORE_COUNT, hiddenCount);
                    
                    var btn = wrapper.querySelector('.btn-load-more');
                    if (!btn) {
                        btn = document.createElement('button');
                        btn.className = 'btn-load-more';
                        wrapper.appendChild(btn);
                        
                        btn.addEventListener('click', function () {
                            var hiddenItems = grid.querySelectorAll('.gallery-item[data-lazy="true"]');
                            for (var j = 0; j < Math.min(LOAD_MORE_COUNT, hiddenItems.length); j++) {
                                hiddenItems[j].classList.remove('gallery-hidden');
                                hiddenItems[j].removeAttribute('data-lazy');
                                hiddenItems[j].style.animation = 'fadeUp 0.5s ease forwards';
                            }
                            updateButton();
                        });
                    }
                    
                    btn.innerHTML = '<i class="fas fa-chevron-down"></i> Ver ' + loadCount + ' foto' + (loadCount === 1 ? '' : 's') + ' más';
                }

                // Show items beyond initial count and mark for lazy loading
                for (var i = INITIAL_COUNT; i < items.length; i++) {
                    items[i].classList.add('gallery-hidden');
                    items[i].setAttribute('data-lazy', 'true');
                }

                if (grid.parentElement) {
                    grid.parentElement.appendChild(wrapper);
                }

                updateButton();
            });
        }
    };

    // --- Load Artists from TAM API ---
    // Disabled on index.html - uses consolidated API script instead
    var loadArtistsFromAPI = function () {
        // Skip loading - index.html handles artists/gallery loading via consolidated script
        if (document.getElementById('galleryGridTatuajes')) {
            return;
        }
        
        var artistsGrid = document.getElementById('artistsGrid');
        var artistsLoading = document.getElementById('artistsLoading');

        if (!artistsGrid) return;

        var API_URL = 'https://vonbastiktattoo.es/wp-json/tam/v1/artists';

        // Show loading state
        if (artistsLoading) {
            artistsLoading.style.display = 'block';
        }

        fetch(API_URL)
            .then(function (response) {
                console.log('[Artists] Response status:', response.status);
                if (!response.ok) {
                    throw new Error('Failed to fetch artists: ' + response.status);
                }
                return response.json();
            })
            .then(function (artists) {
                console.log('[Artists] Received artists:', Object.keys(artists));
                if (artistsLoading) {
                    artistsLoading.style.display = 'none';
                }

                if (!artists || Object.keys(artists).length === 0) {
                    artistsGrid.innerHTML = '<p style="color:#888;text-align:center;width:100%;">No hay artistas disponibles.</p>';
                    return;
                }

                var html = '';

                // Iterate over each artist in the response object
                for (var slug in artists) {
                    if (!artists.hasOwnProperty(slug)) continue;

                    var artist = artists[slug];
                    var artistName = artist.name || 'Unknown Artist';
                    var artistSlug = artist.slug || slug;
                    var specialty = artist.hero && artist.hero.specialty ? artist.hero.specialty : (artist.genres ? artist.genres.join(', ') : '');
                    var cover = 'public/images/logo.png';
                    if (artist.hero && artist.hero.cover) {
                        // WordPress returns paths like "wp-content/uploads/..." - prepend domain for static site
                        if (artist.hero.cover.indexOf('wp-content') === 0) {
                            cover = 'https://vonbastiktattoo.es/' + artist.hero.cover;
                        } else {
                            cover = artist.hero.cover;
                        }
                    }
                    var bio = '';
                    if (artist.bio) {
                        if (Array.isArray(artist.bio) && artist.bio.length > 0) {
                            bio = artist.bio[0];
                        } else if (typeof artist.bio === 'string') {
                            bio = artist.bio;
                        }
                    }
                    // Truncate bio to ~120 characters for card preview
                    if (bio.length > 120) {
                        bio = bio.substring(0, 120) + '...';
                    }

                    // Build artist card
                    html += '<article class="artist-card reveal">';
                    html += '    <div class="artist-image-wrapper overflow-hidden">';
                    html += '        <img src="' + cover + '" alt="' + artistName + '" class="artist-image" loading="lazy">';
                    html += '    </div>';
                    html += '    <div class="artist-info">';
                    html += '        <h3>' + artistName + '</h3>';
                    if (specialty) {
                        html += '        <p class="artist-specialty">' + specialty + '</p>';
                    }
                    if (bio) {
                        html += '        <p class="artist-description">' + bio + '</p>';
                    }
                    html += '        <div class="artist-links">';
                    html += '            <a href="artist.html?id=' + artistSlug + '" class="artist-link-primary" aria-label="Ver perfil de ' + artistName + '">Ver portfolio</a>';
                    // Add Instagram link if available
                    if (artist.social && Array.isArray(artist.social)) {
                        for (var i = 0; i < artist.social.length; i++) {
                            if (artist.social[i].indexOf('instagram.com') !== -1) {
                                html += '            <a href="' + artist.social[i] + '" class="artist-link-secondary" target="_blank" rel="noopener noreferrer" aria-label="Instagram de ' + artistName + '"><i class="fab fa-instagram"></i></a>';
                                break;
                            }
                        }
                    }
                    html += '        </div>';
                    html += '    </div>';
                    html += '</article>';
                }

                artistsGrid.innerHTML = html;

                // Re-init scroll reveal for newly added cards
                initScrollReveal();
            })
            .catch(function (error) {
                console.error('[Artists] Error loading artists:', error);
                if (artistsLoading) {
                    artistsLoading.style.display = 'none';
                }
                artistsGrid.innerHTML = '<p style="color:#888;text-align:center;width:100%;">Error al cargar los artistas. Por favor, inténtalo más tarde.</p>';
            });
    };

    window.loadArtistsFromAPI = loadArtistsFromAPI;
})();
