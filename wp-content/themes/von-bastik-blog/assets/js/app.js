/* ========================================
   Von Bastik Tattoo Studio - JavaScript
   ======================================== */

(function () {
    'use strict';

    // --- DOM Ready ---
    document.addEventListener('DOMContentLoaded', function () {
        initNavbar();
        initMobileMenu();
        initScrollReveal();
        initStatCounters();
        initGalleryFilter();
        initGalleryLazyLoad();
        initLightbox();
        initTabs();
        initContactForm();
        initSmoothScroll();
        initHeroSlideshow();
        initTypewriter();
        initParallax();
        initScrollProgress();
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
            var target = parseInt(el.getAttribute('data-target'));
            if (isNaN(target)) return;
            
            var current = 0;
            var increment = target / 60;
            var timer = setInterval(function () {
                current += increment;
                if (current >= target) {
                    el.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    el.textContent = Math.floor(current);
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
                
                btn.innerHTML = '<i class="fas fa-chevron-down"></i> Ver ' + loadCount + ' foto' + (loadCount === 1 ? '' : 's') + ' más';
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
                var lightboxImg = document.getElementById('lightboxImg');
                if (lightboxImg) {
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt || '';
                }
                
                var lightboxTitle = document.getElementById('lightboxTitle');
                if (lightboxTitle) {
                    var titleEl = item.querySelector('.gallery-item-title');
                    lightboxTitle.textContent = titleEl ? titleEl.textContent : '';
                }
                
                var lightboxArtist = document.getElementById('lightboxArtist');
                if (lightboxArtist) {
                    var artistEl = item.querySelector('.gallery-item-artist');
                    lightboxArtist.textContent = artistEl ? artistEl.textContent : '';
                }
                
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        };

        window.closeLightbox = function () {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        };

        var closeBtn = document.getElementById('lightboxClose');
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

        // Navigation buttons
        var prevBtn = document.getElementById('lightboxPrev');
        var nextBtn = document.getElementById('lightboxNext');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                navigateLightbox(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                navigateLightbox(1);
            });
        }

        function navigateLightbox(direction) {
            var currentImg = document.getElementById('lightboxImg');
            if (!currentImg) return;
            
            var currentSrc = currentImg.src;
            var allImages = document.querySelectorAll('.gallery-item img');
            var currentIndex = Array.from(allImages).findIndex(function(img) {
                return img.src === currentSrc;
            });
            
            if (currentIndex >= 0) {
                var newIndex = (currentIndex + direction + allImages.length) % allImages.length;
                var newImg = allImages[newIndex];
                if (newImg) {
                    currentImg.src = newImg.src;
                    currentImg.alt = newImg.alt || '';
                    
                    var lightboxTitle = document.getElementById('lightboxTitle');
                    var lightboxArtist = document.getElementById('lightboxArtist');
                    var currentItem = newImg.closest('.gallery-item');
                    if (currentItem) {
                        var titleEl = currentItem.querySelector('.gallery-item-title');
                        var artistEl = currentItem.querySelector('.gallery-item-artist');
                        if (lightboxTitle && titleEl) lightboxTitle.textContent = titleEl.textContent;
                        if (lightboxArtist && artistEl) lightboxArtist.textContent = artistEl.textContent;
                    }
                }
            }
        }
    }

    // --- Tabs ---
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

        // Gallery tabs
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

    // --- Contact Form ---
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
                    showToast();
                    form.reset();
                }
            });
        });

        function showToast() {
            var toast = document.getElementById('toast');
            if (!toast) return;

            var toastMessage = toast.querySelector('.toast-message');
            if (toastMessage) {
                toastMessage.textContent = '¡Mensaje enviado correctamente!';
            }
            
            toast.classList.add('show');
            setTimeout(function () {
                toast.classList.remove('show');
            }, 4000);
        }

        window.showToast = showToast;
    }

    // --- Smooth Scroll for Anchor Links ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#' || targetId.length <= 1) return;

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
        var typewriterContainer = document.getElementById('typewriter');
        if (!typewriterContainer) return;

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
                typewriterContainer.textContent = currentPhrase.substring(0, charIndex);
            } else {
                charIndex++;
                typewriterContainer.textContent = currentPhrase.substring(0, charIndex);
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
})();
