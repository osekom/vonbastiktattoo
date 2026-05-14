<?php
/**
 * Plugin Name: Tattoo Artist Manager
 * Plugin URI: https://vonbastik.com
 * Description: Manages tattoo artists with custom post types, meta fields, and REST API endpoints returning exact artists.json format.
 * Version: 1.0.0
 * Author: Von Bastik Studio
 * License: GPL v2 or later
 * Text Domain: tattoo-artist-manager
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Configuration: Set to true for static site compatibility (relative paths)
define('TAM_RELATIVE_PATHS', true);

// Plugin version for cache busting
define('TAM_VERSION', '1.0.0');

// Text domain
define('TAM_TEXT_DOMAIN', 'tattoo-artist-manager');

/**
 * ============================================================================
 * CUSTOM POST TYPE REGISTRATION
 * ============================================================================
 */

/**
 * Register the 'artist' custom post type.
 */
function tam_register_artist_post_type() {
    $labels = array(
        'name'               => __('Artists', TAM_TEXT_DOMAIN),
        'singular_name'      => __('Artist', TAM_TEXT_DOMAIN),
        'menu_name'          => __('Artists', TAM_TEXT_DOMAIN),
        'add_new'            => __('Add New Artist', TAM_TEXT_DOMAIN),
        'add_new_item'       => __('Add New Artist', TAM_TEXT_DOMAIN),
        'edit_item'          => __('Edit Artist', TAM_TEXT_DOMAIN),
        'new_item'           => __('New Artist', TAM_TEXT_DOMAIN),
        'view_item'          => __('View Artist', TAM_TEXT_DOMAIN),
        'search_items'       => __('Search Artists', TAM_TEXT_DOMAIN),
        'not_found'          => __('No artists found', TAM_TEXT_DOMAIN),
        'not_found_in_trash' => __('No artists found in Trash', TAM_TEXT_DOMAIN),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_string'       => true,
        'show_in_admin_bar'  => true,
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 25,
        'menu_icon'          => 'dashicons-groups',
        'supports'           => array('title', 'editor', 'thumbnail', 'page-attributes'),
        'rewrite'            => array('slug' => 'artist'),
        'show_in_rest'       => true,
        'rest_base'          => 'artists',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('artist', $args);
}
add_action('init', 'tam_register_artist_post_type');

/**
 * ============================================================================
 * TAXONOMY REGISTRATION
 * ============================================================================
 */

/**
 * Register 'genre' taxonomy for artists.
 */
function tam_register_genre_taxonomy() {
    $labels = array(
        'name'              => __('Genres', TAM_TEXT_DOMAIN),
        'singular_name'     => __('Genre', TAM_TEXT_DOMAIN),
        'search_items'      => __('Search Genres', TAM_TEXT_DOMAIN),
        'all_items'         => __('All Genres', TAM_TEXT_DOMAIN),
        'parent_item'       => __('Parent Genre', TAM_TEXT_DOMAIN),
        'parent_item_colon' => __('Parent Genre:', TAM_TEXT_DOMAIN),
        'edit_item'         => __('Edit Genre', TAM_TEXT_DOMAIN),
        'update_item'       => __('Update Genre', TAM_TEXT_DOMAIN),
        'add_new_item'      => __('Add New Genre', TAM_TEXT_DOMAIN),
        'new_item_name'     => __('New Genre Name', TAM_TEXT_DOMAIN),
        'menu_name'         => __('Genres', TAM_TEXT_DOMAIN),
    );

    $args = array(
        'labels'            => $labels,
        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'genre'),
    );

    register_taxonomy('genre', 'artist', $args);
}
add_action('init', 'tam_register_genre_taxonomy', 0);

/**
 * ============================================================================
 * META BOXES REGISTRATION
 * ============================================================================
 */

/**
 * Register all meta boxes for the artist post type.
 */
function tam_register_meta_boxes() {
    add_meta_box('tam_bio_meta', __('Artist Bio', TAM_TEXT_DOMAIN), 'tam_bio_meta_callback', 'artist', 'normal', 'high');
    add_meta_box('tam_hero_meta', __('Hero Section', TAM_TEXT_DOMAIN), 'tam_hero_meta_callback', 'artist', 'normal', 'high');
    add_meta_box('tam_seo_meta', __('SEO Settings', TAM_TEXT_DOMAIN), 'tam_seo_meta_callback', 'artist', 'normal', 'high');
    add_meta_box('tam_skills_meta', __('Skills & Specialties', TAM_TEXT_DOMAIN), 'tam_skills_meta_callback', 'artist', 'normal', 'high');
    add_meta_box('tam_social_meta', __('Social Media', TAM_TEXT_DOMAIN), 'tam_social_meta_callback', 'artist', 'normal', 'medium');
    add_meta_box('tam_awards_meta', __('Awards', TAM_TEXT_DOMAIN), 'tam_awards_meta_callback', 'artist', 'normal', 'medium');
    add_meta_box('tam_gallery_meta', __('Gallery Images', TAM_TEXT_DOMAIN), 'tam_gallery_meta_callback', 'artist', 'normal', 'high');
}
add_action('add_meta_boxes', 'tam_register_meta_boxes');

