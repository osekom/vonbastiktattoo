<?php
/**
 * About Section Template
 * 
 * @package Von_Bastik_Blog
 */

$about_data = von_bastik_blog_get_about_data();
$about_title = get_theme_mod('about_title', $about_data['title']);
$about_content = get_theme_mod('about_content', $about_data['content']);
$about_image = get_theme_mod('about_image', $about_data['image']);
$stat_studio = get_theme_mod('stat_studio', $about_data['stats']['studio']);
$stat_artists = get_theme_mod('stat_artists', $about_data['stats']['artists']);
$stat_clients = get_theme_mod('stat_clients', $about_data['stats']['clients']);
?>

<section class="py-24 px-6" id="nosotros" aria-labelledby="about-title">
    <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
            <div class="reveal">
                <div class="about-image-wrapper">
                    <img src="<?php echo esc_url($about_image); ?>" alt="<?php echo esc_attr($about_title); ?>" class="about-image">
                </div>
            </div>
            <div class="reveal">
                <h2 id="about-title" class="section-title"><?php echo esc_html($about_title); ?></h2>
                <div class="about-text">
                    <?php echo wp_kses_post($about_content); ?>
                </div>
                <div class="grid grid-cols-3 gap-8">
                    <div class="stat">
                        <span class="stat-number" data-target="<?php echo esc_attr($stat_studio); ?>"><?php echo esc_html($stat_studio); ?></span>
                        <span class="stat-label">Años de estudio</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number" data-target="<?php echo esc_attr($stat_artists); ?>"><?php echo esc_html($stat_artists); ?></span>
                        <span class="stat-label">Artistas</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number" data-target="<?php echo esc_attr($stat_clients); ?>"><?php echo esc_html($stat_clients); ?></span>
                        <span class="stat-label">Clientes</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
