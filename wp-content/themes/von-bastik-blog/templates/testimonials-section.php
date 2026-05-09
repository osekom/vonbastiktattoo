<?php
/**
 * Testimonials Section Template
 * 
 * @package Von_Bastik_Blog
 */

$testimonials_title = get_theme_mod('testimonials_title', 'Lo que dicen nuestros clientes');
$testimonials_subtitle = get_theme_mod('testimonials_subtitle', 'Experiencias reales de clientes satisfechos');

// Get testimonials
$testimonials_query = new WP_Query(array(
    'post_type' => 'testimonial',
    'posts_per_page' => 3,
    'orderby' => 'date',
    'order' => 'DESC',
));

// Default testimonials if none exist
$default_testimonials = array(
    array(
        'name' => 'María García',
        'rating' => 5,
        'text' => 'Una experiencia increíble. El equipo es muy profesional y el resultado superó mis expectativas. El estudio es impecable y tienen un ambiente muy acogedor.',
    ),
    array(
        'name' => 'Carlos Rodríguez',
        'rating' => 5,
        'text' => 'Mi tatuaje quedó perfecto. Selene entendió exactamente lo que quería y lo llevó a cabo con una precisión impresionante. Sin duda volveré.',
    ),
    array(
        'name' => 'Ana Martínez',
        'rating' => 5,
        'text' => 'El mejor estudio de tatuajes de la ciudad. El trato es excelente, cumplen con todas las normas de higiene y el arte es de primer nivel.',
    ),
);
?>

<section class="py-24 px-6" id="resenas" aria-labelledby="reviews-title">
    <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12 reveal">
            <h2 id="reviews-title" class="section-title"><?php echo esc_html($testimonials_title); ?></h2>
            <p class="section-subtitle"><?php echo esc_html($testimonials_subtitle); ?></p>
            <div class="flex items-center justify-center gap-3 mt-6">
                <div class="flex items-center gap-1">
                    <svg class="w-5 h-5 text-[#c9a96e]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg class="w-5 h-5 text-[#c9a96e]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg class="w-5 h-5 text-[#c9a96e]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg class="w-5 h-5 text-[#c9a96e]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <svg class="w-5 h-5 text-[#c9a96e]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                </div>
                <span class="text-[#c9a96e] font-semibold">5.0</span>
                <span class="text-[#888]">(Google Reviews)</span>
            </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6 reveal">
            <?php if ($testimonials_query->have_posts()): ?>
                <?php while ($testimonials_query->have_posts()): $testimonials_query->the_post(); ?>
                <div class="bg-[#111] inkborder inkborder-[#1a1a1a] rounded-xl p-6 hover:inkborder-[#c9a96e]/30 transition-all">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 rounded-full bg-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] font-bold">
                            <?php echo esc_html(substr(get_the_title(), 0, 1)); ?>
                        </div>
                        <div>
                            <h4 class="font-semibold"><?php the_title(); ?></h4>
                            <span class="text-sm text-[#888]"><?php echo esc_html(get_the_date()); ?></span>
                        </div>
                    </div>
                    <div class="flex gap-1 mb-3">
                        <?php for ($i = 0; $i < 5; $i++): ?>
                        <svg class="w-4 h-4 text-[#c9a96e]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <?php endfor; ?>
                    </div>
                    <p class="text-[#ccc]"><?php the_excerpt(); ?></p>
                </div>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>
            <?php else: ?>
                <?php foreach ($default_testimonials as $index => $testimonial): ?>
                <div class="bg-[#111] inkborder inkborder-[#1a1a1a] rounded-xl p-6 hover:inkborder-[#c9a96e]/30 transition-all">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 rounded-full bg-[#c9a96e]/20 flex items-center justify-center text-[#c9a96e] font-bold">
                            <?php echo esc_html(substr($testimonial['name'], 0, 1)); ?>
                        </div>
                        <div>
                            <h4 class="font-semibold"><?php echo esc_html($testimonial['name']); ?></h4>
                            <span class="text-sm text-[#888]">Cliente verificado</span>
                        </div>
                    </div>
                    <div class="flex gap-1 mb-3">
                        <?php for ($i = 0; $i < $testimonial['rating']; $i++): ?>
                        <svg class="w-4 h-4 text-[#c9a96e]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <?php endfor; ?>
                    </div>
                    <p class="text-[#ccc]"><?php echo esc_html($testimonial['text']); ?></p>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        
        <div class="text-center mt-10 reveal">
            <a href="https://g.page/review" target="_blank" rel="noopener noreferrer" class="btn-primary">
                Ver más en Google Reviews
                <svg class="w-4 h-4 inline-block ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
            </a>
        </div>
    </div>
</section>
