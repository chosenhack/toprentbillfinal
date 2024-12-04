# VPS Setup Scripts

These scripts help automate the setup process of the subscription management system on a VPS.

## Usage

1. First, make the scripts executable:
```bash
chmod +x scripts/install-dependencies.sh
chmod +x scripts/setup-project.sh
```

2. Install system dependencies:
```bash
./scripts/install-dependencies.sh
```

3. Setup the project:
```bash
./scripts/setup-project.sh
```

## Important Notes

- Run these scripts on Ubuntu 20.04 or newer
- Make sure you have sudo privileges
- The scripts assume a clean installation
- PostgreSQL credentials should be configured manually after installation
- Environment variables should be set up manually in .env file
- SSL certificates should be configured separately using certbot

## Environment Variables

Make sure to set up the following environment variables in your .env file:

```env
NODE_ENV=production
PORT=3000

# Database
DB_USER=subscription_user
DB_HOST=localhost
DB_NAME=subscription_manager
DB_PASSWORD=your_secure_password
DB_PORT=5432

# JWT
JWT_SECRET=your_secure_random_string_at_least_32_chars

# Frontend
VITE_API_URL=/api
```

## Post-Installation Steps

1. Configure PostgreSQL:
```bash
sudo -u postgres psql
CREATE DATABASE subscription_manager;
CREATE USER subscription_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE subscription_manager TO subscription_user;
\q
```

2. Configure Nginx:
Follow the instructions in DEPLOY.md for Nginx configuration.

3. Set up SSL:
```bash
sudo certbot --nginx -d your-domain.com
```

4. Start the application:
```bash
pm2 start ecosystem.config.js
pm2 save
```