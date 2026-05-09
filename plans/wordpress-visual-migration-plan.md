# WordPress Visual Migration Plan

## Overview

This plan details the migration of the Von Bastik static site visual design into the WordPress theme. The goal is to replicate the exact look and feel of the static site (index.html, artist-selene.html, artist-inkbo.html, artist-bigtorres.html) within WordPress.

## Current State Analysis

### Static Site Features
- **Dark theme** with `#0a0a0a` background and `#c9a96e` gold accent
- **Hero slideshow** with 4 background images, Ken Burns effect, typewriter text
- **Marquee** scrolling styles (Realismo, Blackwork, Fine Line, etc.)
- **About section** with parallax image, stat counters (5000+ tattoos, 12 years, 100% artisan)
- **Services section** (6 cards: Tatuajes, Diseños Personalizados, Piercing, Joyería, Láser, Venta de Arte)
- **Artists section** (3 cards: Selene, Inkbo, Big Torres)
- **Gallery section** with tabs (Tatuajes/Piercing), lightbox
- **Testimonials section** (Google reviews style)
- **Contact section** with form + info
- **Artist detail pages** with hero, bio, skills chart, gallery
- **Footer** with 3 columns (Brand, Links, Legal)
- **WhatsApp floating button**
- **Scroll progress bar**
- **Animations**: scroll reveal, parallax, counters, typewriter

### Current WordPress Theme State
- Basic blog theme structure
- Simple header with logo + navigation
- Simple footer with widget areas
- Front page shows latest 6 blog posts
- Minimal JavaScript (mobile menu, scroll animations)
- Missing: all visual sections, custom post types, full styling

---

## Architecture Diagram

```mermaid
graph TB
    subgraph WordPress Theme
        functions.php[functions.php - Setup + CPTs]
        style.css[style.css - Full Styling]
        header.php[header.php - Navigation]
        footer.php[footer.php - Footer]
        front-page.php[front-page.php - Homepage]
        single-artist.php[single-artist.php - Artist Pages]
        page.php[page.php - Static Pages]
    end

    subgraph Templates
        templates/hero-section.php[hero-section.php]
        templates/about-section.php[about-section.php]
        templates/services-section.php[services-section.php]
        templates/artists-section.php[artists-section.php]
        templates/gallery-section.php[gallery-section.php]
        templates/testimonials-section.php[testimonials-section.php]
        templates/contact-section.php[contact-section.php]
    end

    subgraph Assets
        assets/css/admin.css[admin.css]
        assets/js/app.js[app.js - Full JS]
        assets/images/[images/]
    end

    subgraph Custom Post Types
        artists[CPT: Artists]
        gallery[CPT: Gallery]
        testimonials[CPT: Testimonials]
    end

    functions.php --> styles.css
    functions.php --> artists
    functions.php --> gallery
    functions.php --> testimonials
    front-page.php --> templates/hero-section.php
    front-page.php --> templates/about-section.php
    front-page.php --> templates/services-section.php
    front-page.php --> templates/artists-section.php
    front-page.php --> templates/gallery-section.php
    front-page.php --> templates/testimonials-section.php
    front-page.php --> templates/contact-section.php
```

---

## Phase 1: Theme Structure Setup

### 1.1 Update style.css
- Add proper WordPress theme header
- Include all CSS from static site `css/style.css`
- Add WordPress-specific overrides
- File: `wp-content/themes/von-bastik-blog/style.css`

### 1.2 Update functions.php
Add the following functionality:
- Register navigation menus (primary, footer)
- Register custom post types:
  - **Artists** (selene, inkbo, bigtorres)
  - **Gallery** (individual gallery items)
  - **Testimonials** (Google reviews)
- Register custom taxonomies:
  - Artist styles (Realismo, Blackwork, Fine Line, etc.)
  - Gallery categories (Tatuajes, Piercing)
- Add image sizes matching static site
- Enqueue scripts/styles properly

### 1.3 Create Template Directory Structure
```
wp-content/themes/von-bastik-blog/
├── style.css
├── functions.php
├── header.php
├── footer.php
├── front-page.php
├── single-artist.php
├── archive-artist.php
├── page.php
├── index.php
├── 404.php
├── search.php
├── sidebar.php
├── comments.php
├── templates/
│   ├── hero-section.php
│   ├── marquee-section.php
│   ├── about-section.php
│   ├── services-section.php
│   ├── artists-section.php
│   ├── gallery-section.php
│   ├── testimonials-section.php
│   ├── contact-section.php
│   └── content-excerpt.php
├── assets/
│   ├── css/
│   │   └── admin.css
│   ├── js/
│   │   └── app.js
│   └── images/
│       ├── logo.png
│       └── banner.jpg
└── inc/
    ├── enqueue.php
    └── setup.php
```

---

## Phase 2: Header and Footer Replication

### 2.1 header.php
Replicate the static site header exactly:
- Scroll progress bar (`#scrollProgress`)
- Fixed navigation with logo
- Desktop menu links (Inicio, Nosotros, Servicios, Artistas, Galeria, Contacto)
- Mobile hamburger menu
- Skip navigation link
- Proper ARIA attributes

