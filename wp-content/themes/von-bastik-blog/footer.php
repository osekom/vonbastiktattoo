<!-- Footer -->
<footer class="py-16 px-6" role="contentinfo">
    <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-12 mb-12">
            <div>
                <h3 class="footer-title"><?php _e('Von Bastik Tattoo', 'von-bastik-blog'); ?></h3>
                <p class="footer-description">
                    <?php _e('Estudio de tatuajes profesional dedicado al arte en la piel. Contamos con los mejores artistas y las mejores condiciones de higiene y seguridad.', 'von-bastik-blog'); ?>
                </p>
            </div>
            
            <div>
                <h3 class="footer-title"><?php _e('Enlaces', 'von-bastik-blog'); ?></h3>
                <ul class="footer-links">
                    <li><a href="<?php echo esc_url(home_url('/')); ?>#inicio"><?php _e('Inicio', 'von-bastik-blog'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/')); ?>#nosotros"><?php _e('Nosotros', 'von-bastik-blog'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/')); ?>#servicios"><?php _e('Servicios', 'von-bastik-blog'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/')); ?>#artistas"><?php _e('Artistas', 'von-bastik-blog'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/')); ?>#galeria"><?php _e('Galería', 'von-bastik-blog'); ?></a></li>
                </ul>
            </div>
            
            <div>
                <h3 class="footer-title"><?php _e('Legal', 'von-bastik-blog'); ?></h3>
                <ul class="footer-links">
                    <li><a href="<?php echo esc_url(home_url('/aviso-legal')); ?>"><?php _e('Aviso Legal', 'von-bastik-blog'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/politica-privacidad')); ?>"><?php _e('Política de Privacidad', 'von-bastik-blog'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/politica-cookies')); ?>"><?php _e('Política de Cookies', 'von-bastik-blog'); ?></a></li>
                </ul>
            </div>
        </div>
        
        <div class="inkborder-t inkborder-[#1a1a1a] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-[#888] text-sm">
                &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php _e('Todos los derechos reservados.', 'von-bastik-blog'); ?>
            </p>
            <div class="flex gap-3">
                <?php
                $social_links = von_bastik_blog_get_social_links();
                if (!empty($social_links['instagram'])): ?>
                <a href="<?php echo esc_url($social_links['instagram']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                </a>
                <?php endif; ?>
                <?php if (!empty($social_links['facebook'])): ?>
                <a href="<?php echo esc_url($social_links['facebook']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                    </svg>
                </a>
                <?php endif; ?>
                <?php if (!empty($social_links['tiktok'])): ?>
                <a href="<?php echo esc_url($social_links['tiktok']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="TikTok">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>
                    </svg>
                </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</footer>

<!-- Lightbox -->
<div class="lightbox" id="lightbox" role="dialog" aria-label="<?php _e('Visor de imagen', 'von-bastik-blog'); ?>">
    <button class="lightbox-close" id="lightboxClose" aria-label="<?php _e('Cerrar', 'von-bastik-blog'); ?>">
        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </button>
    <button class="lightbox-prev" id="lightboxPrev" aria-label="<?php _e('Imagen anterior', 'von-bastik-blog'); ?>">
        <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    </button>
    <img src="" alt="" id="lightboxImg">
    <div class="lightbox-info" id="lightboxInfo">
        <h3 id="lightboxTitle"></h3>
        <p id="lightboxArtist"></p>
    </div>
    <button class="lightbox-next" id="lightboxNext" aria-label="<?php _e('Siguiente imagen', 'von-bastik-blog'); ?>">
        <svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    </button>
</div>

<!-- Toast Notification -->
<div class="toast" id="toast" role="alert" aria-live="polite">
    <span class="toast-message"></span>
</div>

<!-- WhatsApp Floating Button -->
<a href="https://wa.me/<?php echo esc_attr(get_theme_mod('whatsapp_number', '34600000000')); ?>" target="_blank" rel="noopener noreferrer" class="whatsapp-float" aria-label="WhatsApp">
    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413 1.821c-2.249 2.248-5.235 3.488-8.416 3.488-2.164 0-4.283-.648-6.15-1.877l6.995 6.995c1.867 1.229 3.986 1.877 6.15 1.877 3.18 0 6.166-1.24 8.415-3.489a11.872 11.872 0 003.488-8.416 11.874 11.874 0 00-3.488-8.415 11.872 11.872 0 00-8.415-3.488 11.874 11.874 0 00-8.416 3.488A11.876 11.876 0 001.21 11.88c0 3.181 1.24 6.167 3.489 8.416l.353.358v2.324z"/>
    </svg>
</a>

<?php wp_footer(); ?>
</body>
</html>
