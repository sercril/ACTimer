#!/usr/bin/env bash

ln -s /home/vagrant/ACTimer/acapi.conf /etc/nginx/conf.d/acapi.conf
cat << EOF > /etc/nginx/conf.d/php-fpm.conf
# PHP-FPM FastCGI server
# network or unix domain socket configuration

upstream php-fpm {
        #server 127.0.0.1:9000;
        server unix:/run/php-fpm/www.sock;
}
EOF

sed -i 's/^listen = 127\.0\.0\.1:9000/;listen = 127.0.0.1:9000/g' /etc/php-fpm.d/www.conf
sed -i 's|^\;listen = /run/php\-fpm/www.sock|listen = /run/php-fpm/www.sock|g' /etc/php-fpm.d/www.conf
sed -i 's/^;listen\.acl_users = nginx/listen\.acl_users = nginx/g' /etc/php-fpm.d/www.conf