**Key CSS classes to implement:**
- `.scroll-progress`
- `.nav-link` with underline animation
- `.nav-scrolled` background effect
- `.mobile-menu` full-screen overlay
- `.hamburger` animated bars

### 2.2 footer.php
Replicate the static site footer:
- 3-column grid (Brand, Links, Legal)
- Social media icons (Instagram, TikTok, YouTube)
- Copyright line
- WhatsApp floating button

---

## Phase 3: Custom Post Types

### 3.1 Artists CPT
```php
register_post_type('artist', [
    'labels' => ['name' => 'Artistas', 'singular_name' => 'Artista'],
    'public' => true,
    'has_archive' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
    'rewrite' => ['slug' => 'artistas'],
]);
```

**Custom Fields for each artist:**
- `artist_specialty` (e.g., "Realismo y Retratos")
- `artist_city` (e.g., "Bilbao")
- `artist_hero_image` (featured image)
- `artist_bio` (detailed biography)
- `artist_instagram` (social link)
- `artist_tiktok` (social link)
- `artist_youtube` (social link)
- `artist_skills` (array of skill levels)

**Pre-populated Artists:**
1. **Selene** - Realismo y Retratos
2. **Inkbo** - Blackwork y Geometría Sagrada
3. **Big Torres** - Fine Line y Acuarela

### 3.2 Gallery CPT
```php
register_post_type('gallery_item', [
    'labels' => ['name' => 'Galería', 'singular_name' => 'Trabajo'],
    'public' => true,
    'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
    'rewrite' => ['slug' => 'trabajos'],
]);
```

**Custom Fields:**
- `gallery_artist` (relationship to artist)
- `gallery_category` (Tatuajes / Piercing)
- `gallery_style` (Realismo, Blackwork, Fine Line, etc.)

### 3.3 Testimonials CPT
```php
register_post_type('testimonial', [
    'labels' => ['name' => 'Testimonios', 'singular_name' => 'Testimonio'],
    'public' => true,
    'supports' => ['title', 'editor', 'custom-fields'],
]);
```

**Custom Fields:**
- `testimonial_author` (name)
- `testimonial_rating` (1-5)
- `testimonial_date` (review date)
- `testimonial_source` (Google)

---

## Phase 4: Homepage Sections

### 4.1 Hero Section (`templates/hero-section.php`)
**Static site features:**
- 4-slide slideshow with background images
- Ken Burns zoom effect on active slide
- Title: "Arte que Permanece en tu Piel"
- Typewriter effect for subtitle
- Gold line separator
- Two CTA buttons (Reservar Cita, Conoce a los Artistas)
- Dot navigation
- Scroll indicator (mouse icon)

**WordPress implementation:**
- Use ACF or custom fields for:
  - Hero images array
  - Hero title
  - Typewriter texts array
  - CTA button text and links
- JavaScript for slideshow, typewriter, dots

### 4.2 Marquee Section (`templates/marquee-section.php`)
- Infinite scrolling text animation
- Styles: Realismo, Blackwork, Fine Line, Geometría Sagrada, Retratos, Acuarela
- Configurable via custom fields

### 4.3 About Section (`templates/about-section.php`)
**Features:**
- Parallax image with gold border accent
- "Sobre el Estudio" label
- Section title
- Two paragraphs of text
- Stats with animated counters (5000+, 12, 100%)

**Custom Fields:**
- `about_image`
- `about_title`
- `about_paragraph_1`
- `about_paragraph_2`
- `stats` (array of count, label)

### 4.4 Services Section (`templates/services-section.php`)
**6 service cards:**
1. Tatuajes
2. Diseños Personalizados
3. Piercing
4. Joyería Especializada
5. Eliminación de Tatuaje con Láser
6. Venta de Arte

**Each card has:**
- Image
- Icon (Font Awesome)
- Title
- Description

**Implementation:**
- Repeater field for services
- Each service: image, icon, title, description

### 4.5 Artists Section (`templates/artists-section.php`)
- Query Artists CPT
- Display 3 artist cards
- Each card: image, name, specialty, description
- Links to artist single page and booking

### 4.6 Gallery Section (`templates/gallery-section.php`)
**Features:**
- Tabs: Tatuajes / Piercing
- Grid layout (auto-fit, minmax 300px)
- Hover overlay with title and style
- Lightbox functionality
- Link to Instagram

**Implementation:**
- Query Gallery CPT by category
- Tab switching JavaScript
- Lightbox JavaScript

### 4.7 Testimonials Section (`templates/testimonials-section.php`)
**Features:**
- Google rating display (4.9 stars, 427 reviews)
- 3 testimonial cards
- Each: author initial, name, date, rating, review text, Google icon
- Link to Google reviews

**Implementation:**
- Query Testimonials CPT
- Display with Google-style cards

### 4.8 Contact Section (`templates/contact-section.php`)
**Features:**
- Contact form (name, email, phone, style selector, message)
- Contact information (email, phone/WhatsApp, address, hours)
- Social media links

