<?php
/**
 * Template Name: Single Artist Page
 * 
 * @package Von_Bastik_Blog
 */

get_header();

while (have_posts()): the_post();
    $artist_id = get_the_ID();
    $artist_name = get_the_title();
    $artist_slug = get_post_meta($artist_id, 'artist_slug', true);
    $artist_bio = get_the_content();
    $artist_skills = get_the_excerpt();
    $artist_hero_image = get_the_post_thumbnail_url($artist_id, 'full');
    
    // Get gallery items for this artist (using custom field or taxonomy)
    $artist_gallery = get_post_meta($artist_id, 'artist_gallery_images', array());
    
    // Get gallery category terms
    $gallery_terms = get_the_terms($artist_id, 'gallery_category');
    
    // Default hero image path
    if (empty($artist_hero_image)) {
        $artist_hero_image = get_template_directory_uri() . '/assets/images/banner.jpg';
    }
    
    // Default gallery images from public folder
    if (empty($artist_gallery)) {
        $artist_gallery = array(
            get_template_directory_uri() . '/assets/images/banner.jpg',
            get_template_directory_uri() . '/assets/images/banner.jpg',
            get_template_directory_uri() . '/assets/images/banner.jpg',
            get_template_directory_uri() . '/assets/images/banner.jpg',
            get_template_directory_uri() . '/assets/images/banner.jpg',
            get_template_directory_uri() . '/assets/images/banner.jpg',
        );
    }
?>

<!-- Artist Hero Section -->
<section class="artist-hero-section" aria-label="<?php echo esc_attr($artist_name); ?>">
    <div class="artist-hero-bg" style="background-image: url('<?php echo esc_url($artist_hero_image); ?>')">
    </div>
    <div class="max-w-7xl mx-auto w-full">
        <div class="artist-hero-content px-6">
            <h1 class="artist-hero-title"><?php echo esc_html($artist_name); ?></h1>
            <?php if (!empty($artist_skills)): ?>
            <p class="artist-hero-specialty"><?php echo esc_html($artist_skills); ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- Bio Section -->
<section class="bio-section px-6" id="biografia" aria-labelledby="bio-title">
    <div class="max-w-4xl mx-auto">
        <div class="reveal">
            <h2 id="bio-title" class="section-title"><?php _e('Biografía', 'von-bastik-blog'); ?></h2>
            <div class="bio-text">
                <?php echo wp_kses_post(wpautop($artist_bio)); ?>
            </div>
        </div>
        <?php if (!empty($artist_skills)): ?>
        <div class="skills-section mt-12 reveal">
            <h3 class="skills-title"><?php _e('Especialidades', 'von-bastik-blog'); ?></h3>
            <div class="skills-grid">
                <?php
                $skills_list = array_map('trim', explode(',', $artist_skills));
                foreach ($skills_list as $skill): ?>
                <div class="skill-tag">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span><?php echo esc_html($skill); ?></span>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>

