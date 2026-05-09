<?php
/**
 * The main template file
 *
 * @package Von_Bastik_Blog
 */

get_header();
?>

<main class="site-content" id="main">
    <div class="container">
        <div class="site-content-wrapper">
            <div class="content-area" id="primary">
                <header class="archive-header">
                    <h1><?php bloginfo('name'); ?></h1>
                    <p><?php bloginfo('description'); ?></p>
                </header>
                
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
