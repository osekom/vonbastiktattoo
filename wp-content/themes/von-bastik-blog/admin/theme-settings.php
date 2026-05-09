<?php
/**
 * Theme Settings Page
 * 
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register theme settings menu
 */
function von_bastik_blog_register_settings_menu() {
    add_theme_page(
        __('Theme Settings', 'von-bastik-blog'),
        __('Theme Settings', 'von-bastik-blog'),
        'edit_theme_options',
        'von-bastik-blog-settings',
        'von_bastik_blog_render_settings_page'
    );
}
add_action('admin_menu', 'von_bastik_blog_register_settings_menu');

/**
 * Render settings page
 */
function von_bastik_blog_render_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        
        <div class="von-bastik-settings">
            <h2>Hero Section</h2>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="hero_tagline"><?php _e('Homepage Tagline', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="text" id="hero_tagline" name="hero_tagline" value="<?php echo esc_attr(get_theme_mod('hero_tagline', 'Tattoo Studio')); ?>" class="regular-text">
                        <p class="description"><?php _e('Text displayed in the hero section typewriter effect.', 'von-bastik-blog'); ?></p>
                    </td>
                </tr>
            </table>
            
            <h2>About Section</h2>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="about_title"><?php _e('About Title', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="text" id="about_title" name="about_title" value="<?php echo esc_attr(get_theme_mod('about_title', 'Sobre Nosotros')); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="about_content"><?php _e('About Content', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <textarea id="about_content" name="about_content" rows="5" class="large-text"><?php echo esc_textarea(get_theme_mod('about_content', '')); ?></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="about_image"><?php _e('About Image', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="text" id="about_image" name="about_image" value="<?php echo esc_attr(get_theme_mod('about_image', get_template_directory_uri() . '/assets/images/banner.jpg')); ?>" class="regular-text">
                        <button type="button" class="button von-bastik-upload-btn" data-target="about_image"><?php _e('Upload Image', 'von-bastik-blog'); ?></button>
                    </td>
                </tr>
            </table>
            
            <h2>Statistics</h2>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="stat_studio"><?php _e('Years of Studio', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="number" id="stat_studio" name="stat_studio" value="<?php echo esc_attr(get_theme_mod('stat_studio', '10')); ?>" class="small-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="stat_artists"><?php _e('Number of Artists', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="number" id="stat_artists" name="stat_artists" value="<?php echo esc_attr(get_theme_mod('stat_artists', '3')); ?>" class="small-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="stat_clients"><?php _e('Number of Clients', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="number" id="stat_clients" name="stat_clients" value="<?php echo esc_attr(get_theme_mod('stat_clients', '5000')); ?>" class="small-text">
                    </td>
                </tr>
            </table>
            
            <h2>Contact Information</h2>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="contact_address"><?php _e('Address', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <textarea id="contact_address" name="contact_address" rows="3" class="large-text"><?php echo esc_textarea(get_theme_mod('contact_address', 'Calle Victoria, 1, local B\nAlcalá de Henares, Madrid')); ?></textarea>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="contact_phone"><?php _e('Phone', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="text" id="contact_phone" name="contact_phone" value="<?php echo esc_attr(get_theme_mod('contact_phone', '+34 653 053 913')); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="contact_email"><?php _e('Email', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="email" id="contact_email" name="contact_email" value="<?php echo esc_attr(get_theme_mod('contact_email', 'vonbastiktattoo@gmail.com')); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="whatsapp_number"><?php _e('WhatsApp Number', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="text" id="whatsapp_number" name="whatsapp_number" value="<?php echo esc_attr(get_theme_mod('whatsapp_number', '34653053913')); ?>" class="regular-text">
                        <p class="description"><?php _e('Include country code, no spaces or dashes.', 'von-bastik-blog'); ?></p>
                    </td>
                </tr>
            </table>
            
            <h2>Social Links</h2>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="social_instagram"><?php _e('Instagram', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="url" id="social_instagram" name="social_instagram" value="<?php echo esc_attr(get_theme_mod('social_instagram', 'https://www.instagram.com/vonbastiktattoo/')); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="social_facebook"><?php _e('Facebook', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="url" id="social_facebook" name="social_facebook" value="<?php echo esc_attr(get_theme_mod('social_facebook', 'https://www.facebook.com/vonbastiktattoo/')); ?>" class="regular-text">
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="social_tiktok"><?php _e('TikTok', 'von-bastik-blog'); ?></label></th>
                    <td>
                        <input type="url" id="social_tiktok" name="social_tiktok" value="<?php echo esc_attr(get_theme_mod('social_tiktok', 'https://tiktok.com/@vonbastik')); ?>" class="regular-text">
                    </td>
                </tr>
            </table>
            
            <p class="submit">
                <input type="submit" name="submit" id="submit" class="button button-primary" value="<?php esc_attr_e('Save Changes', 'von-bastik-blog'); ?>">
            </p>
        </div>
    </div>
    
    <script type="text/javascript">
    jQuery(document).ready(function($) {
        $('.von-bastik-upload-btn').on('click', function(e) {
            e.preventDefault();
            var target = $(this).data('target');
            var custom_uploader = wp.media({
                title: 'Choose Image',
                button: { text: 'Use this image' },
                multiple: false
            });
            
            custom_uploader.on('select', function() {
                var attachment = custom_uploader.state().get('selection').first().toJSON();
                $('input[name="' + target + '"]').val(attachment.url);
            });
            
            custom_uploader.open();
        });
    });
    </script>
    
    <style>
    .von-bastik-settings {
        max-width: 800px;
    }
    .von-bastik-settings h2 {
        margin-top: 2em;
        padding-bottom: 0.5em;
        border-bottom: 1px solid #ccc;
    }
    .von-bastik-settings h2:first-child {
        margin-top: 0;
    }
    </style>
    <?php
}

/**
 * Save theme settings
 */
function von_bastik_blog_save_settings() {
    $settings = array(
        'hero_tagline',
        'about_title',
        'about_content',
        'about_image',
        'stat_studio',
        'stat_artists',
        'stat_clients',
        'contact_address',
        'contact_phone',
        'contact_email',
        'whatsapp_number',
        'social_instagram',
        'social_facebook',
        'social_tiktok',
    );
    
    foreach ($settings as $setting) {
        if (isset($_POST[$setting])) {
            update_theme_mod($setting, sanitize_text_field($_POST[$setting]));
        }
    }
}
add_action('admin_post_save_von_bastik_settings', 'von_bastik_blog_save_settings');
