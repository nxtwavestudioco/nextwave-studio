# NextWave Studio Backend API

Backend server for NextWave Studio Portfolio application.

## Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/screenshots` - Upload project screenshots

### Monthly Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment status

### Settings
- `GET /api/social-links` - Get social media links
- `PUT /api/social-links` - Update social media links
- `GET /api/payment-info` - Get payment information
- `PUT /api/payment-info` - Update payment information

### Messages
- `GET /api/messages` - Retrieve all contact form messages
- `POST /api/messages` - Save a new message from the contact form

### Health Check
- `GET /api/health` - Check server status

## Deployment

### For Heroku:
1. Create a Heroku account and app
2. Connect your GitHub repository
3. Set environment variables in Heroku dashboard
4. Deploy

### For Other Platforms:
- Update the CORS origin in server.js with your frontend URL
- Deploy the server and update frontend API calls to use your server URL

## Frontend Integration

Update the React frontend `.env` to point to your backend:
```
REACT_APP_API_URL=http://localhost:5000
```

Then use in API calls:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/invoices`)
```

## Database

Currently uses in-memory storage. For production, integrate:
- MongoDB
- PostgreSQL
- Firebase Firestore
- DynamoDB

Update models and database connections accordingly.
