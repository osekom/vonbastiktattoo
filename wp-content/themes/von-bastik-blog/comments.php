<?php
/**
 * The template for displaying comments
 *
 * @package Von_Bastik_Blog
 */

if (!defined('ABSPATH')) {
    exit;
}

if (post_password_required()) {
    return;
}
?>

<section class="comments-section" id="comments">
    <h3>
        <?php
        $comment_count = get_comments_number();
        if ($comment_count === 1) :
            printf(__('One Comment', 'von-bastik-blog'));
        elseif ($comment_count > 1) :
            printf(__('%s Comments', 'von-bastik-blog'), number_format_i18n($comment_count));
        else :
            _e('No Comments Yet', 'von-bastik-blog');
        endif;
        ?>
    </h3>
    
    <?php if (have_comments()) : ?>
        <ul class="comment-list">
            <?php
            wp_list_comments(array(
                'style'      => 'ul',
                'short_ping' => true,
                'callback'   => 'von_bastik_blog_comment',
            ));
            ?>
        </ul>
        
        <?php
        // Pagination for comments
        if (get_comment_pages_count() > 1 && get_option('page_comments')) :
            ?>
            <nav class="comment-navigation" id="comment-nav-bottom">
                <div class="comment-nav-prev">
                    <?php
                    previous_comments_link(__('← Older Comments', 'von-bastik-blog'));
                    ?>
                </div>
                <div class="comment-nav-next">
                    <?php
                    next_comments_link(__('Newer Comments →', 'von-bastik-blog'));
                    ?>
                </div>
            </nav>
        <?php endif; ?>
        
    <?php endif; ?>
    
    <?php
    if (!comments_open()) :
        ?>
        <p class="no-comments"><?php _e('Comments are closed.', 'von-bastik-blog'); ?></p>
    <?php endif; ?>
    
    <?php
    comment_form(array(
        'title_reply'        => __('Leave a Comment', 'von-bastik-blog'),
        'title_reply_to'     => __('Reply to %s', 'von-bastik-blog'),
        'cancel_reply_link'  => __('Cancel Reply', 'von-bastik-blog'),
        'label_submit'       => __('Post Comment', 'von-bastik-blog'),
        'class_submit'       => 'btn-submit',
        'name_submit'        => 'submit',
    ));
    ?>
</section>
