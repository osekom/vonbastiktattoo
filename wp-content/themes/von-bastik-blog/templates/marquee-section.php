<?php
/**
 * Marquee Section Template
 * 
 * @package Von_Bastik_Blog
 */

// Get marquee text from theme mods or use defaults
$marquee_text_1 = get_theme_mod('marquee_text_1', 'VON BASTIK TATTOO');
$marquee_text_2 = get_theme_mod('marquee_text_2', 'STUDIO');
$marquee_text_3 = get_theme_mod('marquee_text_3', 'TATTOO');
$marquee_text_4 = get_theme_mod('marquee_text_4', 'PIERCING');
$marquee_text_5 = get_theme_mod('marquee_text_5', 'TATTOO');
$marquee_text_6 = get_theme_mod('marquee_text_6', 'STUDIO');
?>

<section class="py-6 inkborder-t inkborder-b inkborder-[#1a1a1a]" aria-hidden="true">
    <div class="marquee">
        <div class="marquee-content">
            <span class="marquee-item"><?php echo esc_html($marquee_text_1); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_2); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_3); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_4); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_5); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_6); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_1); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_2); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_3); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_4); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_5); ?></span>
            <span class="marquee-item">✦</span>
            <span class="marquee-item"><?php echo esc_html($marquee_text_6); ?></span>
            <span class="marquee-item">✦</span>
        </div>
    </div>
</section>
