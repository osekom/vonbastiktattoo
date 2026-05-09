<?php
/**
 * Template Name: Blog Page
 * Custom template for blog listing page
 *
 * @package Von_Bastik_Blog
 */

get_header();
?>

<?php get_template_part('templates/parts/hero', 'blog'); ?>

<main class="site-content" id="main">
    <div class="container">
        <div class="site-content-wrapper">
            <div class="content-area" id="primary">
                <?php if (have_posts()) : ?>
                    <div class="blog-grid">
                        <?php
                        while (have_posts()) :
                            the_post();
                            get_template_part('templates/content', 'excerpt');
                        endwhile;
                        ?>
                    </div>
                    
                    <?php von_bastik_blog_pagination(); ?>
                    
                <?php else : ?>
                    <?php get_template_part('templates/no', 'results'); ?>
                <?php endif; ?>
            </div>
            
            <?php get_sidebar(); ?>
        </div>
    </div>
</main>

<?php
get_footer();
