# Von Bastik Tattoo WordPress Theme - Installation Guide

## Overview

This theme transforms your WordPress installation into a faithful replica of the static Von Bastik Tattoo Studio website. It includes custom post types for artists and gallery items, a dynamic homepage with all sections from the static site, and full JavaScript functionality.

## Installation Steps

### 1. Theme Installation

The theme is already installed in `wp-content/themes/von-bastik-blog/`. Activate it from:
- WordPress Admin → Appearance → Themes → Activate Von Bastik Blog

### 2. Menu Configuration

After activating the theme, configure the navigation menu:

1. Go to **Appearance → Menus**
2. Create a new menu or edit the existing one
3. Add the following pages/links:
   - Home (link to `/#inicio`)
   - About Us (link to `/#nosotros`)
   - Services (link to `/#servicios`)
   - Artists (link to `/#artistas`)
   - Gallery (link to `/#galeria`)
   - Reviews (link to `/#resenas`)
   - Contact (link to `/#contacto`)
   - Blog (link to `/blog`)
4. Assign the menu to the **Primary Menu** location
5. Save the menu

**Note:** The homepage uses anchor links to jump to sections on the same page. Create a single page called "Home" and set it as the front page.

### 3. Set Front Page

1. Go to **Settings → Reading**
2. Set "Your homepage displays" to **A static page**
3. Select your "Home" page as the **Front page**
4. Select your "Blog" page as the **Posts page** (optional)

### 4. Configure Theme Settings

1. Go to **Appearance → Theme Settings**
2. Fill in the following sections:
   - **Hero Section**: Homepage tagline
   - **About Section**: Title, content, and image
   - **Statistics**: Years, artists count, clients count
   - **Contact Information**: Address, phone, email, WhatsApp
   - **Social Links**: Instagram, Facebook, TikTok URLs
3. Click **Save Changes**

### 5. Add Artists

1. Go to **Artists → Add New**
2. Enter the artist name (e.g., "Big Torres")
3. Add a short description (will appear as specialty)
4. Upload a featured image (hero image for artist page)
5. Add detailed biography in the content editor
6. Save the artist
7. Repeat for all artists (Selene, Inkbo, etc.)

**Custom Fields** (optional):
- `artist_gallery_images`: Comma-separated URLs of gallery images

### 6. Add Gallery Items

1. Go to **Gallery → Add New**
2. Enter the artwork title
3. Upload the image as featured image
4. Add artist name as excerpt
5. Assign gallery category (Tatuajes or Piercing)
6. Save the gallery item

### 7. Add Testimonials

1. Go to **Testimonials → Add New**
2. Enter client name as title
3. Add testimonial text in the content editor
4. Save the testimonial

### 8. Configure Customizer

Go to **Appearance → Customize** to configure:
- Marquee text (6 text slots)
- Section titles and subtitles
- Contact information
- Social links
- Statistics

## File Structure

```
wp-content/themes/von-bastik-blog/
├── style.css                    # Main stylesheet (3187+ lines)
├── functions.php                # Theme functions and CPT registration
├── header.php                   # Site header with navigation
├── footer.php                   # Site footer with lightbox
├── front-page.php               # Homepage template
├── single-artist.php            # Individual artist page template
├── archive.php                  # Archive template
├── page.php                     # Page template
├── index.php                    # Fallback template
├── 404.php                      # 404 page template
├── search.php                   # Search results template
├── comments.php                 # Comments template
├── sidebar.php                  # Sidebar template
├── admin/
│   ├── theme-settings.php       # Theme settings page
│   └── admin.php               # Admin styles and scripts
├── assets/
│   ├── css/
│   │   └── admin.css           # Admin area styles
│   ├── js/
│   │   ├── app.js              # Main JavaScript (548 lines)
│   │   └── admin.js            # Admin scripts
│   └── images/
│       ├── logo.png
│       ├── banner.jpg
│       └── artists/
│           ├── bigtorres/
│           ├── inkbo/
│           └── selene/
├── inc/
│   ├── setup.php               # Theme setup
│   └── enqueue.php             # Script/style enqueueing
├── templates/
│   ├── hero-section.php        # Hero slideshow section
│   ├── marquee-section.php     # Scrolling text marquee
│   ├── about-section.php       # About us section
│   ├── services-section.php    # Services grid
│   ├── artists-section.php     # Artists grid
│   ├── gallery-section.php     # Gallery with tabs
│   ├── testimonials-section.php# Client reviews
│   └── contact-section.php     # Contact form and info
└── INSTALLATION.md              # This file
```

