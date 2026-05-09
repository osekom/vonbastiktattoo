#!/bin/bash

# ========================================
# Von Bastik Tattoo - Image Migration Script
# ========================================
# This script copies images from the static site to the WordPress theme
# Run this from the theme directory: bash scripts/migrate-images.sh
# ========================================

# Get the script directory and theme root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$THEME_ROOT/../../../.." && pwd)"

# Source directories
STATIC_PUBLIC="$PROJECT_ROOT/public"
THEME_ASSETS="$THEME_ROOT/assets"

# Create necessary directories
echo "Creating directory structure..."
mkdir -p "$THEME_ASSETS/images/artists/bigtorres"
mkdir -p "$THEME_ASSETS/images/artists/inkbo"
mkdir -p "$THEME_ASSETS/images/artists/selene"
mkdir -p "$THEME_ASSETS/images/artists/bigtorres/gallery"
mkdir -p "$THEME_ASSETS/images/artists/inkbo/gallery"
mkdir -p "$THEME_ASSETS/images/artists/selene/gallery"
mkdir -p "$THEME_ASSETS/images/gallery"
mkdir -p "$THEME_ASSETS/images/services"

# Copy logo and banner
echo "Copying main images..."
cp "$STATIC_PUBLIC/images/logo.png" "$THEME_ASSETS/images/" 2>/dev/null || echo "Warning: logo.png not found"
cp "$STATIC_PUBLIC/images/banner.jpg" "$THEME_ASSETS/images/" 2>/dev/null || echo "Warning: banner.jpg not found"

# Copy artist hero images
echo "Copying artist hero images..."
if [ -d "$STATIC_PUBLIC/artist" ]; then
    for artist_dir in "$STATIC_PUBLIC/artist"/*/; do
        artist_name=$(basename "$artist_dir")
        hero_file=$(ls "$artist_dir"/*.jpg 2>/dev/null | head -1)
        if [ -n "$hero_file" ]; then
            cp "$hero_file" "$THEME_ASSETS/images/artists/$artist_name/" 2>/dev/null
            echo "  Copied hero image for $artist_name"
        fi
        
        # Copy gallery images
        gallery_dir="$artist_dir/gallery"
        if [ -d "$gallery_dir" ]; then
            for img in "$gallery_dir"/*; do
                # Skip .HEIC files (need conversion or manual copy)
                if [[ "$img" == *.HEIC ]]; then
                    echo "  Skipping HEIC file: $(basename $img) (manual conversion needed)"
                else
                    cp "$img" "$THEME_ASSETS/images/artists/$artist_name/gallery/" 2>/dev/null
                fi
            done
            echo "  Copied gallery images for $artist_name"
        fi
    done
fi

# Copy service images (if they exist in static site)
echo "Copying service images..."
if [ -d "$STATIC_PUBLIC/services" ]; then
    for img in "$STATIC_PUBLIC/services"/*; do
        cp "$img" "$THEME_ASSETS/images/services/" 2>/dev/null
    done
fi

echo ""
echo "========================================="
echo "Image migration complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Convert any .HEIC files to .jpg or .webp"
echo "2. Upload images via WordPress Media Library"
echo "3. Assign images to Artists and Gallery CPT entries"
echo ""
echo "Image locations:"
echo "  Theme assets: $THEME_ASSETS/images/"
echo "  WordPress uploads: $(wp plugin path 2>/dev/null || echo '/wp-content/uploads/')"
echo ""
