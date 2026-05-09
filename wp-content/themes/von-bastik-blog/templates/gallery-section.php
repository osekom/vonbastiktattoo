<?php
/**
 * Gallery Section Template
 * 
 * @package Von_Bastik_Blog
 */

$gallery_title = get_theme_mod('gallery_title', 'Nuestra Galería');
$gallery_subtitle = get_theme_mod('gallery_subtitle', 'Explora nuestro trabajo');

// Get gallery items
$gallery_query = new WP_Query(array(
    'post_type' => 'gallery_item',
    'posts_per_page' => 12,
    'orderby' => 'date',
    'order' => 'DESC',
));

// Group by category
$gallery_by_category = array(
    'tatuajes' => array(),
    'piercing' => array(),
);

if ($gallery_query->have_posts()) {
    while ($gallery_query->have_posts()) {
        $gallery_query->the_post();
        $attachment_url = get_the_post_thumbnail_url(get_the_ID(), 'large');
        $attachment_full = wp_get_attachment_image_src(get_the_ID(), 'full');
        
        $item = array(
            'id' => get_the_ID(),
            'title' => get_the_title(),
            'artist' => get_the_excerpt(),
            'url' => $attachment_url ?: ($attachment_full[0] ?? ''),
            'full_url' => $attachment_full[0] ?? '',
        );
        
        // Get categories
        $terms = get_the_terms(get_the_ID(), 'gallery_category');
        if ($terms && !is_wp_error($terms)) {
            foreach ($terms as $term) {
                if ($term->slug === 'piercing') {
                    $gallery_by_category['piercing'][] = $item;
                } else {
                    $gallery_by_category['tatuajes'][] = $item;
                }
            }
        } else {
            $gallery_by_category['tatuajes'][] = $item;
        }
    }
    wp_reset_postdata();
}

// If no gallery items, use placeholder images from static site
if (empty($gallery_by_category['tatuajes'])) {
    $default_tattoo_images = array(
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Retrato B&N', 'artist' => 'Selene'),
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'León Realista', 'artist' => 'Selene'),
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Manga Completa', 'artist' => 'Selene'),
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Línea Delicada', 'artist' => 'Big Torres'),
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Acuarela Floral', 'artist' => 'Big Torres'),
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Composición Botánica', 'artist' => 'Big Torres'),
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Ace Flag', 'artist' => 'Inkbo'),
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Jigglypuff', 'artist' => 'Inkbo'),
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Predator', 'artist' => 'Inkbo'),
    );
    $gallery_by_category['tatuajes'] = $default_tattoo_images;
}

if (empty($gallery_by_category['piercing'])) {
    $gallery_by_category['piercing'] = array(
        array('url' => get_template_directory_uri() . '/assets/images/banner.jpg', 'title' => 'Piercing Profesional', 'artist' => 'Von Bastik Studio'),
    );
}
?>

<section class="py-24 px-6" id="galeria" aria-labelledby="gallery-title">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 reveal">
            <h2 id="gallery-title" class="section-title"><?php echo esc_html($gallery_title); ?></h2>
            <p class="section-subtitle"><?php echo esc_html($gallery_subtitle); ?></p>
        </div>
        
        <div class="flex justify-center gap-4 mb-12 reveal">
            <button class="gallery-tab active" data-tab="tatuajes">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span>Tatuajes</span>
            </button>
            <button class="gallery-tab" data-tab="piercing">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2v20M2 12h20"/>
                </svg>
                <span>Piercing</span>
            </button>
        </div>
        
        <div class="gallery-panel active" id="panel-tatuajes">
            <div class="gallery-grid reveal" id="galleryGridTatuajes">
                <?php foreach ($gallery_by_category['tatuajes'] as $index => $item): ?>
                <div class="gallery-item" onclick="openLightbox(this)" role="button" tabindex="0" aria-label="Ver <?php echo esc_attr($item['title']); ?> por <?php echo esc_attr($item['artist']); ?>">
                    <img src="<?php echo esc_url($item['url']); ?>" alt="<?php echo esc_attr($item['title']); ?>" loading="lazy">
                    <div class="gallery-overlay">
                        <h4 class="gallery-item-title"><?php echo esc_html($item['title']); ?></h4>
                        <p class="gallery-item-artist"><?php echo esc_html($item['artist']); ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        
        <div class="gallery-panel" id="panel-piercing" style="display:none;">
            <div class="gallery-grid reveal" id="galleryGridPiercing">
                <?php foreach ($gallery_by_category['piercing'] as $item): ?>
                <div class="gallery-item" onclick="openLightbox(this)" role="button" tabindex="0" aria-label="Ver <?php echo esc_attr($item['title']); ?>">
                    <img src="<?php echo esc_url($item['url']); ?>" alt="<?php echo esc_attr($item['title']); ?>" loading="lazy">
                    <div class="gallery-overlay">
                        <h4 class="gallery-item-title"><?php echo esc_html($item['title']); ?></h4>
                        <p class="gallery-item-artist"><?php echo esc_html($item['artist']); ?></p>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        
        <div class="text-center mt-12 reveal">
            <a href="#" class="btn-primary">Ver todo el portfolio</a>
        </div>
    </div>
</section>
