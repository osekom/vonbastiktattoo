/* ========================================
   Von Bastik Tattoo Studio - Blog JavaScript
   WordPress JSON API Consumer
   ======================================== */

(function () {
    'use strict';

    // --- Configuration ---
    const BLOG_CONFIG = {
        // WordPress REST API endpoint
        apiBase: 'https://vonbastiktattoo.es/wp-json/wp/v2',
        // Number of posts per page
        postsPerPage: 9,
        // Featured image size options: 'thumbnail', 'medium', 'large', 'full'
        featuredImageSize: 'large'
    };

    // --- State ---
    let allPosts = [];
    let displayedPosts = 0;
    let currentFilter = 'all';
    let totalPages = 1;

    // --- DOM Ready ---
    document.addEventListener('DOMContentLoaded', function () {
        // Only run on blog page
        if (!document.getElementById('blogGrid')) return;

        initBlog();
    });

    function initBlog() {
        initFilters();
        initModal();
        initNewsletter();
        initScrollProgress();
        
        // Check if we're on the blog page
        if (!document.getElementById('blogGrid')) return;
        
        loadBlogPosts();
    }

    // --- Load Posts from WordPress API ---
    async function loadBlogPosts(reset) {
        const grid = document.getElementById('blogGrid');
        const loading = document.getElementById('blogLoading');
        const error = document.getElementById('blogError');
        const noPosts = document.getElementById('blogNoPosts');
        const loadMoreContainer = document.getElementById('loadMoreContainer');

        if (reset) {
            displayedPosts = 0;
            allPosts = [];
            grid.innerHTML = '';
            loading.classList.remove('hidden');
            error.classList.add('hidden');
            noPosts.classList.add('hidden');
            loadMoreContainer.classList.add('hidden');
        }

        if (reset || allPosts.length === 0) {
            loading.classList.remove('hidden');
        }

        try {
            // Build query params
            const params = new URLSearchParams({
                per_page: BLOG_CONFIG.postsPerPage,
                page: reset ? 1 : Math.floor(displayedPosts / BLOG_CONFIG.postsPerPage) + 1,
                _embed: true
            });

            // Add category filter
            if (currentFilter !== 'all') {
                params.set('categories', getCategorySlug(currentFilter));
            }

            const response = await fetch(`${BLOG_CONFIG.apiBase}/posts?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const posts = response.headers.get('x-wp-totalpages');
            totalPages = parseInt(posts) || 1;

            const newData = await response.json();

            if (reset) {
                allPosts = newData;
            } else {
                allPosts = allPosts.concat(newData);
            }

            loading.classList.add('hidden');

            if (allPosts.length === 0) {
                noPosts.classList.remove('hidden');
                return;
            }

            noPosts.classList.add('hidden');
            renderPosts(reset);

            // Show load more if there are more pages
            if (displayedPosts + BLOG_CONFIG.postsPerPage < allPosts.length && totalPages > 1) {
                loadMoreContainer.classList.remove('hidden');
            } else {
                loadMoreContainer.classList.add('hidden');
            }

        } catch (err) {
            console.error('Error loading blog posts:', err);
            loading.classList.add('hidden');

            // If we have existing posts, just don't show error
            if (allPosts.length > 0) {
                loadMoreContainer.classList.add('hidden');
                return;
            }

            error.classList.remove('hidden');
        }
    }

    // --- Get WordPress category ID mapping ---
    function getCategorySlug(filter) {
        // Map blog filters to WordPress category slugs or IDs
        // You need to create these categories in WordPress: tips, artists, trends, care
        const categoryMap = {
            'tips': 1,      // Category ID for "Consejos"
            'artists': 2,   // Category ID for "Artistas"
            'trends': 3,    // Category ID for "Tendencias"
            'care': 4       // Category ID for "Cuidados"
        };
        return categoryMap[filter] || '';
    }

    // --- Format category name for display ---
    function getCategoryName(slug) {
        const categoryNames = {
            'tips': 'Consejos',
            'artists': 'Artistas',
            'trends': 'Tendencias',
            'care': 'Cuidados',
            'uncategorized': 'General'
        };
        return categoryNames[slug] || slug || 'General';
    }

    // --- Render Posts ---
    function renderPosts(reset) {
        const grid = document.getElementById('blogGrid');
        const postsToRender = reset ? allPosts : allPosts.slice(displayedPosts, displayedPosts + BLOG_CONFIG.postsPerPage);

        if (reset) {
            grid.innerHTML = '';
        }

        postsToRender.forEach(function (post, index) {
            const card = createBlogCard(post, (reset ? displayedPosts : 0) + index);
            grid.appendChild(card);

            // Animate in with stagger
            setTimeout(function () {
                card.classList.add('visible');
            }, index * 100);
        });

        displayedPosts += postsToRender.length;
    }

    // --- Create Blog Card ---
    function createBlogCard(post, index) {
        const card = document.createElement('article');
        card.className = 'blog-card';
        card.setAttribute('data-category', getPostCategory(post));
        card.setAttribute('data-index', index);

        // Get featured image
        const imageData = getFeaturedImage(post);

        // Get author
        const author = post._embedded?.author?.[0] || { name: 'Von Bastik', slug: 'admin' };
        const authorAvatar = author.jetpack_profile?.avatar_url || 'public/images/logo.png';

        // Format date
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Calculate read time (approx 200 words per minute)
        const wordCount = post.content.rendered.replace(/<[^>]*>/g, ' ').split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        // Get excerpt
        const excerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || 'Lee este artículo para descubrir más...';

        // Check if featured (first post)
        if (index === 0 && allPosts.length > 1) {
            card.classList.add('featured');
        }

        // Category label
        const category = getPostCategory(post);
        const categoryLabel = getCategoryName(category);

        card.innerHTML = `
            <div class="blog-card-image">
                ${imageData
                    ? `<img src="${imageData}" alt="${post.title.rendered.replace(/<[^>]*>/g, '')}" loading="lazy">`
                    : `<div class="blog-card-image-placeholder" style="background: linear-gradient(135deg, #1a1a1a, #2a2a2a); display:flex; align-items:center; justify-content:center; height:100%;">
                        <i class="fas fa-newspaper" style="font-size:3rem; color:#333;"></i>
                    </div>`
                }
                <span class="blog-card-category">${categoryLabel}</span>
            </div>
            <div class="blog-card-body">
                <div class="blog-card-meta">
                    <span class="blog-card-date">
                        <i class="far fa-calendar"></i> ${formattedDate}
                    </span>
                    <span class="blog-card-read-time">
                        <i class="far fa-clock"></i> ${readTime} min lectura
                    </span>
                </div>
                <h3 class="blog-card-title">${post.title.rendered.replace(/<[^>]*>/g, '')}</h3>
                <p class="blog-card-excerpt">${excerpt}</p>
                <div class="blog-card-footer">
                    <div class="blog-card-author">
                        ${authorAvatar && authorAvatar !== ''
                            ? `<img src="${authorAvatar}" alt="${author.name}" class="blog-card-author-avatar" loading="lazy">`
                            : ''
                        }
                        <span class="blog-card-author-name">${author.name}</span>
                    </div>
                    <span class="blog-card-link">
                        Leer más <i class="fas fa-arrow-right"></i>
                    </span>
                </div>
            </div>
        `;

        // Click handler
        card.addEventListener('click', function () {
            openBlogModal(post);
        });

        return card;
    }

    // --- Get Featured Image URL ---
    function getFeaturedImage(post) {
        if (post._embedded?.['wp:featuredmedia']?.[0]) {
            const media = post._embedded['wp:featuredmedia'][0];
            // Try to get the largest available size
            return media.source_url || media.media_details?.sizes?.[BLOG_CONFIG.featuredImageSize]?.source_url;
        }
        return null;
    }

    // --- Get Post Category ---
    function getPostCategory(post) {
        const categories = post.categories || [];
        // Map category IDs to filter names
        const idToCategory = {
            1: 'tips',
            2: 'artists',
            3: 'trends',
            4: 'care'
        };
        // Return the first matching category
        for (const catId of categories) {
            if (idToCategory[catId]) {
                return idToCategory[catId];
            }
        }
        return 'uncategorized';
    }

    // --- Filter Posts ---
    function filterPosts(category) {
        currentFilter = category;
        const cards = document.querySelectorAll('.blog-card');

        cards.forEach(function (card) {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // If no posts visible after filter, show no posts message
        const visibleCards = document.querySelectorAll('.blog-card:not([style*="display: none"])');
        const noPosts = document.getElementById('blogNoPosts');
        if (visibleCards.length === 0) {
            noPosts.classList.remove('hidden');
        } else {
            noPosts.classList.add('hidden');
        }
    }

    // --- Initialize Filters ---
    function initFilters() {
        const filters = document.querySelectorAll('.filter-btn');
        filters.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const category = this.getAttribute('data-category');

                // Update active state
                filters.forEach(function (f) { f.classList.remove('active'); });
                this.classList.add('active');

                filterPosts(category);
            });
        });
    }

    // --- Blog Modal ---
    function openBlogModal(post) {
        const modal = document.getElementById('blogModal');
        const modalBody = document.getElementById('blogModalBody');
        const overlay = document.getElementById('blogModalOverlay');

        // Get data
        const imageData = getFeaturedImage(post);
        const author = post._embedded?.author?.[0] || { name: 'Von Bastik' };
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const wordCount = post.content.rendered.replace(/<[^>]*>/g, ' ').split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));
        const category = getPostCategory(post);
        const categoryLabel = getCategoryName(category);

        modalBody.innerHTML = `
            ${imageData ? `<img src="${imageData}" alt="${post.title.rendered}" class="blog-modal-image">` : ''}
            <div class="blog-modal-header">
                <span class="blog-modal-category">${categoryLabel}</span>
                <h2 class="blog-modal-title">${post.title.rendered.replace(/<[^>]*>/g, '')}</h2>
                <div class="blog-modal-meta">
                    <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                    <span><i class="far fa-clock"></i> ${readTime} min lectura</span>
                    <span><i class="far fa-user"></i> ${author.name}</span>
                </div>
            </div>
            <div class="blog-modal-content-inner">
                <div class="content">
                    ${post.content.rendered}
                </div>
            </div>
        `;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeBlogModal() {
        const modal = document.getElementById('blogModal');
        const body = document.body;
        
        if (modal) {
            modal.classList.remove('active');
            // Remove event listeners to prevent duplicates
            setTimeout(function() {
                body.style.overflow = '';
            }, 300);
        }
    }

    function initModal() {
        const closeBtn = document.getElementById('blogModalClose');
        const overlay = document.getElementById('blogModalOverlay');

        closeBtn.addEventListener('click', closeBlogModal);
        overlay.addEventListener('click', closeBlogModal);

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeBlogModal();
            }
        });
    }

    // --- Newsletter ---
    function initNewsletter() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;

            if (email) {
                // Show toast
                showToast();
                form.reset();
            }
        });
    }

    // --- Toast ---
    function showToast() {
        const toast = document.getElementById('toast');
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 3000);
    }

    // --- Scroll Progress ---
    function initScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        if (!progressBar) return;

        window.addEventListener('scroll', function () {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // --- Global Functions ---
    window.loadBlogPosts = function () {
        document.getElementById('blogError').classList.add('hidden');
        loadBlogPosts(true);
    };

    window.loadMorePosts = function () {
        loadBlogPosts(false);
    };

})();
