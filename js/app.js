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
        initContactForm();
        initSmoothScroll();
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

    // --- Custom Cursor (Desktop Only) ---
    function initCustomCursor() {
        if (window.innerWidth <= 768) return;

        const cursor = document.getElementById('cursor');
        if (!cursor) return;

        document.addEventListener('mousemove', function (e) {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        var hoverElements = document.querySelectorAll('a, button, .gallery-item, .service-card, .piercing-card, .artist-card, .event-item, .work-item, .download-link');
        hoverElements.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('hover');
            });
        });
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
})();
