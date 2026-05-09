<?php
/**
 * Template part for displaying no results messages
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="no-results">
    <h2><?php _e('Nothing Found', 'von-bastik-blog'); ?></h2>
    <p>
        <?php
        if (is_home() && current_user_can('publish_posts')) :
            printf(
                __('Your site is set to show the latest posts. Create some posts and they will show up here.', 'von-bastik-blog'),
                esc_url(admin_url('edit.php'))
            );
        else :
            _e('Sorry, but nothing matched your search criteria. Please try again.', 'von-bastik-blog');
        endif;
        ?>
    </p>
    <?php get_search_form(); ?>
</div>
