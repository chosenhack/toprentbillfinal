# Subscription Management System

A comprehensive system for managing customer subscriptions, payments, and reporting.

## Features

### Customer Management
- Add, edit and deactivate customers
- Track customer details including billing information
- Support for luxury customers and different sales teams
- Import/export customer data via CSV
- Quick search and filtering capabilities

### Payment Tracking
- Monitor payment status (confirmed, pending, problem, processing)
- Support for multiple payment frequencies (monthly, quarterly, biannual, annual, one-time)
- Payment history and renewal tracking
- Automatic payment schedule generation
- Support for multiple payment methods (Stripe, bank transfer, cash, crypto)

### Calendar View
- Visual payment schedule overview
- Color-coded payment status indicators
- Year-based navigation
- Real-time payment status updates

### Reporting
- Comprehensive financial reports
- Sales team performance metrics
- Customer analytics
- Revenue tracking and forecasting
- Export capabilities to Excel
- Top spenders analysis

### Activity Logging
- Track all system actions
- User activity monitoring
- Detailed activity history
- Timestamp tracking for all changes

## Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

## Database Setup

1. Install PostgreSQL 12 or higher

2. Create a new database and user:
```sql
CREATE DATABASE subscription_manager;
CREATE USER subscription_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE subscription_manager TO subscription_user;
```

3. Configure database access:
```sql
\c subscription_manager
GRANT ALL ON ALL TABLES IN SCHEMA public TO subscription_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO subscription_user;
```

4. Create required tables:
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subscription_type VARCHAR(50) NOT NULL,
  payment_frequency VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  stripe_link VARCHAR(255),
  crm_link VARCHAR(255),
  active BOOLEAN DEFAULT true,
  activation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  deactivation_date TIMESTAMP WITH TIME ZONE,
  sales_team VARCHAR(50) NOT NULL,
  is_luxury BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Billing info table
CREATE TABLE billing_info (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  company_name VARCHAR(255) NOT NULL,
  vat_number VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  sdi VARCHAR(255),
  pec VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  amount DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  user_name VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  details JSONB NOT NULL
);
```

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Configure the following variables in `.env`:
```env
NODE_ENV=development
PORT=3000

# Database
DB_USER=subscription_user
DB_HOST=localhost
DB_NAME=subscription_manager
DB_PASSWORD=your_secure_password
DB_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret

# Frontend
VITE_API_URL=http://localhost:3000/api
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run database migrations:
```bash
npm run migrate
```

3. Seed initial data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

## Default Login

After seeding the database, you can login with:
- Email: admin@demo.com
- Password: demo123

## Production Deployment

For production deployment instructions, see [DEPLOY.md](DEPLOY.md).

## License

MIT