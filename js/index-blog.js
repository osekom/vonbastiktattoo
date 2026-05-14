/* ========================================
   Von Bastik - Latest Blog Posts Loader
   ======================================== */

(function () {
    'use strict';

    // --- Configuration ---
    const BLOG_CONFIG = {
        apiBase: 'https://vonbastiktattoo.es/wp-json/wp/v2',
        postsCount: 3,
        featuredImageSize: 'large'
    };

    // --- DOM Ready ---
    document.addEventListener('DOMContentLoaded', function () {
        // Only run on index page
        if (!document.getElementById('blogLatestGrid')) return;
        loadLatestBlogPosts();
    });

    // --- Load Latest Blog Posts ---
    async function loadLatestBlogPosts() {
        const grid = document.getElementById('blogLatestGrid');
        const loading = document.getElementById('blogLatestLoading');
        const error = document.getElementById('blogLatestError');

        if (!grid) return;

        try {
            loading.classList.remove('hidden');
            error.classList.add('hidden');

            // Build query params to get latest posts
            const params = new URLSearchParams({
                per_page: BLOG_CONFIG.postsCount,
                page: 1,
                _embed: true,
                orderby: 'date',
                order: 'desc'
            });

            const response = await fetch(`${BLOG_CONFIG.apiBase}/posts?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const posts = await response.json();
            loading.classList.add('hidden');

            if (posts.length === 0) {
                grid.innerHTML = '<p class="text-[#888] col-span-3 text-center py-12">No hay artículos disponibles aún.</p>';
                return;
            }

            grid.innerHTML = '';
            posts.forEach(function (post, index) {
                const card = createBlogCard(post, index);
                grid.appendChild(card);

                // Animate in with stagger
                setTimeout(function () {
                    card.classList.add('visible');
                }, index * 150);
            });

        } catch (err) {
            console.error('Error loading blog posts:', err);
            loading.classList.add('hidden');
            error.classList.remove('hidden');
        }
    }

    // --- Create Blog Card ---
    function createBlogCard(post, index) {
        const card = document.createElement('article');
        card.className = 'blog-latest-card';
        card.setAttribute('data-index', index);

        // Get featured image
        const imageData = getFeaturedImage(post);

        // Get author
        const author = post._embedded?.author?.[0] || { name: 'Von Bastik', slug: 'admin' };

        // Format date
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Calculate read time
        const wordCount = post.content.rendered.replace(/<[^>]*>/g, ' ').split(/\s+/).length;
        const readTime = Math.max(1, Math.ceil(wordCount / 200));

        // Get excerpt
        const excerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').substring(0, 120) + '...' || 'Lee este artículo...';

        // Get category
        const categorySlug = getPostCategory(post);
        const categoryName = getCategoryName(categorySlug);

        card.innerHTML = `
            <div class="blog-latest-image-wrapper">
                ${imageData
                    ? `<img src="${imageData}" alt="${post.title.rendered.replace(/<[^>]*>/g, '')}" loading="lazy" decoding="async" class="blog-latest-image">`
                    : `<div class="blog-latest-image-placeholder">
                        <i class="fas fa-newspaper"></i>
                    </div>`
                }
                <div class="blog-latest-overlay">
                    <span class="blog-latest-category">${categoryName}</span>
                </div>
            </div>
            <div class="blog-latest-content">
                <div class="blog-latest-meta">
                    <span class="blog-latest-date">
                        <i class="far fa-calendar"></i> ${formattedDate}
                    </span>
                    <span class="blog-latest-read">
                        <i class="far fa-clock"></i> ${readTime} min
                    </span>
                </div>
                <h3 class="blog-latest-title">${post.title.rendered.replace(/<[^>]*>/g, '')}</h3>
                <p class="blog-latest-excerpt">${excerpt}</p>
                <div class="blog-latest-footer">
                    <span class="blog-latest-author">${author.name}</span>
                    <a href="blog.html#post-${post.id}" class="blog-latest-link">
                        Leer <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;

        // Click handler to navigate to blog
        card.addEventListener('click', function () {
            window.location.href = 'blog.html#post-' + post.id;
        });

        return card;
    }

    // --- Get Featured Image ---
    function getFeaturedImage(post) {
        try {
            if (!post._embedded?.['wp:featuredmedia']?.[0]) return null;
            
            const media = post._embedded['wp:featuredmedia'][0];
            return media.source_url || media.media_details?.sizes?.[BLOG_CONFIG.featuredImageSize]?.source_url || null;
        } catch (e) {
            return null;
        }
    }

    // --- Get Post Category ---
    function getPostCategory(post) {
        try {
            const categories = post._embedded?.['wp:term']?.[0] || [];
            if (categories.length > 0) {
                return categories[0].slug;
            }
        } catch (e) {
            return 'general';
        }
        return 'general';
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
        return categoryNames[slug] || 'General';
    }

})();
