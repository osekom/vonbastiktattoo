<?php
/**
 * Scripts and Styles Enqueue
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue scripts and styles
 */
function von_bastik_blog_enqueue_assets() {
    // Main stylesheet
    wp_enqueue_style('von-bastik-blog-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Google Fonts
    wp_enqueue_style('von-bastik-blog-fonts', 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap', array(), null);
    
    // Font Awesome
    wp_enqueue_style('von-bastik-blog-fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css', array(), '6.5.0');
    
    // Main JavaScript
    wp_enqueue_script('von-bastik-blog-app', get_template_directory_uri() . '/assets/js/app.js', array(), '1.0.0', true);
    
    // Localize script for AJAX
    wp_localize_script('von-bastik-blog-app', 'vonBastikAjax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('von-bastik-nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'von_bastik_blog_enqueue_assets');
