#!/usr/bin/env python3
"""
Renombra las fotos de la galeria de cada artista al formato:
    {artista}-work-{N}.ext

Donde:
  - {artista} es el nombre de la carpeta del artista (en minusculas)
  - {N} es un contador secuencial de 2 digitos (01, 02, 03...)

Ademas:
  - Verifica que cada imagen renombrada exista en el HTML del artista
  - Si no existe, agrega una entrada en la galeria del HTML
  - Elimina los filtros de la galeria (muestra todos los trabajos)

Uso:
    python scripts/rename_gallery_photos.py
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GALLERY_ROOT = ROOT / "public" / "artist"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}

CORRECT_PATTERN = re.compile(r"^[a-z]+-work-\d{2}\.\w+$", re.IGNORECASE)


def find_artist_html(artist_dir):
    """Busca el archivo HTML del artista."""
    name = artist_dir.name.lower()
    for f in ROOT.iterdir():
        if f.is_file() and f.suffix == ".html" and name in f.stem.lower():
            return f
    return None


def get_gallery_images_from_html(html_path):
    """Extrae los nombres de archivo de las imagenes en la galeria."""
    if not html_path or not html_path.exists():
        return set()

    content = html_path.read_text(encoding="utf-8")
    # Buscar todas las imagenes dentro del gallery-grid
    images = set()
    # Patron para src=".../gallery/filename.ext"
    pattern = re.compile(r'src="[^"]*/gallery/([^"]+)"')
    for m in pattern.finditer(content):
        images.add(m.group(1))
    return images


def remove_filters_from_html(html_path):
    """Elimina los botones de filtro de la galeria."""
    if not html_path or not html_path.exists():
        return False

    content = html_path.read_text(encoding="utf-8")

    # Patron para el bloque de filtros
    pattern = re.compile(
        r'\s*<div class="flex justify-center gap-4 mb-12 flex-wrap reveal"[^>]*role="toolbar"[^>]*>.*?</div>\s*',
        re.DOTALL
    )

    new_content = pattern.sub('\n', content)
    if new_content != content:
        html_path.write_text(new_content, encoding="utf-8")
        return True
    return False


def add_gallery_items_to_html(html_path, new_images, artist_dir_name, artist_display_name):
    """Agrega las imagenes faltantes a la galeria del HTML."""
    if not new_images or not html_path or not html_path.exists():
        return

    content = html_path.read_text(encoding="utf-8")

    # Buscar el cierre del gallery-grid
    # Patrón: </div> que cierra gallery-grid, seguido de </div></div></section>
    pattern = re.compile(
        r'(<div class="gallery-grid reveal" id="galleryGrid">)(.*?)(\s*</div>\s*</div>\s*</section>)',
        re.DOTALL
    )
    match = pattern.search(content)
    if not match:
        print(f"   [WARN] No se encontro gallery-grid en {html_path.name}")
        return

    gallery_inner = match.group(2)

    # Generar HTML para cada nueva imagen
    items_html = []
    for img_name in sorted(new_images):
        base_name = img_name.rsplit(".", 1)[0]
        parts = base_name.split("-")
        if len(parts) >= 3:
            title = " ".join(parts[1:-1]).title()
        else:
            title = base_name.replace("-", " ").title()

        item = (
            f'\n                    <div class="gallery-item" onclick="openLightbox(this)" '
            f'role="button" tabindex="0" aria-label="Ver tatuaje {title}">\n'
            f'                        <img src="public/artist/{artist_dir_name}/gallery/{img_name}" '
            f'alt="Tatuaje realizado por {artist_display_name}" loading="lazy" decoding="async">\n'
            f'                        <div class="gallery-overlay">\n'
            f'                            <h4>{title}</h4>\n'
            f'                        </div>\n'
            f'                    </div>'
        )
        items_html.append(item)

    new_gallery_inner = gallery_inner + "".join(items_html)
    new_content = content.replace(match.group(0), match.group(1) + new_gallery_inner + match.group(3))

    html_path.write_text(new_content, encoding="utf-8")
    print(f"   [ADD] {len(new_images)} imagen(es) agregada(s) al HTML")


def rename_gallery_photos():
    if not GALLERY_ROOT.exists():
        print(f"[ERROR] Directorio no encontrado: {GALLERY_ROOT}")
        return

    artists = sorted(d for d in GALLERY_ROOT.iterdir() if d.is_dir())

    if not artists:
        print("[WARN] No se encontraron directorios de artistas.")
        return

    for artist_dir in artists:
        gallery_dir = artist_dir / "gallery"
        if not gallery_dir.exists():
            print(f"[SKIP] {artist_dir.name}: no tiene carpeta gallery/")
            continue

        artist_name = artist_dir.name.lower()
        artist_display = artist_dir.name

        html_path = find_artist_html(artist_dir)
        if not html_path:
            print(f"[WARN] {artist_dir.name}: no se encontro archivo HTML")
            continue

        files = sorted(
            f for f in gallery_dir.iterdir()
            if f.is_file() and f.suffix.lower() in IMAGE_EXTENSIONS
        )

        if not files:
            print(f"[SKIP] {artist_dir.name}: galeria vacia")
            continue

        print(f"\n[DIRE] {artist_dir.name}/gallery/ ({len(files)} archivos)")

        # Paso 1: Renombrar archivos
        counter = 1
        renamed_files = []
        for old_path in files:
            if CORRECT_PATTERN.match(old_path.name):
                renamed_files.append(old_path.name)
                counter += 1
                continue

            ext = old_path.suffix.lower()
            new_name = f"{artist_name}-work-{counter:02d}{ext}"
            new_path = old_path.with_name(new_name)

            if new_path.exists():
                counter += 1
                new_name = f"{artist_name}-work-{counter:02d}{ext}"
                new_path = old_path.with_name(new_name)

            try:
                old_path.rename(new_path)
                print(f"   [REN] {old_path.name} -> {new_name}")
                renamed_files.append(new_name)
            except Exception as e:
                print(f"   [ERR] Error renombrando {old_path.name}: {e}")

            counter += 1

        # Paso 2: Verificar imagenes en HTML
        existing = get_gallery_images_from_html(html_path)
        new_images = set(renamed_files) - existing

        if new_images:
            add_gallery_items_to_html(html_path, new_images, artist_dir.name, artist_display)
        else:
            print(f"   [OK] Todas las imagenes ya estan en el HTML")

        # Paso 3: Eliminar filtros
        if remove_filters_from_html(html_path):
            print(f"   [FLT] Filtros eliminados")


if __name__ == "__main__":
    print("=" * 50)
    print("  Von Bastik - Renombrar fotos de galeria")
    print("=" * 50)
    rename_gallery_photos()
    print("\n[OK] Proceso completado.")
