#!/usr/bin/env bash

yum -y update
yum groupinstall 'Development Tools'
curl https://setup.ius.io/ | bash -
yum -y install php70u nginx curl vim php70u-fpm-nginx php70u-cli php70u-mysqlnd
curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
yum -y install nodejs
cat << EOF > /etc/yum.repos.d/mongodb-org-3.2.repo
[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/3.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.2.asc
EOF
yum install -y mongodb-org