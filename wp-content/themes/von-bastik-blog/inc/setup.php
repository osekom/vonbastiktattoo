<?php
/**
 * Theme Setup
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Set up theme defaults and registers support for various WordPress features
 */
function von_bastik_blog_setup() {
    // Make theme available for translation
    load_theme_textdomain('von-bastik-blog', get_template_directory() . '/languages');
    
    // Add default posts and comments RSS feed links to head
    add_theme_support('feed-links');
    
    // Add post thumbnails
    add_theme_support('post-thumbnails');
    set_post_thumbnail_size(800, 500, true);
    add_image_size('blog-card', 400, 250, true);
    add_image_size('recent-post', 150, 150, true);
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'von-bastik-blog'),
        'footer'  => __('Footer Menu', 'von-bastik-blog'),
    ));
    
    // Add HTML5 support
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Add custom title tag
    add_theme_support('title-tag');
    
    // Customize
    add_theme_support('custom-logo');
    add_theme_support('custom-header');
    add_theme_support('custom-background');
    
    // Align wide images
    add_theme_support('align-wide');
    
    // Responsive embeds
    add_theme_support('responsive-embeds');
}
add_action('after_setup_theme', 'von_bastik_blog_setup');
