<?php
/**
 * Contact Section Template
 * 
 * @package Von_Bastik_Blog
 */

$contact_title = get_theme_mod('contact_title', 'Contacta con nosotros');
$contact_subtitle = get_theme_mod('contact_subtitle', '¿Listo para tu próximo tatuaje? Escríbenos');

$contact_info = von_bastik_blog_get_contact_info();
$social_links = von_bastik_blog_get_social_links();
?>

<section class="py-24 px-6 bg-[#0d0d0d]" id="contacto" aria-labelledby="contact-title">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 reveal">
            <h2 id="contact-title" class="section-title"><?php echo esc_html($contact_title); ?></h2>
            <p class="section-subtitle"><?php echo esc_html($contact_subtitle); ?></p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-16">
            <div class="reveal">
                <form id="contactForm" aria-label="Formulario de contacto">
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label for="contact-name" class="form-label">Nombre</label>
                            <input type="text" id="contact-name" name="name" class="form-input" placeholder="Tu nombre" required>
                        </div>
                        <div>
                            <label for="contact-email" class="form-label">Email</label>
                            <input type="email" id="contact-email" name="email" class="form-input" placeholder="tu@email.com" required>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label for="contact-phone" class="form-label">Teléfono</label>
                            <input type="tel" id="contact-phone" name="phone" class="form-input" placeholder="+34 600 000 000">
                        </div>
                        <div>
                            <label for="contact-style" class="form-label">Estilo de tatuaje</label>
                            <select id="contact-style" name="style" class="form-input">
                                <option value="">Selecciona un estilo</option>
                                <option value="realismo">Realismo</option>
                                <option value="fine-line">Fine Line</option>
                                <option value="acuarela">Acuarela</option>
                                <option value="blackwork">Blackwork</option>
                                <option value="tradecional">Tradicional</option>
                                <option value="japonés">Japonés</option>
                                <option value="lettering">Lettering</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label for="contact-message" class="form-label">Mensaje</label>
                        <textarea id="contact-message" name="message" class="form-input" rows="5" placeholder="Cuéntanos tu idea..." required></textarea>
                    </div>
                    <button type="submit" class="btn-primary w-full">Enviar mensaje</button>
                </form>
            </div>
            
            <div class="reveal">
                <div class="mb-10">
                    <h3 class="section-title mb-6">Información de contacto</h3>
                    <div class="space-y-6">
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-[#c9a96e] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold mb-1">Dirección</h4>
                                <p class="text-[#ccc]"><?php echo nl2br(esc_html($contact_info['address'])); ?></p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-[#c9a96e] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold mb-1">Teléfono</h4>
                                <p class="text-[#ccc]"><a href="tel:<?php echo esc_attr($contact_info['phone']); ?>"><?php echo esc_html($contact_info['phone']); ?></a></p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-[#c9a96e] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold mb-1">Email</h4>
                                <p class="text-[#ccc]"><a href="mailto:<?php echo esc_attr($contact_info['email']); ?>"><?php echo esc_html($contact_info['email']); ?></a></p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4">
                            <svg class="w-6 h-6 text-[#c9a96e] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold mb-1">Horario</h4>
                                <div class="text-[#ccc]">
                                    <p>Lunes - Viernes: <?php echo esc_html($contact_info['hours']); ?></p>
                                    <p>Sábado: <?php echo esc_html($contact_info['saturday']); ?></p>
                                    <p>Domingo: Cerrado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 class="section-title mb-6">Síguenos</h3>
                    <div class="flex gap-3">
                        <?php if (!empty($social_links['instagram'])): ?>
                        <a href="<?php echo esc_url($social_links['instagram']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </a>
                        <?php endif; ?>
                        <?php if (!empty($social_links['facebook'])): ?>
                        <a href="<?php echo esc_url($social_links['facebook']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                            </svg>
                        </a>
                        <?php endif; ?>
                        <?php if (!empty($social_links['tiktok'])): ?>
                        <a href="<?php echo esc_url($social_links['tiktok']); ?>" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="TikTok">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/>
                            </svg>
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
