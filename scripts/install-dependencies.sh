#!/bin/bash

# Exit on error
set -e

echo "Installing system dependencies..."

# Update system
sudo apt update
sudo apt upgrade -y

# Install essential build tools and utilities
sudo apt install -y \
    curl \
    git \
    build-essential \
    python3 \
    python3-pip \
    ufw \
    fail2ban \
    htop \
    iotop \
    nethogs \
    unzip \
    vim

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install global npm packages
sudo npm install -g pm2
sudo npm install -g typescript
sudo npm install -g ts-node

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Setup PM2 logrotate
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true

# Print versions
echo "Installed versions:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "PostgreSQL: $(psql --version)"
echo "Nginx: $(nginx -v)"

echo "All system dependencies installed successfully!"