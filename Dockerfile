
FROM php:7.4-fpm-alpine

# Set working directory
WORKDIR /var/www

COPY composer.lock composer.json ./
COPY ./package.json ./

#RUN docker-php-ext-install -y pdo pdo_mysql
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

RUN apk add --update vim
RUN apk add --update nodejs npm