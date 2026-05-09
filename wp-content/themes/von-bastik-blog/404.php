<?php
/**
 * The template for displaying 404 pages
 *
 * @package Von_Bastik_Blog
 */

get_header();
?>

<main class="site-content" id="main">
    <div class="container">
        <div class="error-page">
            <h1>404</h1>
            <h2><?php _e('Page Not Found', 'von-bastik-blog'); ?></h2>
            <p><?php _e('The page you are looking for does not exist or has been moved.', 'von-bastik-blog'); ?></p>
            
            <?php get_search_form(); ?>
            
            <div class="mt-md">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="hero-btn">
                    <?php _e('Back to Home', 'von-bastik-blog'); ?>
                </a>
            </div>
        </div>
    </div>
</main>

<?php
get_footer();
