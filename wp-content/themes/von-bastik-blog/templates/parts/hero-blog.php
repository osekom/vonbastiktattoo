<?php
/**
 * Template part for blog hero section
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<section class="hero-section" style="height: 40vh;">
    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/banner.jpg'); ?>" alt="<?php _e('Blog', 'von-bastik-blog'); ?>" class="hero-bg">
    <div class="hero-overlay"></div>
    <div class="hero-content">
        <h1 class="hero-title"><?php _e('Articles', 'von-bastik-blog'); ?></h1>
        <p class="hero-subtitle"><?php _e('News, tips, and updates from Von Bastik Tattoo Studio', 'von-bastik-blog'); ?></p>
    </div>
</section>