<!-- Gallery Section -->
<section class="py-24 px-6" id="galeria" aria-labelledby="gallery-title">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 reveal">
            <h2 id="gallery-title" class="section-title"><?php printf(__('Galería de %s', 'von-bastik-blog'), esc_html($artist_name)); ?></h2>
            <p class="section-subtitle"><?php _e('Explora el trabajo de este artista', 'von-bastik-blog'); ?></p>
        </div>
        <div class="gallery-grid reveal" id="galleryGrid">
            <?php foreach ($artist_gallery as $index => $image_url): ?>
            <div class="gallery-item" onclick="openLightbox(this)" role="button" tabindex="0" aria-label="<?php printf(__('Ver trabajo %d', 'von-bastik-blog'), $index + 1); ?>">
                <img src="<?php echo esc_url($image_url); ?>" alt="<?php printf(__('Trabajo de %s %d', 'von-bastik-blog'), esc_html($artist_name), $index + 1); ?>" loading="lazy">
                <div class="gallery-overlay">
                    <h4 class="gallery-item-title"><?php printf(__('Trabajo %d', 'von-bastik-blog'), $index + 1); ?></h4>
                    <p class="gallery-item-artist"><?php echo esc_html($artist_name); ?></p>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section class="py-24 px-6 bg-[#0d0d0d]" id="contacto" aria-labelledby="contact-title">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 reveal">
            <h2 id="contact-title" class="section-title"><?php _e('Contacta con nosotros', 'von-bastik-blog'); ?></h2>
            <p class="section-subtitle"><?php _e('¿Listo para tu próximo tatuaje con', 'von-bastik-blog'); ?> <?php echo esc_html($artist_name); ?>?</p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-16">
            <div class="reveal">
                <form id="contactForm" aria-label="<?php _e('Formulario de contacto', 'von-bastik-blog'); ?>">
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label for="contact-name" class="form-label"><?php _e('Nombre', 'von-bastik-blog'); ?></label>
                            <input type="text" id="contact-name" name="name" class="form-input" placeholder="<?php _e('Tu nombre', 'von-bastik-blog'); ?>" required>
                        </div>
                        <div>
                            <label for="contact-email" class="form-label"><?php _e('Email', 'von-bastik-blog'); ?></label>
                            <input type="email" id="contact-email" name="email" class="form-input" placeholder="tu@email.com" required>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label for="contact-phone" class="form-label"><?php _e('Teléfono', 'von-bastik-blog'); ?></label>
                            <input type="tel" id="contact-phone" name="phone" class="form-input" placeholder="+34 600 000 000">
                        </div>
                        <div>
                            <label for="contact-style" class="form-label"><?php _e('Estilo de tatuaje', 'von-bastik-blog'); ?></label>
                            <select id="contact-style" name="style" class="form-input">
                                <option value=""><?php _e('Selecciona un estilo', 'von-bastik-blog'); ?></option>
                                <option value="realismo"><?php _e('Realismo', 'von-bastik-blog'); ?></option>
                                <option value="fine-line"><?php _e('Fine Line', 'von-bastik-blog'); ?></option>
                                <option value="acuarela"><?php _e('Acuarela', 'von-bastik-blog'); ?></option>
                                <option value="blackwork"><?php _e('Blackwork', 'von-bastik-blog'); ?></option>
                                <option value="tradecional"><?php _e('Tradicional', 'von-bastik-blog'); ?></option>
                                <option value="japonés"><?php _e('Japonés', 'von-bastik-blog'); ?></option>
                                <option value="lettering"><?php _e('Lettering', 'von-bastik-blog'); ?></option>
                                <option value="otro"><?php _e('Otro', 'von-bastik-blog'); ?></option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label for="contact-message" class="form-label"><?php _e('Mensaje', 'von-bastik-blog'); ?></label>
                        <textarea id="contact-message" name="message" class="form-input" rows="5" placeholder="<?php _e('Cuéntanos tu idea...', 'von-bastik-blog'); ?>" required></textarea>
                    </div>
                    <button type="submit" class="btn-primary w-full"><?php _e('Enviar mensaje', 'von-bastik-blog'); ?></button>
                </form>
            </div>
            
            <div class="reveal">
                <div class="mb-10">
                    <h3 class="section-title mb-6"><?php _e('Información de contacto', 'von-bastik-blog'); ?></h3>
                    <div class="space-y-6">
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-[#c9a96e] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold mb-1"><?php _e('Dirección', 'von-bastik-blog'); ?></h4>
                                <p class="text-[#ccc]"><?php echo nl2br(esc_html(get_theme_mod('contact_address', 'Calle Victoria, 1, local B\nAlcalá de Henares, Madrid'))); ?></p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-[#c9a96e] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold mb-1"><?php _e('Teléfono', 'von-bastik-blog'); ?></h4>
                                <p class="text-[#ccc]"><a href="tel:<?php echo esc_attr(get_theme_mod('contact_phone', '34653053913')); ?>"><?php echo esc_html(get_theme_mod('contact_phone', '+34 653 053 913')); ?></a></p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-[#c9a96e] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold mb-1"><?php _e('Email', 'von-bastik-blog'); ?></h4>
                                <p class="text-[#ccc]"><a href="mailto:<?php echo esc_attr(get_theme_mod('contact_email', 'vonbastiktattoo@gmail.com')); ?>"><?php echo esc_html(get_theme_mod('contact_email', 'vonbastiktattoo@gmail.com')); ?></a></p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-[#c9a96e] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold mb-1"><?php _e('Horario', 'von-bastik-blog'); ?></h4>
                                <div class="text-[#ccc]">
                                    <p><?php echo esc_html(get_theme_mod('contact_hours', 'Mar - Sáb: 11:30 - 14:00 | 16:00 - 20:00')); ?></p>
                                    <p><?php echo esc_html(get_theme_mod('contact_sunday', 'Dom - Lun: Cerrado')); ?></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="section-title mb-6"><?php _e('Síguenos', 'von-bastik-blog'); ?></h3>
                    <div class="flex gap-3">
                        <?php
                        $social_links = von_bastik_blog_get_social_links();
                        if (!empty($social_links['instagram'])): ?>
                        <a href="<?php echo esc_url($social_links['instagram']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </a>
                        <?php endif; ?>
                        <?php if (!empty($social_links['facebook'])): ?>
                        <a href="<?php echo esc_url($social_links['facebook']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                            </svg>
                        </a>
                        <?php endif; ?>
                        <?php if (!empty($social_links['tiktok'])): ?>
                        <a href="<?php echo esc_url($social_links['tiktok']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="TikTok">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>
                            </svg>
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php
endwhile;

get_footer();
