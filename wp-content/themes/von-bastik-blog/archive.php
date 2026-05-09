<?php
/**
 * The template for archive pages
 *
 * @package Von_Bastik_Blog
 */

get_header();
?>

<main class="site-content" id="main">
    <div class="container">
        <div class="site-content-wrapper">
            <div class="content-area" id="primary">
                <?php if (have_posts()) : ?>
                    <header class="archive-header">
                        <?php if (is_category()) : ?>
                            <h1><?php single_cat_title('', false); ?></h1>
                            <p><?php echo esc_html(description_category()); ?></p>
                        <?php elseif (is_tag()) : ?>
                            <h1><?php single_tag_title('', false); ?></h1>
                            <p><?php _e('Articles tagged with', 'von-bastik-blog'); ?>: <?php single_tag_title('', false); ?></p>
                        <?php elseif (is_author()) : ?>
                            <h1><?php _e('Articles by', 'von-bastik-blog'); ?> <?php the_author(); ?></h1>
                        <?php elseif (is_date()) : ?>
                            <h1>
                                <?php
                                if (is_day()) :
                                    echo get_the_date();
                                elseif (is_month()) :
                                    echo get_the_date('F Y');
                                elseif (is_year()) :
                                    echo get_the_date('Y');
                                else :
                                    _e('Archive', 'von-bastik-blog');
                                endif;
                                ?>
                            </h1>
                        <?php endif; ?>
                    </header>
                    
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
