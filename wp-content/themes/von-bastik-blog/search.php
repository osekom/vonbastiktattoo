<?php
/**
 * The template for search results
 *
 * @package Von_Bastik_Blog
 */

get_header();
?>

<main class="site-content" id="main">
    <div class="container">
        <div class="site-content-wrapper">
            <div class="content-area" id="primary">
                <div class="search-results">
                    <?php if (is_search()) : ?>
                        <div class="search-query">
                            <h1><?php printf(__('Search Results for: %s', 'von-bastik-blog'), get_search_query()); ?></h1>
                        </div>
                    <?php endif; ?>
                    
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
                        <div class="no-results">
                            <h2><?php _e('No Results Found', 'von-bastik-blog'); ?></h2>
                            <p><?php _e('Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'von-bastik-blog'); ?></p>
                            <?php get_search_form(); ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <?php get_sidebar(); ?>
        </div>
    </div>
</main>

<?php
get_footer();
