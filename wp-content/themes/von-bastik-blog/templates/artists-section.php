<?php
/**
 * Artists Section Template
 * 
 * @package Von_Bastik_Blog
 */

$artists_title = get_theme_mod('artists_title', 'Nuestros Artistas');
$artists_subtitle = get_theme_mod('artists_subtitle', 'Conoce al equipo detrás del arte');

// Query artists
$artists_query = new WP_Query(array(
    'post_type' => 'artist',
    'posts_per_page' => -1,
    'orderby' => 'menu_order',
    'order' => 'ASC',
));
?>

<section class="py-24 px-6" id="artistas" aria-labelledby="artists-title">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 reveal">
            <h2 id="artists-title" class="section-title"><?php echo esc_html($artists_title); ?></h2>
            <p class="section-subtitle"><?php echo esc_html($artists_subtitle); ?></p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php if ($artists_query->have_posts()): ?>
                <?php while ($artists_query->have_posts()): $artists_query->the_post(); ?>
                <article class="artist-card reveal">
                    <div class="artist-image-wrapper">
                        <?php if (has_post_thumbnail()): ?>
                            <?php the_post_thumbnail('medium', array('class' => 'artist-image', 'alt' => get_the_title())); ?>
                        <?php else: ?>
                            <div class="artist-image-placeholder" style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);"></div>
                        <?php endif; ?>
                        <div class="artist-overlay">
                            <a href="<?php the_permalink(); ?>" class="btn-primary">Ver Portfolio</a>
                        </div>
                    </div>
                    <div class="artist-info">
                        <h3 class="artist-name"><?php the_title(); ?></h3>
                        <p class="artist-specialty"><?php echo esc_html(get_the_excerpt()); ?></p>
                        <div class="artist-links">
                            <a href="<?php the_permalink(); ?>" class="artist-link" aria-label="Ver portfolio de <?php the_title(); ?>">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                </svg>
                                <span>Ver más</span>
                            </a>
                        </div>
                    </div>
                </article>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>
            <?php else: ?>
                <div class="col-span-full text-center py-12">
                    <p>No hay artistas registrados aún.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>
