<?php
/**
 * Von Bastik Blog Admin Bootstrap
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Load admin files
 */
require_once get_template_directory() . '/admin/blog-settings.php';

/**
 * Enqueue admin scripts and styles
 */
function von_bastik_blog_admin_scripts() {
    wp_enqueue_style('von-bastik-blog-admin-css', get_template_directory_uri() . '/assets/css/admin.css', array(), '1.0.0');
    wp_enqueue_script('von-bastik-blog-admin-js', get_template_directory_uri() . '/assets/js/admin.js', array('jquery'), '1.0.0', true);
}
add_action('admin_enqueue_scripts', 'von_bastik_blog_admin_scripts');

/**
 * Add admin notice for first-time setup
 */
function von_bastik_blog_admin_notices() {
    if (!get_option('von_bastik_blog_setup_complete')) {
        ?>
        <div class="notice notice-info is-dismissible">
            <h3><?php _e('Von Bastik Blog Theme Setup', 'von-bastik-blog'); ?></h3>
            <p>
                <?php _e('Welcome to Von Bastik Blog theme! Please configure your blog page and settings in the Customizer.', 'von-bastik-blog'); ?>
                <a href="<?php echo esc_url(admin_url('customize.php')); ?>">
                    <?php _e('Configure Now', 'von-bastik-blog'); ?>
                </a>
            </p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'von_bastik_blog_admin_notices');

/**
 * Mark setup as complete after customizer save
 */
function von_bastik_blog_complete_setup() {
    update_option('von_bastik_blog_setup_complete', true);
}
add_action('customize_save_after', 'von_bastik_blog_complete_setup');
