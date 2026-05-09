<?php
/**
 * Von Bastik Blog Theme Functions
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Include additional theme files
 */
require_once get_template_directory() . '/admin/theme-settings.php';

/**
 * Theme setup
 */
function von_bastik_blog_setup() {
    // Add default posts and comments RSS feed links to head
    add_theme_support('feed-links');

    // Add post thumbnails
    add_theme_support('post-thumbnails');
    set_post_thumbnail_size(800, 500, true);
    add_image_size('blog-card', 400, 250, true);
    add_image_size('recent-post', 150, 150, true);
    add_image_size('hero-image', 1920, 800, true);
    add_image_size('artist-hero', 1200, 600, true);
    add_image_size('gallery-thumb', 400, 400, true);

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'von-bastik-blog'),
        'footer'  => __('Footer Menu', 'von-bastik-blog'),
    ));

    // Add HTML5 support
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));

    // Add custom title tag
    add_theme_support('title-tag');

    // Customize
    add_theme_support('custom-logo');
    add_theme_support('custom-header');
    add_theme_support('custom-background');
}
add_action('after_setup_theme', 'von_bastik_blog_setup');

/**
 * Enqueue scripts and styles
 */
function von_bastik_blog_scripts() {
    // Main stylesheet
    wp_enqueue_style('von-bastik-blog-style', get_stylesheet_uri(), array(), '2.0.0');
    
    // Google Fonts
    wp_enqueue_style('von-bastik-blog-fonts', 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap', array(), null);
    
    // Font Awesome
    wp_enqueue_style('von-bastik-blog-fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css', array(), '6.5.0');
    
    // Main JavaScript
    wp_enqueue_script('von-bastik-blog-app', get_template_directory_uri() . '/assets/js/app.js', array('jquery'), '2.0.0', true);
    
    // Localize script for AJAX
    wp_localize_script('von-bastik-blog-app', 'vonBastikAjax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('von-bastik-nonce'),
        'home_url' => home_url('/'),
    ));
}
add_action('wp_enqueue_scripts', 'von_bastik_blog_scripts');

/**
 * Register Custom Post Types
 */
function von_bastik_blog_register_cpts() {
    // Artists CPT
    register_post_type('artist', array(
        'labels' => array(
            'name'               => __('Artists', 'von-bastik-blog'),
            'singular_name'      => __('Artist', 'von-bastik-blog'),
            'menu_name'          => __('Artists', 'von-bastik-blog'),
            'add_new'            => __('Add New Artist', 'von-bastik-blog'),
            'add_new_item'       => __('Add New Artist', 'von-bastik-blog'),
            'edit_item'          => __('Edit Artist', 'von-bastik-blog'),
            'new_item'           => __('New Artist', 'von-bastik-blog'),
            'view_item'          => __('View Artist', 'von-bastik-blog'),
            'search_items'       => __('Search Artists', 'von-bastik-blog'),
            'not_found'          => __('No artists found', 'von-bastik-blog'),
            'not_found_in_trash' => __('No artists found in trash', 'von-bastik-blog'),
        ),
        'public'             => true,
        'has_archive'        => true,
        'archive'            => 'artistas',
        'show_in_rest'       => true,
        'menu_icon'          => 'dashicons-groups',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'rewrite'            => array('slug' => 'artistas'),
        'menu_position'      => 20,
    ));

    // Gallery Items CPT
    register_post_type('gallery_item', array(
        'labels' => array(
            'name'               => __('Gallery', 'von-bastik-blog'),
            'singular_name'      => __('Work', 'von-bastik-blog'),
            'menu_name'          => __('Gallery', 'von-bastik-blog'),
            'add_new'            => __('Add New Work', 'von-bastik-blog'),
            'add_new_item'       => __('Add New Work', 'von-bastik-blog'),
            'edit_item'          => __('Edit Work', 'von-bastik-blog'),
            'new_item'           => __('New Work', 'von-bastik-blog'),
            'view_item'          => __('View Work', 'von-bastik-blog'),
            'search_items'       => __('Search Works', 'von-bastik-blog'),
            'not_found'          => __('No works found', 'von-bastik-blog'),
            'not_found_in_trash' => __('No works found in trash', 'von-bastik-blog'),
        ),
        'public'             => true,
        'has_archive'        => true,
        'archive'            => 'galeria',
        'show_in_rest'       => true,
        'menu_icon'          => 'dashicons-admin-media',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'rewrite'            => array('slug' => 'trabajos'),
        'menu_position'      => 21,
    ));

    // Testimonials CPT
    register_post_type('testimonial', array(
        'labels' => array(
            'name'               => __('Testimonials', 'von-bastik-blog'),
            'singular_name'      => __('Testimonial', 'von-bastik-blog'),
            'menu_name'          => __('Testimonials', 'von-bastik-blog'),
            'add_new'            => __('Add New Testimonial', 'von-bastik-blog'),
            'add_new_item'       => __('Add New Testimonial', 'von-bastik-blog'),
            'edit_item'          => __('Edit Testimonial', 'von-bastik-blog'),
            'new_item'           => __('New Testimonial', 'von-bastik-blog'),
            'view_item'          => __('View Testimonial', 'von-bastik-blog'),
            'search_items'       => __('Search Testimonials', 'von-bastik-blog'),
            'not_found'          => __('No testimonials found', 'von-bastik-blog'),
            'not_found_in_trash' => __('No testimonials found in trash', 'von-bastik-blog'),
        ),
        'public'             => false,
        'show_in_rest'       => true,
        'menu_icon'          => 'dashicons-format-quote',
        'supports'           => array('title', 'editor', 'excerpt', 'custom-fields'),
        'menu_position'      => 22,
    ));
}
add_action('init', 'von_bastik_blog_register_cpts');