## Custom Post Types

### Artists (`artist`)
- **Slug**: `/artistas/[artist-name]`
- **Archive**: `/artistas`
- **Features**: Title, editor, thumbnail, excerpt, custom fields
- **Taxonomies**: Artist Styles

### Gallery Items (`gallery_item`)
- **Slug**: `/gallery/[item-name]`
- **Archive**: `/gallery`
- **Features**: Title, editor, thumbnail, excerpt
- **Taxonomies**: Gallery Categories (Tatuajes, Piercing)

### Testimonials (`testimonial`)
- **Public**: No (only visible in admin and on homepage)
- **Features**: Title, editor, date
- **Visibility**: Private post type

## JavaScript Features

The following JavaScript features from the static site have been migrated:

1. **Hero Slideshow** - Auto-rotating background images with dots navigation
2. **Typewriter Effect** - Animated text in the hero section
3. **Scroll Reveal** - Elements animate in as you scroll
4. **Stat Counters** - Animated number counting
5. **Gallery Filter** - Filter gallery items by category
6. **Gallery Lazy Load** - Load more button for large galleries
7. **Lightbox** - Image viewer with navigation
8. **Tabs** - Gallery tabs (Tatuajes/Piercing)
9. **Contact Form** - Validation and toast notifications
10. **Smooth Scroll** - Anchor link navigation
11. **Mobile Menu** - Hamburger menu with animation
12. **Navbar Scroll State** - Background change on scroll
13. **Parallax** - Subtle parallax effects
14. **WhatsApp Float** - Floating WhatsApp button

## CSS Features

- Dark theme (#0a0a0a background, #c9a96e gold accent)
- Responsive design (mobile-first breakpoints)
- Custom utility classes (Tailwind-like)
- Animations and transitions
- Lightbox styles
- Form styles
- Navigation styles
- Mobile menu styles
- Artist page styles
- Gallery styles
- Testimonial cards
- Contact form styles

## Image Migration

### Option 1: Use WordPress Media Library (Recommended)

1. Upload all images via **Media → Add New**
2. Set featured images for each Artist and Gallery item
3. Use the WordPress admin to manage images

### Option 2: Copy Files to Theme Assets

Run the migration script:
```bash
cd wp-content/themes/von-bastik-blog
bash scripts/migrate-images.sh
```

### Option 3: Manual Copy

Copy images from the static site to the theme:
```
static/public/images/ → wp-content/themes/von-bastik-blog/assets/images/
```

## Troubleshooting

### Navigation links not working
- Make sure you've set a static front page
- Check that smooth scroll JavaScript is loaded
- Verify anchor IDs match (inicio, nosotros, servicios, etc.)

### Images not showing
- Set featured images for Artists and Gallery items
- Check that image URLs are correct in theme mods
- Verify image files exist in assets folder

### JavaScript not working
- Check browser console for errors
- Verify app.js is loaded in page source
- Clear any caching plugins

### Styles not applying
- Verify style.css has the WordPress theme header
- Clear browser cache
- Check that Font Awesome is loading

### Menu not showing
- Go to Appearance → Menus
- Create and assign a menu to "Primary Menu" location

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari/Chrome: Latest versions

## Updates

To update the theme:
1. Backup your current theme files
2. Replace theme files with new version
3. Re-save permalinks (Settings → Permalinks → Save)
4. Clear any caches

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the browser console for errors
- Verify all installation steps were completed
