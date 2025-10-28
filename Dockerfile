FROM php:8.2-apache

RUN apt-get update && apt-get install -y unzip libicu-dev && docker-php-ext-install intl
RUN a2enmod rewrite

COPY . /var/www/html/
WORKDIR /var/www/html/

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

EXPOSE 8080
CMD ["apache2-foreground"]
