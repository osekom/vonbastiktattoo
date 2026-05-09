<?php
/**
 * Template part for hero section
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<section class="hero-section">
    <?php
    // Use custom header if available, otherwise use default
    $hero_image = get_header_image();
    if (!$hero_image) {
        $hero_image = get_template_directory_uri() . '/assets/images/banner.jpg';
    }
    ?>
    <img src="<?php echo esc_url($hero_image); ?>" alt="<?php bloginfo('name'); ?>" class="hero-bg">
    <div class="hero-overlay"></div>
    <div class="hero-content">
        <h1 class="hero-title"><?php bloginfo('name'); ?></h1>
        <p class="hero-subtitle"><?php bloginfo('description'); ?></p>
        <a href="#main" class="hero-btn">
            <?php _e('Explore Articles', 'von-bastik-blog'); ?>
        </a>
    </div>
</section>