/**
 * Register Custom Taxonomies
 */
function von_bastik_blog_register_taxonomies() {
    // Artist Styles Taxonomy
    register_taxonomy('artist_style', array('artist'), array(
        'labels' => array(
            'name'          => __('Artist Styles', 'von-bastik-blog'),
            'singular_name' => __('Artist Style', 'von-bastik-blog'),
            'search_items'  => __('Search Styles', 'von-bastik-blog'),
            'all_items'     => __('All Styles', 'von-bastik-blog'),
            'edit_item'     => __('Edit Style', 'von-bastik-blog'),
            'update_item'   => __('Update Style', 'von-bastik-blog'),
            'add_new_item'  => __('Add New Style', 'von-bastik-blog'),
        ),
        'public'       => true,
        'show_ui'      => true,
        'show_admin_column' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => array('slug' => 'artist-style'),
    ));

    // Gallery Category Taxonomy
    register_taxonomy('gallery_category', array('gallery_item'), array(
        'labels' => array(
            'name'          => __('Gallery Categories', 'von-bastik-blog'),
            'singular_name' => __('Gallery Category', 'von-bastik-blog'),
            'search_items'  => __('Search Categories', 'von-bastik-blog'),
            'all_items'     => __('All Categories', 'von-bastik-blog'),
            'edit_item'     => __('Edit Category', 'von-bastik-blog'),
            'update_item'   => __('Update Category', 'von-bastik-blog'),
            'add_new_item'  => __('Add New Category', 'von-bastik-blog'),
        ),
        'public'       => true,
        'show_ui'      => true,
        'show_admin_column' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => array('slug' => 'gallery-cat'),
    ));
}
add_action('init', 'von_bastik_blog_register_taxonomies');

/**
 * Register Widget Areas
 */
