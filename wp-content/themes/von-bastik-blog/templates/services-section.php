<?php
/**
 * Services Section Template
 * 
 * @package Von_Bastik_Blog
 */

$services = von_bastik_blog_get_services();
$services_title = get_theme_mod('services_title', $services['title']);
$services_subtitle = get_theme_mod('services_subtitle', $services['subtitle']);
?>

<section class="py-24 px-6 bg-[#0d0d0d]" id="servicios" aria-labelledby="services-title">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 reveal">
            <h2 id="services-title" class="section-title"><?php echo esc_html($services_title); ?></h2>
            <p class="section-subtitle"><?php echo esc_html($services_subtitle); ?></p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php foreach ($services['items'] as $index => $service): ?>
            <article class="service-card reveal">
                <div class="service-icon">
                    <?php if (!empty($service['image'])): ?>
                        <img src="<?php echo esc_url($service['image']); ?>" alt="<?php echo esc_attr($service['title']); ?>" class="w-12 h-12">
                    <?php endif; ?>
                </div>
                <h3 class="service-title"><?php echo esc_html($service['title']); ?></h3>
                <p class="service-description"><?php echo esc_html($service['description']); ?></p>
                <a href="#contacto" class="service-link">
                    <?php echo esc_html($service['link_text']); ?>
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>
