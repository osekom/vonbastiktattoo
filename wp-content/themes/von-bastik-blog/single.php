<?php
/**
 * The template for displaying single posts
 *
 * @package Von_Bastik_Blog
 */

get_header();
?>

<main class="site-content" id="main">
    <div class="container">
        <div class="single-post">
            <?php
            while (have_posts()) :
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="single-post-header">
                        <?php
                        $categories = get_the_category();
                        if ($categories) :
                            $category = $categories[0];
                            ?>
                            <a href="<?php echo esc_url(get_category_link($category->term_id)); ?>" class="single-post-category">
                                <?php echo esc_html($category->name); ?>
                            </a>
                        <?php endif; ?>
                        
                        <h1 class="single-post-title"><?php the_title(); ?></h1>
                        
                        <div class="single-post-meta">
                            <span>
                                <i class="fas fa-user"></i>
                                <?php the_author(); ?>
                            </span>
                            <span>
                                <i class="fas fa-calendar"></i>
                                <?php echo get_the_date(); ?>
                            </span>
                            <span>
                                <i class="fas fa-clock"></i>
                                <?php echo von_bastik_blog_reading_time(get_the_content()); ?>
                            </span>
                        </div>
                    </header>
                    
                    <?php if (has_post_thumbnail()) : ?>
                        <figure class="single-post-featured-image">
                            <?php the_post_thumbnail('full', array('alt' => get_the_title())); ?>
                        </figure>
                    <?php endif; ?>
                    
                    <div class="single-post-content">
                        <?php the_content(); ?>
                    </div>
                    
                    <?php
                    // Post tags
                    $tags = get_the_tags();
                    if ($tags) :
                        ?>
                        <div class="post-tags">
                            <?php foreach ($tags as $tag) : ?>
                                <a href="<?php echo esc_url(get_tag_link($tag->term_id)); ?>">
                                    <?php echo esc_html($tag->name); ?>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php // Share buttons ?>
                    <div class="post-share">
                        <span><?php _e('Share:', 'von-bastik-blog'); ?></span>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_permalink()); ?>" target="_blank" rel="noopener" aria-label="Share on Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://twitter.com/intent/tweet?url=<?php echo urlencode(get_permalink()); ?>&text=<?php echo urlencode(get_the_title()); ?>" target="_blank" rel="noopener" aria-label="Share on Twitter">
                            <i class="fab fa-x-twitter"></i>
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Share on Instagram">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="https://pinterest.com/pin/create/button/?url=<?php echo urlencode(get_permalink()); ?>&description=<?php echo urlencode(get_the_title()); ?>" target="_blank" rel="noopener" aria-label="Share on Pinterest">
                            <i class="fab fa-pinterest-p"></i>
                        </a>
                    </div>
                    
                    <?php // Post navigation ?>
                    <nav class="post-navigation" aria-label="Post navigation">
                        <div class="nav-previous">
                            <?php previous_post_link('%link', __('← Previous Article', 'von-bastik-blog')); ?>
                        </div>
                        <div class="nav-next">
                            <?php next_post_link('%link', __('Next Article →', 'von-bastik-blog')); ?>
                        </div>
                    </nav>
                </article>
                
                <?php // Related posts ?>
                <section class="related-posts">
                    <h3><?php _e('Related Articles', 'von-bastik-blog'); ?></h3>
                    <?php
                    $categories = get_the_category();
                    if ($categories) :
                        $category_ids = array();
                        foreach ($categories as $category) {
                            $category_ids[] = $category->term_id;
                        }
                        
                        $related_args = array(
                            'post_type'      => 'post',
                            'post__not_in'   => array(get_the_ID()),
                            'cat'            => implode(',', $category_ids),
                            'posts_per_page' => 3,
                            'orderby'        => 'date',
                        );
                        
                        $related_query = new WP_Query($related_args);
                        
                        if ($related_query->have_posts()) :
                            ?>
                            <div class="blog-grid">
                                <?php
                                while ($related_query->have_posts()) :
                                    $related_query->the_post();
                                    get_template_part('templates/content', 'excerpt');
                                endwhile;
                                ?>
                            </div>
                            <?php
                            wp_reset_postdata();
                        endif;
                    endif;
                    ?>
                </section>
                
                <?php
                // Display comments if enabled
                if (comments_open() || get_comments_number()) :
                    comments_template();
                endif;
                
            endwhile;
            ?>
        </div>
    </div>
</main>

<?php
get_footer();