/**
 * Enqueue admin scripts for media uploaders.
 */
function tam_admin_enqueue_scripts($hook) {
    if (strpos($hook, 'post-new.php') === false && strpos($hook, 'post.php') === false) {
        return;
    }
    
    // Get the current post type from the request
    $post_type = '';
    if (isset($_GET['post_type'])) {
        $post_type = sanitize_text_field($_GET['post_type']);
    } elseif (isset($_GET['post'])) {
        $post = get_post(sanitize_post($_GET['post']));
        if ($post) {
            $post_type = $post->post_type;
        }
    }
    
    if ($post_type !== 'artist') {
        return;
    }
    
    wp_enqueue_media();
    $plugin_url = plugin_dir_url(__FILE__);
    wp_enqueue_script('tam-admin-scripts', trailingslashit($plugin_url) . 'assets/js/admin.js', array('jquery'), TAM_VERSION, true);
}
add_action('admin_enqueue_scripts', 'tam_admin_enqueue_scripts');

/**
 * ============================================================================
 * META BOX CALLBACKS
 * ============================================================================
 */

/**
 * Hero Section meta box callback.
 */
function tam_hero_meta_callback($post) {
    wp_nonce_field('tam_save_hero_meta', 'tam_hero_nonce');
    
    $specialty = get_post_meta($post->ID, '_tam_specialty', true);
    $subtitle = get_post_meta($post->ID, '_tam_subtitle', true);
    $cta = get_post_meta($post->ID, '_tam_cta', true);
    $hero_cover_id = get_post_meta($post->ID, '_tam_hero_cover_id', true);
    $hero_cover_url = '';
    
    if ($hero_cover_id) {
        $hero_cover_url = wp_get_attachment_image_src($hero_cover_id, 'full');
        $hero_cover_url = $hero_cover_url ? $hero_cover_url[0] : '';
    }
    
    // Default CTA
    if (empty($cta)) {
        $cta = 'Reservar Cita';
    }
    ?>
    <table class="form-table">
        <tr>
            <th scope="row"><label for="_tam_specialty"><?php _e('Specialty', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <input type="text" id="_tam_specialty" name="_tam_specialty" value="<?php echo esc_attr($specialty); ?>" class="regular-text" />
                <p class="description"><?php _e('e.g., Anime, Blackwork y Tradicional de autor', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="_tam_subtitle"><?php _e('Subtitle', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <textarea id="_tam_subtitle" name="_tam_subtitle" rows="3" class="large-text"><?php echo esc_textarea($subtitle); ?></textarea>
                <p class="description"><?php _e('Short description for the hero section.', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="_tam_cta"><?php _e('Call to Action', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <input type="text" id="_tam_cta" name="_tam_cta" value="<?php echo esc_attr($cta); ?>" class="regular-text" />
                <p class="description"><?php _e('Button text for the hero section.', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row"><label><?php _e('Hero Cover Image', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <div id="tam-hero-cover-preview" style="margin-bottom: 10px;">
                    <?php if ($hero_cover_url): ?>
                        <img src="<?php echo esc_url($hero_cover_url); ?>" alt="Hero Cover Preview" style="max-width: 100%; height: auto; max-height: 300px;" />
                    <?php else: ?>
                        <p><em><?php _e('No hero cover image selected.', TAM_TEXT_DOMAIN); ?></em></p>
                    <?php endif; ?>
                </div>
                <input type="hidden" id="_tam_hero_cover_id" name="_tam_hero_cover_id" value="<?php echo esc_attr($hero_cover_id); ?>" />
                <button type="button" class="button tam-upload-hero-btn" id="tam-upload-hero-btn"><?php _e('Set Hero Cover Image', TAM_TEXT_DOMAIN); ?></button>
                <button type="button" class="button tam-remove-hero-btn" id="tam-remove-hero-btn" style="display: <?php echo $hero_cover_url ? 'inline-block' : 'none'; ?>; margin-left: 5px;"><?php _e('Remove', TAM_TEXT_DOMAIN); ?></button>
                <p class="description"><?php _e('Click "Set Hero Cover Image" to upload or select an image for the artist\'s hero section.', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * SEO Settings meta box callback.
 */
function tam_seo_meta_callback($post) {
    wp_nonce_field('tam_save_seo_meta', 'tam_seo_nonce');
    
    $seo_title = get_post_meta($post->ID, '_tam_seo_title', true);
    $seo_description = get_post_meta($post->ID, '_tam_seo_description', true);
    $seo_keywords = get_post_meta($post->ID, '_tam_seo_keywords', true);
    $seo_canonical = get_post_meta($post->ID, '_tam_seo_canonical', true);
    
    if (empty($seo_canonical)) {
        $seo_canonical = home_url('/artist.html?id=' . $post->post_name);
    }
    ?>
    <table class="form-table">
        <tr>
            <th scope="row"><label for="_tam_seo_title"><?php _e('SEO Title', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <input type="text" id="_tam_seo_title" name="_tam_seo_title" value="<?php echo esc_attr($seo_title); ?>" class="large-text" />
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="_tam_seo_description"><?php _e('SEO Description', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <textarea id="_tam_seo_description" name="_tam_seo_description" rows="3" class="large-text"><?php echo esc_textarea($seo_description); ?></textarea>
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="_tam_seo_keywords"><?php _e('SEO Keywords', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <input type="text" id="_tam_seo_keywords" name="_tam_seo_keywords" value="<?php echo esc_attr($seo_keywords); ?>" class="large-text" />
                <p class="description"><?php _e('Comma-separated keywords (will be stored as a single string).', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="_tam_seo_canonical"><?php _e('Canonical URL', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <input type="url" id="_tam_seo_canonical" name="_tam_seo_canonical" value="<?php echo esc_attr($seo_canonical); ?>" class="large-text" />
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Skills & Specialties meta box callback.
 */
function tam_skills_meta_callback($post) {
    wp_nonce_field('tam_save_skills_meta', 'tam_skills_nonce');
    
    $skills_labels = get_post_meta($post->ID, '_tam_skills_labels', true);
    $skills_data = get_post_meta($post->ID, '_tam_skills_data', true);
    
    // Genres (taxonomy)
    $genres = wp_get_object_terms($post->ID, 'genre', array('fields' => 'names'));
    $genres_str = !empty($genres) ? implode(', ', $genres) : '';
    ?>
    <table class="form-table">
        <tr>
            <th scope="row"><label for="_tam_skills_labels"><?php _e('Skills Labels', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <input type="text" id="_tam_skills_labels" name="_tam_skills_labels" value="<?php echo esc_attr($skills_labels); ?>" class="large-text" />
                <p class="description"><?php _e('Comma-separated skills labels (e.g., Anime, Blackwork, Tradicional).', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row"><label for="_tam_skills_data"><?php _e('Skills Data (JSON)', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <textarea id="_tam_skills_data" name="_tam_skills_data" rows="4" class="large-text"><?php echo esc_textarea($skills_data); ?></textarea>
                <p class="description"><?php _e('JSON array of skill objects with level/proficiency (optional, not included in public API).', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
        <tr>
            <th scope="row"><label><?php _e('Genres', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <textarea id="tam_genres_display" rows="3" class="large-text" readonly><?php echo esc_textarea($genres_str); ?></textarea>
                <p class="description"><?php _e('Edit genres using the Genres metabox on the right sidebar.', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Social Media meta box callback.
 */
function tam_social_meta_callback($post) {
    wp_nonce_field('tam_save_social_meta', 'tam_social_nonce');
    
    $social = get_post_meta($post->ID, '_tam_social', true);
    ?>
    <table class="form-table">
        <tr>
            <th scope="row"><label for="_tam_social"><?php _e('Social Media URLs', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <textarea id="_tam_social" name="_tam_social" rows="5" class="large-text"><?php echo esc_textarea($social); ?></textarea>
                <p class="description"><?php _e('One URL per line (e.g., https://www.instagram.com/artistprofile).', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Awards meta box callback.
 */
function tam_awards_meta_callback($post) {
    wp_nonce_field('tam_save_awards_meta', 'tam_awards_nonce');
    
    $awards = get_post_meta($post->ID, '_tam_awards', true);
    ?>
    <table class="form-table">
        <tr>
            <th scope="row"><label for="_tam_awards"><?php _e('Awards', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <textarea id="_tam_awards" name="_tam_awards" rows="5" class="large-text"><?php echo esc_textarea($awards); ?></textarea>
                <p class="description"><?php _e('One award per line.', TAM_TEXT_DOMAIN); ?></p>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Artist Bio meta box callback.
 */
function tam_bio_meta_callback($post) {
    wp_nonce_field('tam_save_bio_meta', 'tam_bio_nonce');
    
    $bio = get_post_meta($post->ID, '_tam_bio', true);
    ?>
    <table class="form-table">
        <tr>
            <th scope="row"><label for="_tam_bio"><?php _e('Artist Bio', TAM_TEXT_DOMAIN); ?></label></th>
            <td>
                <textarea id="_tam_bio" name="_tam_bio" rows="10" class="large-text" placeholder="Paragraph 1...&#10;&#10;Paragraph 2...&#10;&#10;Paragraph 3..."><?php echo esc_textarea($bio); ?></textarea>
                <p class="description"><?php _e('Enter the artist biography. Separate each paragraph with a blank line (double Enter). Each paragraph will become an element in the bio array.', TAM_TEXT_DOMAIN); ?></p>
                <p class="description"><strong><?php _e('Example:', TAM_TEXT_DOMAIN); ?></strong></p>
                <p class="description"><code>Seven years of experience and solid training at the Madrid Higher School of Drawing define the work of Selene.<br><br>In Von Bastik Tattoo, Selene elevates pop culture and anime to an author level.<br><br>If you're looking for an exclusive piece in Alcalá de Henares...</code></p>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Gallery Settings meta box callback.
 */
function tam_gallery_meta_callback($post) {
    wp_nonce_field('tam_save_gallery_meta', 'tam_gallery_nonce');
    
    $gallery_ids = get_post_meta($post->ID, '_tam_gallery_ids', true);
    if (empty($gallery_ids)) {
        $gallery_ids = array();
    }
    ?>
    <div>
        <div id="tam-gallery-preview" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <?php foreach ($gallery_ids as $img_id): ?>
                <div class="tam-gallery-item" style="position: relative; width: 120px; height: 120px; border: 1px solid #ccc;">
                    <img src="<?php echo esc_url(wp_get_attachment_image_src($img_id, 'thumbnail')[0]); ?>" alt="" style="width: 100%; height: 100%; object-fit: cover;" />
                    <button type="button" class="tam-remove-gallery-item" data-id="<?php echo esc_attr($img_id); ?>" style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer; width: 24px; height: 24px; line-height: 20px; text-align: center; font-weight: bold;">×</button>
                </div>
            <?php endforeach; ?>
        </div>
        <p style="margin-top: 15px;">
            <input type="hidden" id="_tam_gallery_ids" name="_tam_gallery_ids" value="<?php echo esc_attr(implode(',', $gallery_ids)); ?>" />
            <button type="button" class="button tam-upload-gallery-btn" id="tam-upload-gallery-btn"><?php _e('Add Gallery Images', TAM_TEXT_DOMAIN); ?></button>
        </p>
        <p class="description"><?php _e('Click "Add Gallery Images" to upload or select images for the artist\'s gallery. You can select multiple images at once.', TAM_TEXT_DOMAIN); ?></p>
    </div>
    <?php
}

/**
 * ============================================================================
 * META BOXES REGISTRATION (Admin Side)
 * ============================================================================
 */

/**
 * Add Genres metabox for artists.
 */
function tam_add_genres_meta_box() {
    add_meta_box('tam-genres-box', __('Genres', TAM_TEXT_DOMAIN), 'tam_genres_meta_box_callback', 'artist', 'side', 'default');
}
add_action('add_meta_boxes', 'tam_add_genres_meta_box');

function tam_genres_meta_box_callback($post) {
    wp_nonce_field('tam_save_genres_meta', 'tam_genres_nonce');
    
    $genres = wp_get_object_terms($post->ID, 'genre', array('fields' => 'ids'));
    $all_genres = get_terms(array('taxonomy' => 'genre', 'hide_empty' => false));
    ?>
    <div id="tam-genre-checklist">
        <?php if (!empty($all_genres) && !is_wp_error($all_genres)): ?>
            <?php foreach ($all_genres as $genre): ?>
                <label class="taxonomy-category">
                    <input type="checkbox" value="<?php echo esc_attr($genre->term_id); ?>" <?php checked(in_array($genre->term_id, $genres)); ?> name="tam_genres[]" />
                    <?php echo esc_html($genre->name); ?>
                </label>
            <?php endforeach; ?>
        <?php else: ?>
            <p><?php _e('No genres created yet. Use the Genres panel on the left.', TAM_TEXT_DOMAIN); ?></p>
        <?php endif; ?>
    </div>
    <p class="description"><?php _e('Select genres for this artist.', TAM_TEXT_DOMAIN); ?></p>
    <?php
}

/**
 * ============================================================================
 * META BOX SAVING
 * ============================================================================
 */

/**
 * Save Hero meta data.
 */
function tam_save_hero_meta($post_id) {
    if (!isset($_POST['tam_hero_nonce']) || !wp_verify_nonce($_POST['tam_hero_nonce'], 'tam_save_hero_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['_tam_specialty'])) {
        update_post_meta($post_id, '_tam_specialty', sanitize_text_field($_POST['_tam_specialty']));
    }
    
    if (isset($_POST['_tam_subtitle'])) {
        update_post_meta($post_id, '_tam_subtitle', sanitize_textarea_field($_POST['_tam_subtitle']));
    }
    
    if (isset($_POST['_tam_cta'])) {
        update_post_meta($post_id, '_tam_cta', sanitize_text_field($_POST['_tam_cta']));
    }
    
    if (isset($_POST['_tam_hero_cover_id'])) {
        update_post_meta($post_id, '_tam_hero_cover_id', absint($_POST['_tam_hero_cover_id']));
    }
}
add_action('save_post_artist', 'tam_save_hero_meta');
add_action('save_post', 'tam_save_hero_meta');

/**
 * Save Bio meta data.
 */
function tam_save_bio_meta($post_id) {
    if (!isset($_POST['tam_bio_nonce']) || !wp_verify_nonce($_POST['tam_bio_nonce'], 'tam_save_bio_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['_tam_bio'])) {
        update_post_meta($post_id, '_tam_bio', sanitize_textarea_field($_POST['_tam_bio']));
    }
}
add_action('save_post_artist', 'tam_save_bio_meta');
add_action('save_post', 'tam_save_bio_meta');

/**
 * Save SEO meta data.
 */
function tam_save_seo_meta($post_id) {
    if (!isset($_POST['tam_seo_nonce']) || !wp_verify_nonce($_POST['tam_seo_nonce'], 'tam_save_seo_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['_tam_seo_title'])) {
        update_post_meta($post_id, '_tam_seo_title', sanitize_text_field($_POST['_tam_seo_title']));
    }
    
    if (isset($_POST['_tam_seo_description'])) {
        update_post_meta($post_id, '_tam_seo_description', sanitize_textarea_field($_POST['_tam_seo_description']));
    }
    
    if (isset($_POST['_tam_seo_keywords'])) {
        update_post_meta($post_id, '_tam_seo_keywords', sanitize_text_field($_POST['_tam_seo_keywords']));
    }
    
    if (isset($_POST['_tam_seo_canonical'])) {
        update_post_meta($post_id, '_tam_seo_canonical', esc_url_raw($_POST['_tam_seo_canonical']));
    }
}
add_action('save_post_artist', 'tam_save_seo_meta');
add_action('save_post', 'tam_save_seo_meta');

/**
 * Save Skills meta data.
 */
function tam_save_skills_meta($post_id) {
    if (!isset($_POST['tam_skills_nonce']) || !wp_verify_nonce($_POST['tam_skills_nonce'], 'tam_save_skills_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['_tam_skills_labels'])) {
        update_post_meta($post_id, '_tam_skills_labels', sanitize_text_field($_POST['_tam_skills_labels']));
    }
    
    if (isset($_POST['_tam_skills_data'])) {
        $skills_data = sanitize_textarea_field($_POST['_tam_skills_data']);
        // Validate JSON
        $decoded = json_decode($skills_data, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            update_post_meta($post_id, '_tam_skills_data', $skills_data);
        }
    }
}
add_action('save_post_artist', 'tam_save_skills_meta');
add_action('save_post', 'tam_save_skills_meta');

/**
 * Save Social meta data.
 */
function tam_save_social_meta($post_id) {
    if (!isset($_POST['tam_social_nonce']) || !wp_verify_nonce($_POST['tam_social_nonce'], 'tam_save_social_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['_tam_social'])) {
        update_post_meta($post_id, '_tam_social', sanitize_textarea_field($_POST['_tam_social']));
    }
}
add_action('save_post_artist', 'tam_save_social_meta');
add_action('save_post', 'tam_save_social_meta');

/**
 * Save Awards meta data.
 */
function tam_save_awards_meta($post_id) {
    if (!isset($_POST['tam_awards_nonce']) || !wp_verify_nonce($_POST['tam_awards_nonce'], 'tam_save_awards_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['_tam_awards'])) {
        update_post_meta($post_id, '_tam_awards', sanitize_textarea_field($_POST['_tam_awards']));
    }
}
add_action('save_post_artist', 'tam_save_awards_meta');
add_action('save_post', 'tam_save_awards_meta');

/**
 * Save Gallery meta data.
 */
function tam_save_gallery_meta($post_id) {
    if (!isset($_POST['tam_gallery_nonce']) || !wp_verify_nonce($_POST['tam_gallery_nonce'], 'tam_save_gallery_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['_tam_gallery_ids'])) {
        $ids = array_map('absint', explode(',', sanitize_text_field($_POST['_tam_gallery_ids'])));
        $ids = array_filter($ids);
        update_post_meta($post_id, '_tam_gallery_ids', $ids);
    } else {
        delete_post_meta($post_id, '_tam_gallery_ids');
    }
}
add_action('save_post_artist', 'tam_save_gallery_meta');
add_action('save_post', 'tam_save_gallery_meta');

/**
 * Save Genres taxonomy.
 */
function tam_save_genres_meta($post_id) {
    if (!isset($_POST['tam_genres_nonce']) || !wp_verify_nonce($_POST['tam_genres_nonce'], 'tam_save_genres_meta')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['tam_genres'])) {
        $genre_ids = array_map('intval', $_POST['tam_genres']);
        wp_set_object_terms($post_id, $genre_ids, 'genre');
    } else {
        wp_set_object_terms($post_id, array(), 'genre');
    }
}
add_action('save_post_artist', 'tam_save_genres_meta');
add_action('save_post', 'tam_save_genres_meta');

/**
 * ============================================================================
 * HELPER FUNCTIONS
 * ============================================================================
 */

/**
 * Build artist response array matching artists.json structure exactly.
 *
 * @param int $post_id The post ID of the artist.
 * @return array|false Artist data array or false on failure.
 */
function tam_build_artist_response($post_id) {
    if (!$post_id || !get_post($post_id)) {
        return false;
    }
    
    $artist_name = get_the_title($post_id);
    $slug = get_post_field('post_name', $post_id);
    
    // SEO
    $seo_title = get_post_meta($post_id, '_tam_seo_title', true);
    $seo_description = get_post_meta($post_id, '_tam_seo_description', true);
    $seo_keywords = get_post_meta($post_id, '_tam_seo_keywords', true);
    $seo_canonical = get_post_meta($post_id, '_tam_seo_canonical', true);
    
    if (empty($seo_canonical)) {
        $seo_canonical = home_url('/artist.html?id=' . $slug);
    }
    
    $seo = array(
        'title'       => !empty($seo_title) ? $seo_title : $artist_name,
        'description' => !empty($seo_description) ? $seo_description : '',
        'keywords'    => !empty($seo_keywords) ? $seo_keywords : '',
        'canonical'   => $seo_canonical,
    );
    
    // Hero - Use stored hero_cover_id from media uploader
    $hero_cover_id = get_post_meta($post_id, '_tam_hero_cover_id', true);
    $hero_cover = '';
    if ($hero_cover_id) {
        $featured_img_url = wp_get_attachment_image_src($hero_cover_id, 'full');
        if ($featured_img_url) {
            if (defined('TAM_RELATIVE_PATHS') && TAM_RELATIVE_PATHS) {
                // Convert to relative path for static site compatibility
                $hero_cover = str_replace(home_url(), '', $featured_img_url[0]);
                // Remove leading slash for consistency with artists.json
                $hero_cover = ltrim($hero_cover, '/');
            } else {
                $hero_cover = $featured_img_url[0];
            }
        }
    }
    
    $hero = array(
        'title'       => $artist_name,
        'specialty'   => get_post_meta($post_id, '_tam_specialty', true),
        'subtitle'    => get_post_meta($post_id, '_tam_subtitle', true),
        'cta'         => get_post_meta($post_id, '_tam_cta', true),
        'cover'       => $hero_cover,
    );
    
    // Bio (from dedicated meta box, split into paragraphs)
    $bio_raw = get_post_meta($post_id, '_tam_bio', true);
    $bio = !empty($bio_raw) ? array_filter(array_map('trim', explode("\n\n", $bio_raw))) : array();
    $bio = array_values($bio);
    
    // Genres (from taxonomy)
    $genres_terms = wp_get_object_terms($post_id, 'genre', array('fields' => 'names'));
    $genres = !is_wp_error($genres_terms) ? $genres_terms : array();
    
    // Skills Labels
    $skills_labels_raw = get_post_meta($post_id, '_tam_skills_labels', true);
    $skills_labels = !empty($skills_labels_raw) ? array_filter(array_map('trim', explode(',', $skills_labels_raw))) : array();
    
    // Awards
    $awards_raw = get_post_meta($post_id, '_tam_awards', true);
    $awards = !empty($awards_raw) ? array_filter(array_map('trim', explode("\n", $awards_raw))) : array();
    
    // Social
    $social_raw = get_post_meta($post_id, '_tam_social', true);
    $social = !empty($social_raw) ? array_filter(array_map('trim', explode("\n", $social_raw))) : array();
    
    // Gallery
    $gallery = tam_get_artist_gallery($post_id);
    
    // Build response - EXACTLY matching artists.json structure
    // NOTE: skills_data is intentionally excluded to match artists.json
    $response = array(
        'name'            => $artist_name,
        'slug'            => $slug,
        'seo'             => $seo,
        'hero'            => $hero,
        'bio'             => $bio,
        'genres'          => $genres,
        'skills_labels'   => $skills_labels,
        'awards'          => $awards,
        'social'          => $social,
        'gallery'         => $gallery,
    );
    
    return $response;
}

/**
 * Get artist gallery images.
 *
 * @param int $post_id The post ID of the artist.
 * @return array Gallery items with src and alt.
 */
function tam_get_artist_gallery($post_id) {
    $gallery = array();
    
    // Get stored gallery image IDs
    $gallery_ids = get_post_meta($post_id, '_tam_gallery_ids', true);
    
    if (empty($gallery_ids) || !is_array($gallery_ids)) {
        return $gallery;
    }
    
    foreach ($gallery_ids as $attachment_id) {
        $image_src = wp_get_attachment_image_src($attachment_id, 'full');
        $alt = get_post_meta($attachment_id, '_wp_attachment_image_alt', true);
        
        if ($image_src) {
            $item = array(
                'src' => '',
                'alt' => !empty($alt) ? $alt : get_the_title($attachment_id),
            );
            
            if (defined('TAM_RELATIVE_PATHS') && TAM_RELATIVE_PATHS) {
                // Convert to relative path for static site compatibility
                $item['src'] = str_replace(home_url(), '', $image_src[0]);
                $item['src'] = ltrim($item['src'], '/');
            } else {
                $item['src'] = $image_src[0];
            }
            
            $gallery[] = $item;
        }
    }
    
    // Sort by menu_order if available
    if (empty($gallery)) {
        // Fallback: Get attachments with 'gallery-' prefix in filename
        $attachments = get_posts(array(
            'post_type'      => 'attachment',
            'posts_per_page' => -1,
            'post_status'    => 'inherit',
            'post_parent'    => $post_id,
            'orderby'        => 'menu_order',
            'order'          => 'ASC',
        ));
        
        if (!empty($attachments)) {
            foreach ($attachments as $attachment) {
                // Check if filename contains 'gallery-'
                if (strpos($attachment->post_name, 'gallery-') !== false || strpos($attachment->post_title, 'gallery-') !== false) {
                    $image_src = wp_get_attachment_image_src($attachment->ID, 'full');
                    $alt = get_post_meta($attachment->ID, '_wp_attachment_image_alt', true);
                    
                    if ($image_src) {
                        $item = array(
                            'src' => '',
                            'alt' => !empty($alt) ? $alt : $attachment->post_title,
                        );
                        
                        if (defined('TAM_RELATIVE_PATHS') && TAM_RELATIVE_PATHS) {
                            $item['src'] = str_replace(home_url(), '', $image_src[0]);
                            $item['src'] = ltrim($item['src'], '/');
                        } else {
                            $item['src'] = $image_src[0];
                        }
                        
                        $gallery[] = $item;
                    }
                }
            }
        }
    }
    
    return $gallery;
}

/**
 * Get gallery image count for an artist.
 *
 * @param int $post_id The post ID of the artist.
 * @return int Gallery image count.
 */
function tam_get_gallery_count($post_id) {
    $attachments = get_posts(array(
        'post_type'      => 'attachment',
        'posts_per_page' => -1,
        'post_status'    => 'inherit',
        'post_parent'    => $post_id,
    ));
    
    $count = 0;
    foreach ($attachments as $attachment) {
        if (strpos($attachment->post_name, 'gallery-') !== false || strpos($attachment->post_title, 'gallery-') !== false) {
            $count++;
        }
    }
    
    return $count;
}

/**
 * ============================================================================
 * REST API ENDPOINTS
 * ============================================================================
 */

/**
 * Register REST API routes.
 */
function tam_register_rest_routes() {
    // Endpoint: /wp-json/tam/v1/artists (All artists)
    register_rest_route('tam/v1', '/artists', array(
        'methods'             => 'GET',
        'callback'            => 'tam_get_all_artists',
        'permission_callback' => '__return_true',
    ));
    
    // Endpoint: /wp-json/tam/v1/artists/{slug} (Single artist)
    register_rest_route('tam/v1', '/artists/(?P<slug>[\w-]+)', array(
        'methods'             => 'GET',
        'callback'            => 'tam_get_artist_by_slug',
        'permission_callback' => '__return_true',
        'args'                => array(
            'slug' => array(
                'required' => true,
                'validate_callback' => function($param, $request, $key) {
                    return is_string($param);
                },
            ),
        ),
    ));
}
add_action('rest_api_init', 'tam_register_rest_routes');

/**
 * Add CORS headers to the TAM REST API responses.
 *
 * @param WP_REST_Response $response The response object.
 * @param WP_REST_Request $request The request object.
 * @param string $route The route being dispatched.
 * @return WP_REST_Response Modified response with CORS headers.
 */
function tam_add_cors_headers($response, $request, $route) {
    // Check if this is our TAM API route
    if (strpos($route, 'tam/v1/') === 0) {
        // Allow requests from any origin
        header('Access-Control-Allow-Origin: *');
        // Allow these HTTP methods
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
        // Allow these headers
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
        // Cache preflight results for 1 hour
        header('Access-Control-Max-Age: 3600');
    }
    return $response;
}
add_filter('rest_post_dispatch', 'tam_add_cors_headers', 10, 3);

/**
 * Handle CORS preflight OPTIONS requests.
 */
function tam_handle_cors_preflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS' && isset($_SERVER['REQUEST_URI'])) {
        if (strpos($_SERVER['REQUEST_URI'], '/wp-json/tam/v1/') !== false) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
            header('Access-Control-Max-Age: 3600');
            header('Content-Length: 0');
            header('Content-Type: application/json; charset=utf-8');
            exit(0);
        }
    }
}
add_action('rest_api_init', 'tam_handle_cors_preflight');

/**
 * Get all artists.
 *
 * @param WP_REST_Request $request The REST request.
 * @return WP_REST_Response Response with all artists data.
 */
function tam_get_all_artists($request) {
    $args = array(
        'post_type'      => 'artist',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    );
    
    $artists = get_posts($args);
    $response = array();
    
    foreach ($artists as $artist) {
        $data = tam_build_artist_response($artist->ID);
        if ($data) {
            $response[$artist->post_name] = $data;
        }
    }
    
    return rest_ensure_response($response);
}

/**
 * Get single artist by slug.
 *
 * @param WP_REST_Request $request The REST request.
 * @return WP_REST_Response Response with single artist data.
 */
function tam_get_artist_by_slug($request) {
    $slug = sanitize_text_field($request->get_param('slug'));
    
    $args = array(
        'post_type'      => 'artist',
        'posts_per_page' => 1,
        'name'           => $slug,
        'post_status'    => 'publish',
    );
    
    $artists = get_posts($args);
    
    if (empty($artists)) {
        return rest_ensure_response(new WP_Error('not_found', __('Artist not found.', TAM_TEXT_DOMAIN), array('status' => 404)));
    }
    
    $artist = $artists[0];
    $data = tam_build_artist_response($artist->ID);
    
    if (!$data) {
        return rest_ensure_response(new WP_Error('build_error', __('Failed to build artist data.', TAM_TEXT_DOMAIN), array('status' => 500)));
    }
    
    // Return as single object keyed by slug
    return rest_ensure_response(array($slug => $data));
}

/**
 * ============================================================================
 * FRONTEND ENQUEUE SCRIPTS
 * ============================================================================
 */

/**
 * Enqueue scripts and styles.
 */
function tam_enqueue_scripts() {
    // This can be extended to enqueue frontend assets if needed
}
add_action('wp_enqueue_scripts', 'tam_enqueue_scripts');

/**
 * ============================================================================
 * FLUSH REWRITE RULES ON ACTIVATION
 * ============================================================================
 */

/**
 * Flush rewrite rules on plugin activation.
 */
function tam_flush_rules_on_activation() {
    tam_register_artist_post_type();
    tam_register_genre_taxonomy();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'tam_flush_rules_on_activation');

/**
 * Flush rewrite rules on plugin deactivation.
 */
function tam_flush_rules_on_deactivation() {
    tam_register_artist_post_type();
    tam_register_genre_taxonomy();
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'tam_flush_rules_on_deactivation');

/**
 * ============================================================================
 * PLUGIN SETTINGS PAGE
 * ============================================================================
 */

/**
 * Add settings page to admin menu.
 */
function tam_add_settings_page() {
    add_options_page(
        __('Tattoo Artist Manager Settings', TAM_TEXT_DOMAIN),
        __('Tattoo Artists', TAM_TEXT_DOMAIN),
        'manage_options',
        'tattoo-artist-manager',
        'tam_render_settings_page'
    );
}
add_action('admin_menu', 'tam_add_settings_page');

/**
 * Render settings page.
 */
function tam_render_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <form method="post" action="options.php">
            <?php
            settings_fields('tam_settings_group');
            do_settings_sections('tattoo-artist-manager');
            submit_button();
            ?>
        </form>
        
        <hr />
        
        <h2><?php _e('Plugin Configuration', TAM_TEXT_DOMAIN); ?></h2>
        <table class="form-table">
            <tr>
                <th scope="row"><?php _e('Relative Paths', TAM_TEXT_DOMAIN); ?></th>
                <td>
                    <p><?php _e('When enabled, image URLs will be returned as relative paths (for static site compatibility).', TAM_TEXT_DOMAIN); ?></p>
                    <p><code>define('TAM_RELATIVE_PATHS', true);</code></p>
                    <p><strong><?php _e('Current status:', TAM_TEXT_DOMAIN); ?></strong> <?php echo defined('TAM_RELATIVE_PATHS') && TAM_RELATIVE_PATHS ? __('Enabled', TAM_TEXT_DOMAIN) : __('Disabled', TAM_TEXT_DOMAIN); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('API Endpoints', TAM_TEXT_DOMAIN); ?></th>
                <td>
                    <ul>
                        <li><code>/wp-json/tam/v1/artists</code> - <?php _e('Get all artists', TAM_TEXT_DOMAIN); ?></li>
                        <li><code>/wp-json/tam/v1/artists/{slug}</code> - <?php _e('Get single artist by slug', TAM_TEXT_DOMAIN); ?></li>
                    </ul>
                </td>
            </tr>
        </table>
    </div>
    <?php
}

/**
 * ============================================================================
 * ACTIVATION/DEACTIVATION HOOKS
 * ============================================================================
 */

/**
 * Create custom rewrite endpoints on activation.
 */
function tam_activate() {
    tam_register_artist_post_type();
    tam_register_genre_taxonomy();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'tam_activate');

/**
 * Flush rewrite rules on deactivation.
 */
function tam_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'tam_deactivate');
