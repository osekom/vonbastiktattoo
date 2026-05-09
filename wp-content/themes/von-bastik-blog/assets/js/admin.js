/**
 * Von Bastik Blog - Admin JavaScript
 *
 * @package Von_Bastik_Blog
 */

(function() {
    'use strict';
    
    document.addEventListener('DOMContentLoaded', function() {
        initBlogSettings();
        initFeaturedImagePreview();
    });
    
    /**
     * Blog Settings Page
     */
    function initBlogSettings() {
        const saveButton = document.querySelector('#von-bastik-blog-save');
        if (saveButton) {
            saveButton.addEventListener('click', function(e) {
                // Validate form
                const blogPage = document.querySelector('#von_bastik_blog_page');
                if (blogPage && !blogPage.value) {
                    e.preventDefault();
                    alert('Please select a blog page.');
                    return false;
                }
            });
        }
    }
    
    /**
     * Featured Image Preview
     */
    function initFeaturedImagePreview() {
        const thumbnailFrame = document.querySelector('#thumbnail-frame');
        const thumbnailUrlInput = document.querySelector('#thumbnail-url');
        
        if (thumbnailFrame && thumbnailUrlInput) {
            // Show preview when URL changes
            thumbnailUrlInput.addEventListener('change', function() {
                if (this.value) {
                    thumbnailFrame.src = this.value;
                    thumbnailFrame.style.display = 'block';
                } else {
                    thumbnailFrame.style.display = 'none';
                }
            });
            
            // Show preview if URL already exists
            if (thumbnailUrlInput.value) {
                thumbnailFrame.src = thumbnailUrlInput.value;
                thumbnailFrame.style.display = 'block';
            }
        }
    }
    
    /**
     * Admin Notice Dismiss
     */
    function initAdminNotices() {
        const notices = document.querySelectorAll('.notice.is-dismissible');
        notices.forEach(function(noticе) {
            const closeButton = noticе.querySelector('.notice-dismiss');
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    noticе.style.display = 'none';
                });
            }
        });
    }
    
    initAdminNotices();
    
})();
