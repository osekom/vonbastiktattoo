<?php
/**
 * The template for displaying pages
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
                        <h1 class="single-post-title"><?php the_title(); ?></h1>
                    </header>
                    
                    <div class="single-post-content">
                        <?php the_content(); ?>
                    </div>
                </article>
                
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
