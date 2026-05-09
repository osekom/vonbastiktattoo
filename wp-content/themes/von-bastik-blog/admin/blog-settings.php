<?php
/**
 * Von Bastik Blog Settings
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register blog settings
 */
function von_bastik_blog_register_settings() {
    register_setting('von_bastik_blog_settings_group', 'von_bastik_blog_posts_per_page', array(
        'type'              => 'integer',
        'sanitize_callback' => 'absint',
        'default'           => 6,
    ));
    
    register_setting('von_bastik_blog_settings_group', 'von_bastik_blog_enable_comments', array(
        'type'              => 'boolean',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'default'           => true,
    ));
    
    register_setting('von_bastik_blog_settings_group', 'von_bastik_blog_show_related', array(
        'type'              => 'boolean',
        'sanitize_callback' => 'rest_sanitize_boolean',
        'default'           => true,
    ));
}
add_action('init', 'von_bastik_blog_register_settings');

/**
 * Add blog settings to Customizer
 */
function von_bastik_blog_customize_settings($wp_customize) {
    // Blog Settings Section
    $wp_customize->add_section('von_bastik_blog_settings', array(
        'title'    => __('Blog Settings', 'von-bastik-blog'),
        'priority' => 30,
    ));
    
    // Posts per page
    $wp_customize->add_setting('von_bastik_blog_posts_per_page', array(
        'default'           => 6,
        'sanitize_callback' => 'absint',
    ));
    
    $wp_customize->add_control('von_bastik_blog_posts_per_page', array(
        'label'   => __('Posts per Page', 'von-bastik-blog'),
        'section' => 'von_bastik_blog_settings',
        'type'    => 'number',
        'input_attrs' => array(
            'min' => 1,
            'max' => 50,
        ),
    ));
    
    // Enable comments
    $wp_customize->add_setting('von_bastik_blog_enable_comments', array(
        'default'           => 1,
        'sanitize_callback' => 'absint',
    ));
    
    $wp_customize->add_control('von_bastik_blog_enable_comments', array(
        'label'   => __('Enable Comments', 'von-bastik-blog'),
        'section' => 'von_bastik_blog_settings',
        'type'    => 'checkbox',
    ));
    
    // Show related posts
    $wp_customize->add_setting('von_bastik_blog_show_related', array(
        'default'           => 1,
        'sanitize_callback' => 'absint',
    ));
    
    $wp_customize->add_control('von_bastik_blog_show_related', array(
        'label'   => __('Show Related Posts', 'von-bastik-blog'),
        'section' => 'von_bastik_blog_settings',
        'type'    => 'checkbox',
    ));
}
add_action('customize_register', 'von_bastik_blog_customize_settings');

/**
 * Get blog setting
 */
function von_bastik_blog_get_setting($key, $default = '') {
    return get_option($key, $default);
}