**Implementation:**
- WordPress contact form (use Contact Form 7 or custom form handler)
- Custom fields for contact info
- WhatsApp integration

---

## Phase 5: Artist Single Pages

### 5.1 single-artist.php
**Layout:**
1. **Artist Hero** - Full-width background image with overlay
   - Artist name as title
   - Specialty subtitle
   - Description
   - CTA button (Reservar Cita)

2. **Biography Section** - Text content
   - "Sobre el Artista" label
   - Full biography from editor

3. **Skills Chart** - Radar chart (Chart.js)
   - Display artist's skill levels

4. **Gallery Section** - Artist's work
   - Query gallery items by artist
   - Grid with lightbox

### 5.2 archive-artist.php
- Grid of all artists
- Same layout as artists section on homepage

---

## Phase 6: JavaScript Migration

### 6.1 Update assets/js/app.js
Migrate all JavaScript from static site `js/app.js`:

**Functions to implement:**
1. `initNavbar()` - Scroll state for navbar
2. `initMobileMenu()` - Hamburger menu toggle
3. `initScrollReveal()` - Intersection Observer animations
4. `initStatCounters()` - Animated number counters
5. `initGalleryFilter()` - Category filtering
6. `initGalleryLazyLoad()` - Load more functionality
7. `initLightbox()` - Image lightbox
8. `initTabs()` - Gallery tab switching
9. `initContactForm()` - Form handling with toast
10. `initSmoothScroll()` - Anchor smooth scroll
11. `initHeroSlideshow()` - Background slideshow
12. `initTypewriter()` - Text typing effect
13. `initParallax()` - Parallax scrolling
14. `initScrollProgress()` - Top progress bar

**WordPress considerations:**
- Use `wp_enqueue_script` with dependencies
- Localize script for AJAX URLs
- Ensure no conflicts with WordPress jQuery

---

## Phase 7: Image Assets Migration

### 7.1 Required Images
Copy from static site to WordPress theme:

**Theme assets:**
- `assets/images/logo.png`
- `assets/images/banner.jpg`

**Service images:**
- `assets/images/service-tatuajes.jpg`
- `assets/images/service-disenos.jpg`
- `assets/images/service-piercing.jpg`
- `assets/images/service-joyeria.jpg`
- `assets/images/service-laser.jpg`
- `assets/images/service-arte.jpg`

**Artist images (via Media Library):**
- Selene: hero + 115 gallery images
- Inkbo: hero + 10 gallery images
- BigTorres: hero + 14 gallery images

### 7.2 Migration Approach
1. Create media library structure
2. Upload all images via WP CLI or admin
3. Set featured images for artists
4. Configure gallery items with images

---

## Implementation Details

### CSS Architecture
The `style.css` will contain:
1. WordPress theme header
2. All static site CSS (from `css/style.css`)
3. WordPress-specific overrides
4. Template-specific styles

### PHP Template Structure
Each section template will:
1. Query data from CPTs or custom fields
2. Use WordPress functions for dynamic content
3. Maintain the same HTML structure as static site
4. Include proper ARIA attributes

### Custom Fields Strategy
Use one of:
- **ACF (Advanced Custom Fields)** - Recommended for ease of use
- **Native WordPress custom fields** - No additional plugin
- **Theme options page** - Built-in custom admin section

---

## File Changes Summary

### Files to Modify:
1. `style.css` - Complete rewrite with static site CSS
2. `functions.php` - Add CPTs, taxonomies, setup
3. `header.php` - Replicate static header
4. `footer.php` - Replicate static footer
5. `front-page.php` - Homepage with all sections
6. `assets/js/app.js` - Full JavaScript migration

### Files to Create:
1. `single-artist.php` - Artist detail pages
2. `archive-artist.php` - Artists listing
3. `templates/hero-section.php`
4. `templates/marquee-section.php`
5. `templates/about-section.php`
6. `templates/services-section.php`
7. `templates/artists-section.php`
8. `templates/gallery-section.php`
9. `templates/testimonials-section.php`
10. `templates/contact-section.php`

---

## Testing Checklist

- [ ] Homepage loads with all sections
- [ ] Hero slideshow works (auto-play, dots, Ken Burns)
- [ ] Typewriter effect works
- [ ] Marquee scrolls smoothly
- [ ] Stat counters animate on scroll
- [ ] Service cards hover effects
- [ ] Artist cards hover effects
- [ ] Gallery tabs switch correctly
- [ ] Gallery lightbox works
- [ ] Contact form submits
- [ ] Mobile menu works
- [ ] Scroll reveal animations work
- [ ] Scroll progress bar works
- [ ] Artist single pages display correctly
- [ ] Artist gallery shows correct items
- [ ] WhatsApp floating button works
- [ ] Footer links work
- [ ] All responsive breakpoints tested
- [ ] Performance optimized (lazy loading, etc.)

---

## Next Steps

1. **Approve this plan** - Confirm the approach is correct
2. **Switch to Code mode** - Begin implementation
3. **Phase-by-phase implementation** - Each phase tested before moving to next
4. **Final review** - Compare WordPress site with static site side by side
