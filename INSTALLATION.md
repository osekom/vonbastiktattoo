# Von Bastik Blog - Installation Guide

## Quick Start with Docker

### Prerequisites

- Docker installed
- Docker Compose installed

### Step 1: Start the Environment

```bash
cd /path/to/vonbastiktattoo
docker-compose up -d
```

This will start:
- **WordPress** at `http://localhost:8080`
- **MySQL** at `localhost:3306`
- **phpMyAdmin** at `http://localhost:8081`
- **Nginx** at `http://localhost:80`

### Step 2: Complete WordPress Installation

1. Open `http://localhost` in your browser
2. Select language
3. Fill in:
   - Site Title: Von Bastik Blog
   - Username: admin
   - Password: (choose a strong password)
   - Email: your@email.com
4. Click "Install WordPress"

### Step 3: Activate the Theme

1. Go to `http://localhost/wp-admin`
2. Login with your credentials
3. Navigate to **Appearance > Themes**
4. Find "Von Bastik Blog" and click "Activate"

### Step 4: Configure the Blog

1. **Create Categories**:
   - Go to **Posts > Categories**
   - Create these categories:
     - Noticias del estudio
     - Galería de trabajos
     - Eventos y colaboraciones
     - Consejos de diseño
     - Cuidados post-tatuaje

2. **Create Menu**:
   - Go to **Appearance > Menus**
   - Create "Primary Menu" with:
     - Home
     - Blog
     - About (or any other pages)
   - Assign to "Primary Menu" location

3. **Set Blog Page**:
   - Create a new page called "Blog"
   - Go to **Settings > Reading**
   - Set "Your homepage displays" to "A static page"
   - Set "Posts page" to your "Blog" page

4. **Add Posts**:
   - Go to **Posts > Add New**
   - Add title, content, featured image
   - Assign categories and tags
   - Publish!

## Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f wordpress
```

### Access WordPress Shell
```bash
docker exec -it von-bastik-wordpress wp --info
```

### Install WP-CLI Commands
```bash
# List themes
docker exec -it von-bastik-wordpress wp theme list

# Activate theme
docker exec -it von-bastik-wordpress wp theme activate von-bastik-blog

# Create sample posts
docker exec -it von-bastik-wordpress wp post list
```

## Database Access

### Via phpMyAdmin
1. Open `http://localhost:8081`
2. Login with:
   - Username: wordpress
   - Password: wordpress

### Via Command Line
```bash
docker exec -it von-bastik-mysql mysql -u wordpress -pwordpress wordpress
```

## Troubleshooting

### Theme Not Showing
- Make sure the theme folder is at `wp-content/themes/von-bastik-blog/`
- Check file permissions: `chmod -R 755 wp-content/themes/von-bastik-blog/`

### Images Not Loading
- Check that images are copied to `assets/images/`
- Verify file permissions

### Docker Port Conflict
If port 80 is already in use:
1. Edit `docker-compose.yml`
2. Change `80:80` to `8082:80`
3. Restart: `docker-compose down && docker-compose up -d`

## Production Deployment

For production deployment:

1. Update database credentials in `docker-compose.yml`
2. Set strong passwords
3. Enable SSL/TLS
4. Configure backups
5. Set proper file permissions
