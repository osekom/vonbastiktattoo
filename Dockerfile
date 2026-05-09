FROM wordpress:6.4-php8.2-apache

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql && \
    docker-php-ext-enable pdo_mysql

# Install GD extension for image processing
RUN apt-get update && \
    apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd

# Set permissions
RUN chown -R www-data:www-data /var/www/html && \
    find /var/www/html -type d -exec chmod 755 {} \; && \
    find /var/www/html -type f -exec chmod 644 {} \;

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy custom php.ini settings
COPY php.ini /usr/local/etc/php/conf.d/99-custom.ini

EXPOSE 80
