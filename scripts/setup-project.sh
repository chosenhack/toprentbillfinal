#!/bin/bash

# Exit on error
set -e

# Create application directory
sudo mkdir -p /var/www/subscription-manager
sudo chown -R $USER:$USER /var/www/subscription-manager
sudo chmod -R 755 /var/www/subscription-manager

# Navigate to project directory
cd /var/www/subscription-manager

# Install project dependencies
echo "Installing project dependencies..."
npm ci --production

# Build the project
echo "Building the project..."
npm run build

# Setup PM2
echo "Setting up PM2..."
pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# Create log directories
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

echo "Project setup completed successfully!"