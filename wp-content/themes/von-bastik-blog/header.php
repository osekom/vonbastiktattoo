<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <?php if (is_front_page()): ?>
    <title><?php bloginfo('name'); ?> | <?php echo get_theme_mod('homepage_tagline', 'Tattoo Studio'); ?></title>
    <?php else: ?>
    <title><?php wp_title(' | ', true, 'right'); ?> <?php bloginfo('name'); ?></title>
    <?php endif; ?>
    
    <link rel="canonical" href="<?php echo esc_url(home_url('/')); ?>">
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Header/Navigation -->
<header>
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-500" id="navbar" aria-label="Navegación principal">
        <div class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div class="logo">
                <a href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr(bloginfo('name')); ?> - Inicio">
                    <?php if (has_custom_logo()): ?>
                        <?php the_custom_logo(); ?>
                    <?php else: ?>
                        <img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/images/logo.png" alt="<?php echo esc_attr(bloginfo('name')); ?>" class="h-12 w-auto">
                    <?php endif; ?>
                </a>
            </div>
            
            <div class="desktop-nav flex items-center gap-10">
                <a href="<?php echo esc_url(home_url('/')); ?>#inicio" class="nav-link"><?php _e('Inicio', 'von-bastik-blog'); ?></a>
                <a href="<?php echo esc_url(home_url('/')); ?>#nosotros" class="nav-link"><?php _e('Nosotros', 'von-bastik-blog'); ?></a>
                <a href="<?php echo esc_url(home_url('/')); ?>#servicios" class="nav-link"><?php _e('Servicios', 'von-bastik-blog'); ?></a>
                <a href="<?php echo esc_url(home_url('/')); ?>#artistas" class="nav-link"><?php _e('Artistas', 'von-bastik-blog'); ?></a>
                <a href="<?php echo esc_url(home_url('/')); ?>#galeria" class="nav-link"><?php _e('Galería', 'von-bastik-blog'); ?></a>
                <a href="<?php echo esc_url(home_url('/')); ?>#resenas" class="nav-link"><?php _e('Reseñas', 'von-bastik-blog'); ?></a>
                <a href="<?php echo esc_url(home_url('/')); ?>#contacto" class="nav-link"><?php _e('Contacto', 'von-bastik-blog'); ?></a>
                <?php if (has_nav_menu('blog')): ?>
                <a href="<?php echo esc_url(home_url('/blog')); ?>" class="nav-link"><?php _e('Blog', 'von-bastik-blog'); ?></a>
                <?php endif; ?>
            </div>
            
            <button class="hamburger" id="hamburger" aria-label="<?php _e('Abrir menú', 'von-bastik-blog'); ?>" aria-expanded="false">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>
        </div>
    </nav>
</header>

<!-- Mobile Menu -->
<div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="<?php _e('Menú de navegación móvil', 'von-bastik-blog'); ?>">
    <div class="mobile-menu-header">
        <div class="mobile-menu-logo">
            <?php if (has_custom_logo()): ?>
                <?php the_custom_logo(); ?>
            <?php else: ?>
                <span class="mobile-menu-title"><?php bloginfo('name'); ?></span>
            <?php endif; ?>
        </div>
        <button class="close-menu" id="closeMenu" aria-label="<?php _e('Cerrar menú', 'von-bastik-blog'); ?>">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
    
    <nav class="mobile-nav" aria-label="<?php _e('Navegación móvil', 'von-bastik-blog'); ?>">
        <ul class="mobile-menu-list">
            <li><a href="<?php echo esc_url(home_url('/')); ?>#inicio"><?php _e('Inicio', 'von-bastik-blog'); ?></a></li>
            <li><a href="<?php echo esc_url(home_url('/')); ?>#nosotros"><?php _e('Nosotros', 'von-bastik-blog'); ?></a></li>
            <li><a href="<?php echo esc_url(home_url('/')); ?>#servicios"><?php _e('Servicios', 'von-bastik-blog'); ?></a></li>
            <li><a href="<?php echo esc_url(home_url('/')); ?>#artistas"><?php _e('Artistas', 'von-bastik-blog'); ?></a></li>
            <li><a href="<?php echo esc_url(home_url('/')); ?>#galeria"><?php _e('Galería', 'von-bastik-blog'); ?></a></li>
            <li><a href="<?php echo esc_url(home_url('/')); ?>#resenas"><?php _e('Reseñas', 'von-bastik-blog'); ?></a></li>
            <li><a href="<?php echo esc_url(home_url('/')); ?>#contacto"><?php _e('Contacto', 'von-bastik-blog'); ?></a></li>
            <?php if (has_nav_menu('blog')): ?>
            <li><a href="<?php echo esc_url(home_url('/blog')); ?>"><?php _e('Blog', 'von-bastik-blog'); ?></a></li>
            <?php endif; ?>
        </ul>
    </nav>
    
    <div class="mobile-menu-footer">
        <div class="mobile-social-links">
            <?php
            $social_links = von_bastik_blog_get_social_links();
            if (!empty($social_links['instagram'])): ?>
            <a href="<?php echo esc_url($social_links['instagram']); ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
            </a>
            <?php endif; ?>
            <?php if (!empty($social_links['facebook'])): ?>
            <a href="<?php echo esc_url($social_links['facebook']); ?>" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
            </a>
            <?php endif; ?>
            <?php if (!empty($social_links['tiktok'])): ?>
            <a href="<?php echo esc_url($social_links['tiktok']); ?>" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>
                </svg>
            </a>
            <?php endif; ?>
        </div>
    </div>
</div>

<!-- Main Content -->
<main id="main-content">
