<?php
/**
 * Hero Section Template
 * 
 * @package Von_Bastik_Blog
 */

// Get hero images from theme mods or use defaults
$hero_images = von_bastik_blog_get_hero_images();
$typewriter_phrases = von_bastik_blog_get_typewriter_phrases();
?>

<section class="hero-section" id="inicio" aria-label="Bienvenida">
    <div class="hero-slides">
        <?php foreach ($hero_images as $index => $image): ?>
        <div class="hero-slide <?php echo ($index === 0) ? 'active' : ''; ?>" style="background-image: url('<?php echo esc_url($image); ?>')">
        </div>
        <?php endforeach; ?>
    </div>
    
    <div class="hero-content">
        <h1 class="hero-title">
            <span class="typewriter-text" id="typewriter"></span><span class="cursor">|</span>
        </h1>
        <p class="hero-subtitle">Arte que se queda en la piel</p>
        <div class="hero-cta">
            <a href="#artistas" class="btn-primary">Conoce a nuestros artistas</a>
            <a href="#contacto" class="btn-secondary">Agenda tu cita</a>
        </div>
    </div>
    
    <div class="hero-dots" aria-label="Control de slideshow">
        <?php foreach ($hero_images as $index => $image): ?>
        <button class="hero-dot <?php echo ($index === 0) ? 'active' : ''; ?>" data-slide="<?php echo $index; ?>" aria-label="Slide <?php echo $index + 1; ?>"></button>
        <?php endforeach; ?>
    </div>
</section>
