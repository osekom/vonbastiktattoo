<?php
/**
 * Template part for displaying blog card excerpts
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class('blog-card'); ?>>
    <?php if (has_post_thumbnail()) : ?>
        <div class="blog-card-image">
            <a href="<?php the_permalink(); ?>">
                <?php the_post_thumbnail('blog-card', array('alt' => get_the_title())); ?>
            </a>
            
            <?php
            $categories = get_the_category();
            if ($categories) :
                $category = $categories[0];
                ?>
                <span class="blog-card-category">
                    <?php echo esc_html($category->name); ?>
                </span>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="blog-card-content">
        <div class="blog-card-meta">
            <span>
                <i class="fas fa-calendar-alt"></i>
                <?php echo get_the_date(); ?>
            </span>
            <span>
                <i class="fas fa-user"></i>
                <?php the_author(); ?>
            </span>
        </div>
        
        <h2 class="blog-card-title">
            <a href="<?php the_permalink(); ?>">
                <?php the_title(); ?>
            </a>
        </h2>
        
        <p class="blog-card-excerpt">
            <?php echo von_bastik_blog_get_excerpt(30); ?>
        </p>
        
        <a href="<?php the_permalink(); ?>" class="blog-card-read-more">
            <?php _e('Read More', 'von-bastik-blog'); ?>
        </a>
    </div>
</article>