function von_bastik_blog_widgets_init() {
    register_sidebar(array(
        'name'          => __('Sidebar', 'von-bastik-blog'),
        'id'            => 'sidebar-1',
        'description'   => __('Add widgets here to appear in the blog sidebar.', 'von-bastik-blog'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));

    register_sidebar(array(
        'name'          => __('Footer 1', 'von-bastik-blog'),
        'id'            => 'footer-1',
        'description'   => __('First footer widget area.', 'von-bastik-blog'),
        'before_widget' => '<div class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4>',
        'after_title'   => '</h4>',
    ));

    register_sidebar(array(
        'name'          => __('Footer 2', 'von-bastik-blog'),
        'id'            => 'footer-2',
        'description'   => __('Second footer widget area.', 'von-bastik-blog'),
        'before_widget' => '<div class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4>',
        'after_title'   => '</h4>',
    ));

    register_sidebar(array(
        'name'          => __('Footer 3', 'von-bastik-blog'),
        'id'            => 'footer-3',
        'description'   => __('Third footer widget area.', 'von-bastik-blog'),
        'before_widget' => '<div class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4>',
        'after_title'   => '</h4>',
    ));

    register_sidebar(array(
        'name'          => __('Footer 4', 'von-bastik-blog'),
        'id'            => 'footer-4',
        'description'   => __('Fourth footer widget area.', 'von-bastik-blog'),
        'before_widget' => '<div class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4>',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'von_bastik_blog_widgets_init');

/**
 * Create default pages on theme activation
 */
function von_bastik_blog_create_default_pages() {
    if (!get_option('von_bastik_blog_pages_created')) {
        // Contact page
        $contact_content = '<!-- wp:shortcode -->[contact-form]<!-- /wp:shortcode -->';
        wp_insert_post(array(
            'post_title'   => 'Contacto',
            'post_content' => $contact_content,
            'post_status'  => 'publish',
            'post_type'    => 'page',
            'post_slug'    => 'contacto',
        ));

        update_option('von_bastik_blog_pages_created', true);
    }
}
add_action('after_switch_theme', 'von_bastik_blog_create_default_pages');

/**
 * Custom excerpt length
 */
function von_bastik_blog_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'von_bastik_blog_excerpt_length');

/**
 * Custom excerpt more
 */
function von_bastik_blog_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'von_bastik_blog_excerpt_more');

/**
 * Add body classes for theme detection
 */
function von_bastik_blog_body_classes($classes) {
    if (is_front_page()) {
        $classes[] = 'front-page';
    }
    if (is_singular('artist')) {
        $classes[] = 'artist-page';
    }
    if (is_singular('gallery_item')) {
        $classes[] = 'gallery-page';
    }
    return $classes;
}
add_filter('body_class', 'von_bastik_blog_body_classes');

/**
 * Get hero images for slideshow
 */
function von_bastik_blog_get_hero_images() {
    $hero_images = get_theme_mod('von_bastik_hero_images', array());
    
    // Default hero images if none set
    if (empty($hero_images)) {
        $default_images = array(
            get_template_directory_uri() . '/assets/images/banner.jpg',
            get_template_directory_uri() . '/public/artist/Selene/selene-hero.jpg',
            get_template_directory_uri() . '/public/artist/Inkbo/inkbo-hero.jpg',
            get_template_directory_uri() . '/public/artist/BigTorres/bigtorres-hero.jpg',
        );
        return $default_images;
    }
    
    return $hero_images;
}

/**
 * Get typewriter phrases
 */
function von_bastik_blog_get_typewriter_phrases() {
    $phrases = get_theme_mod('von_bastik_typewriter_phrases', array(
        'Tres artistas, un estudio.',
        'Realismo, Blackwork, Fine Line.',
        'Arte que permanece en tu piel.',
        'Tu historia, nuestra tinta.'
    ));
    return $phrases;
}

/**
 * Get services data
 */
function von_bastik_blog_get_services() {
    $services = get_theme_mod('von_bastik_services', array(
        array(
            'title' => 'Tatuajes',
            'description' => 'Contamos con artistas especializados en todos los estilos de tatuaje. Desde realismo hasta estilos tradicionales y modernos. Nuestro equipo incluye artistas internacionales premiados y reconocidos.',
            'icon' => 'fa-paint-brush',
            'image' => 'service-tatuajes.jpg',
        ),
        array(
            'title' => 'Diseños Personalizados',
            'description' => 'Ofrecemos diseños personalizados adaptados a tus ideas y necesidades. Trabajamos contigo para crear el diseño perfecto que refleje tu personalidad.',
            'icon' => 'fa-pencil-ruler',
            'image' => 'service-disenos.jpg',
        ),
        array(
            'title' => 'Piercing',
            'description' => 'Realizamos todo tipo de piercings, incluyendo microdermales y genitales, siguiendo estrictas normas de higiene y seguridad.',
            'icon' => 'fa-gem',
            'image' => 'service-piercing.jpg',
        ),
        array(
            'title' => 'Venta de Joyería Especializada',
            'description' => 'Disponemos de una amplia variedad de joyería especializada para tus piercings, asegurando calidad y estilo en cada pieza.',
            'icon' => 'fa-ring',
            'image' => 'service-joyeria.jpg',
        ),
        array(
            'title' => 'Eliminación de Tatuaje con Láser',
            'description' => 'Utilizamos tecnología avanzada de láser para eliminar tatuajes de manera segura y efectiva, con resultados garantizados.',
            'icon' => 'fa-bolt',
            'image' => 'service-laser.jpg',
        ),
        array(
            'title' => 'Venta de Arte',
            'description' => 'En nuestro estudio también puedes encontrar y adquirir obras de arte exclusivas realizadas por nuestros talentosos artistas.',
            'icon' => 'fa-palette',
            'image' => 'service-arte.jpg',
        ),
    ));
    return $services;
}

/**
 * Get about section data
 */
function von_bastik_blog_get_about_data() {
    return array(
        'title' => get_theme_mod('von_bastik_about_title', 'Donde la Visión se Convierte en Tinta'),
        'paragraph_1' => get_theme_mod('von_bastik_about_paragraph_1', 'Von Bastik nació de la pasión por el arte sobre piel. Nuestro estudio reúne a tres talentos excepcionales, cada uno con un estilo distintivo que abarca desde el realismo más detallado hasta el blackwork más contundente. Trabajamos con equipos de última generación, pigmentos premium y los más altos estándares de higiene.'),
        'paragraph_2' => get_theme_mod('von_bastik_about_paragraph_2', 'Cada diseño es una colaboración entre artista y cliente, una pieza irrepetible que lleva tu historia grabada con maestría.'),
        'stats' => array(
            array('count' => '5000', 'label' => 'Tatuajes'),
            array('count' => '12', 'label' => 'Años'),
            array('count' => '100', 'label' => '% Artesanal'),
        ),
    );
}

/**
 * Get contact information
 */
function von_bastik_blog_get_contact_info() {
    return array(
        'email' => 'vonbastiktattoo@gmail.com',
        'phone' => '+34 653 053 913',
        'whatsapp' => '34653053913',
        'address' => 'Calle Victoria, 1, local B\nAlcalá de Henares, Madrid',
        'hours' => 'Mar - Sáb: 11:30 - 14:00 | 16:00 - 20:00',
        'saturday' => '11:30 - 20:00',
        'sunday' => 'Cerrado',
    );
}

/**
 * Get social links
 */
function von_bastik_blog_get_social_links() {
    return array(
        'instagram' => 'https://www.instagram.com/vonbastiktattoo/',
        'facebook' => 'https://www.facebook.com/vonbastiktattoo/',
        'tiktok' => 'https://tiktok.com/@vonbastik',
        'youtube' => 'https://youtube.com/@vonbastik',
    );
}

/**
 * Register theme customizer sections and settings
 */
function von_bastik_blog_customize_register($wp_customize) {
    // Hero Section
    $wp_customize->add_section('von_bastik_hero', array(
        'title'    => __('Hero Section', 'von-bastik-blog'),
        'priority' => 30,
    ));
    
    $wp_customize->add_setting('hero_tagline', array(
        'default'           => 'Tattoo Studio',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('hero_tagline', array(
        'label'   => __('Homepage Tagline', 'von-bastik-blog'),
        'section' => 'von_bastik_hero',
        'type'    => 'text',
    ));
    
    // Marquee Section
    $wp_customize->add_section('von_bastik_marquee', array(
        'title'    => __('Marquee Section', 'von-bastik-blog'),
        'priority' => 35,
    ));
    
    for ($i = 1; $i <= 6; $i++) {
        $wp_customize->add_setting('marquee_text_' . $i, array(
            'default'           => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));
        $wp_customize->add_control('marquee_text_' . $i, array(
            'label'   => __('Marquee Text ' . $i, 'von-bastik-blog'),
            'section' => 'von_bastik_marquee',
            'type'    => 'text',
        ));
    }
    
    // About Section
    $wp_customize->add_section('von_bastik_about', array(
        'title'    => __('About Section', 'von-bastik-blog'),
        'priority' => 40,
    ));
    
    $wp_customize->add_setting('about_title', array(
        'default'           => 'Sobre Nosotros',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('about_title', array(
        'label'   => __('About Title', 'von-bastik-blog'),
        'section' => 'von_bastik_about',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('about_content', array(
        'default'           => '',
        'sanitize_callback' => 'wp_kses_post',
    ));
    $wp_customize->add_control('about_content', array(
        'label'   => __('About Content', 'von-bastik-blog'),
        'section' => 'von_bastik_about',
        'type'    => 'textarea',
    ));
    
    $wp_customize->add_setting('about_image', array(
        'default'           => get_template_directory_uri() . '/assets/images/banner.jpg',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'about_image', array(
        'label'   => __('About Image', 'von-bastik-blog'),
        'section' => 'von_bastik_about',
    )));
    
    // Services Section
    $wp_customize->add_section('von_bastik_services', array(
        'title'    => __('Services Section', 'von-bastik-blog'),
        'priority' => 45,
    ));
    
    $wp_customize->add_setting('services_title', array(
        'default'           => 'Nuestros Servicios',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('services_title', array(
        'label'   => __('Services Title', 'von-bastik-blog'),
        'section' => 'von_bastik_services',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('services_subtitle', array(
        'default'           => 'Todo lo que ofrecemos',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('services_subtitle', array(
        'label'   => __('Services Subtitle', 'von-bastik-blog'),
        'section' => 'von_bastik_services',
        'type'    => 'text',
    ));
    
    // Artists Section
    $wp_customize->add_section('von_bastik_artists', array(
        'title'    => __('Artists Section', 'von-bastik-blog'),
        'priority' => 50,
    ));
    
    $wp_customize->add_setting('artists_title', array(
        'default'           => 'Nuestros Artistas',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('artists_title', array(
        'label'   => __('Artists Title', 'von-bastik-blog'),
        'section' => 'von_bastik_artists',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('artists_subtitle', array(
        'default'           => 'Conoce al equipo detrás del arte',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('artists_subtitle', array(
        'label'   => __('Artists Subtitle', 'von-bastik-blog'),
        'section' => 'von_bastik_artists',
        'type'    => 'text',
    ));
    
    // Gallery Section
    $wp_customize->add_section('von_bastik_gallery', array(
        'title'    => __('Gallery Section', 'von-bastik-blog'),
        'priority' => 55,
    ));
    
    $wp_customize->add_setting('gallery_title', array(
        'default'           => 'Nuestra Galería',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('gallery_title', array(
        'label'   => __('Gallery Title', 'von-bastik-blog'),
        'section' => 'von_bastik_gallery',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('gallery_subtitle', array(
        'default'           => 'Explora nuestro trabajo',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('gallery_subtitle', array(
        'label'   => __('Gallery Subtitle', 'von-bastik-blog'),
        'section' => 'von_bastik_gallery',
        'type'    => 'text',
    ));
    
    // Testimonials Section
    $wp_customize->add_section('von_bastik_testimonials', array(
        'title'    => __('Testimonials Section', 'von-bastik-blog'),
        'priority' => 60,
    ));
    
    $wp_customize->add_setting('testimonials_title', array(
        'default'           => 'Lo que dicen nuestros clientes',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('testimonials_title', array(
        'label'   => __('Testimonials Title', 'von-bastik-blog'),
        'section' => 'von_bastik_testimonials',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('testimonials_subtitle', array(
        'default'           => 'Experiencias reales de clientes satisfechos',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('testimonials_subtitle', array(
        'label'   => __('Testimonials Subtitle', 'von-bastik-blog'),
        'section' => 'von_bastik_testimonials',
        'type'    => 'text',
    ));
    
    // Contact Section
    $wp_customize->add_section('von_bastik_contact', array(
        'title'    => __('Contact Section', 'von-bastik-blog'),
        'priority' => 65,
    ));
    
    $wp_customize->add_setting('contact_title', array(
        'default'           => 'Contacta con nosotros',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('contact_title', array(
        'label'   => __('Contact Title', 'von-bastik-blog'),
        'section' => 'von_bastik_contact',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('contact_subtitle', array(
        'default'           => '¿Listo para tu próximo tatuaje? Escríbenos',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('contact_subtitle', array(
        'label'   => __('Contact Subtitle', 'von-bastik-blog'),
        'section' => 'von_bastik_contact',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('contact_address', array(
        'default'           => 'Calle Victoria, 1, local B\nAlcalá de Henares, Madrid',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('contact_address', array(
        'label'   => __('Contact Address', 'von-bastik-blog'),
        'section' => 'von_bastik_contact',
        'type'    => 'textarea',
    ));
    
    $wp_customize->add_setting('contact_phone', array(
        'default'           => '+34 653 053 913',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('contact_phone', array(
        'label'   => __('Contact Phone', 'von-bastik-blog'),
        'section' => 'von_bastik_contact',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('contact_email', array(
        'default'           => 'vonbastiktattoo@gmail.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('contact_email', array(
        'label'   => __('Contact Email', 'von-bastik-blog'),
        'section' => 'von_bastik_contact',
        'type'    => 'email',
    ));
    
    $wp_customize->add_setting('contact_hours', array(
        'default'           => 'Mar - Sáb: 11:30 - 14:00 | 16:00 - 20:00',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('contact_hours', array(
        'label'   => __('Contact Hours', 'von-bastik-blog'),
        'section' => 'von_bastik_contact',
        'type'    => 'text',
    ));
    
    $wp_customize->add_setting('contact_sunday', array(
        'default'           => 'Dom - Lun: Cerrado',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('contact_sunday', array(
        'label'   => __('Contact Sunday Hours', 'von-bastik-blog'),
        'section' => 'von_bastik_contact',
        'type'    => 'text',
    ));
    
    // WhatsApp Number
    $wp_customize->add_setting('whatsapp_number', array(
        'default'           => '34653053913',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('whatsapp_number', array(
        'label'   => __('WhatsApp Number (with country code)', 'von-bastik-blog'),
        'section' => 'von_bastik_contact',
        'type'    => 'text',
    ));
    
    // Stats
    $wp_customize->add_section('von_bastik_stats', array(
        'title'    => __('Statistics', 'von-bastik-blog'),
        'priority' => 70,
    ));
    
    $wp_customize->add_setting('stat_studio', array(
        'default'           => '10',
        'sanitize_callback' => 'absint',
    ));
    $wp_customize->add_control('stat_studio', array(
        'label'   => __('Years of Studio', 'von-bastik-blog'),
        'section' => 'von_bastik_stats',
        'type'    => 'number',
    ));
    
    $wp_customize->add_setting('stat_artists', array(
        'default'           => '3',
        'sanitize_callback' => 'absint',
    ));
    $wp_customize->add_control('stat_artists', array(
        'label'   => __('Number of Artists', 'von-bastik-blog'),
        'section' => 'von_bastik_stats',
        'type'    => 'number',
    ));
    
    $wp_customize->add_setting('stat_clients', array(
        'default'           => '5000',
        'sanitize_callback' => 'absint',
    ));
    $wp_customize->add_control('stat_clients', array(
        'label'   => __('Number of Clients', 'von-bastik-blog'),
        'section' => 'von_bastik_stats',
        'type'    => 'number',
    ));
}
add_action('customize_register', 'von_bastik_blog_customize_register');
