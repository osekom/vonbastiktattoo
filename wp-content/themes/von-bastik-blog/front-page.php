<?php
/**
 * Template Name: Front Page
 * The front page template for Von Bastik Tattoo Studio
 *
 * @package Von_Bastik_Blog
 */

get_header();
?>

<!-- Hero Section -->
<?php include get_template_directory() . '/templates/hero-section.php'; ?>

<!-- Marquee Section -->
<?php include get_template_directory() . '/templates/marquee-section.php'; ?>

<!-- About Section -->
<?php include get_template_directory() . '/templates/about-section.php'; ?>

<!-- Services Section -->
<?php include get_template_directory() . '/templates/services-section.php'; ?>

<!-- Artists Section -->
<?php include get_template_directory() . '/templates/artists-section.php'; ?>

<!-- Gallery Section -->
<?php include get_template_directory() . '/templates/gallery-section.php'; ?>

<!-- Testimonials Section -->
<?php include get_template_directory() . '/templates/testimonials-section.php'; ?>

<!-- Contact Section -->
<?php include get_template_directory() . '/templates/contact-section.php'; ?>

<?php
get_footer();
