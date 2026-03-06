# Deployment Guide

## Quick Summary

This application has two parts:
1. **Frontend** (React) - Deployed to GitHub Pages, Vercel, or Netlify
2. **Backend** (Express.js) - Deployed to Heroku, Railway, AWS, or similar

## Frontend Deployment

### Option 1: GitHub Pages

1. Update `package.json`:
```json
"homepage": "https://yourusername.github.io/nextwave-studio"
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add scripts to `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

4. Deploy:
```bash
npm run deploy
```

### Option 2: Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your repository
5. Vercel will auto-detect React setup
6. Set environment variables (if needed)
7. Click "Deploy"

**Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.herokuapp.com
```

### Option 3: Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Set build command: `npm run build`
6. Set publish directory: `build`
7. Add environment variables
8. Deploy

**Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.herokuapp.com
```

## Backend Deployment

### Option 1: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Create `Procfile` in root:
```
web: node server/server.js
```

5. Create `.env` on Heroku:
```bash
heroku config:set PORT=5000
```

6. Deploy:
```bash
git push heroku main
```

### Option 2: Railway.app

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `server` directory as the root
6. Set environment variables
7. Deploy automatically on push

### Option 3: AWS EC2

1. Launch EC2 instance (Ubuntu)
2. SSH into instance
3. Install Node.js and npm
4. Clone repository
5. Run: `npm install`
6. Start with PM2:
```bash
npm install -g pm2
pm2 start server/server.js
pm2 startup
pm2 save
```

7. Set up reverse proxy with Nginx
8. Configure SSL with Let's Encrypt
9. Update frontend API URL

## Environment Configuration

### Frontend (.env)
```
REACT_APP_API_URL=https://your-api-domain.com
```

### Backend (server/.env)
```
PORT=5000
NODE_ENV=production
DATABASE_URL=your-database-url
```

## Database Setup

### MongoDB Atlas (Recommended for beginners)

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create free account
3. Create new cluster
4. Get connection string
5. Update backend `.env`
6. Install Mongoose: `npm install mongoose`
7. Create models in `server/models/`

### PostgreSQL

1. Create database on AWS RDS or local
2. Install pg: `npm install pg`
3. Update connection string in `.env`
4. Create tables with migrations

## CORS Configuration

Update `server/server.js` CORS settings:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yourusername.github.io',
    'https://your-domain.com'
  ],
  credentials: true
}));
```

## Custom Domain

### For GitHub Pages:
1. Add `CNAME` file to `public/`:
```
your-domain.com
```

2. Update `package.json` homepage:
```json
"homepage": "https://your-domain.com"
```

### For other platforms:
1. Update DNS records to point to service
2. Enable custom domain in platform settings
3. Set up SSL certificate

## Monitoring & Logs

### Heroku
```bash
heroku logs --tail
```

### Railway/Vercel
Use dashboard to view logs

### GitHub
Check Actions tab for deployment status

## Troubleshooting

### Backend not connecting
- Check API URL in `.env`
- Verify backend is running
- Check CORS configuration
- Look for network errors in browser console

### Deployment failed
- Check build logs
- Verify all dependencies installed
- Check environment variables
- Ensure code has no syntax errors

### Database connection error
- Verify connection string
- Check database credentials
- Ensure database is accessible
- Check network/firewall rules

## Production Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and running
- [ ] API_URL configured correctly
- [ ] CORS properly set up
- [ ] Environment variables set
- [ ] Database initialized
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Error logging set up
- [ ] Backups configured
- [ ] Performance monitored
- [ ] Security headers configured

## Next Steps

After initial deployment, consider:
1. Set up continuous integration (GitHub Actions)
2. Implement error tracking (Sentry)
3. Set up monitoring (Datadog, New Relic)
4. Configure backups
5. Implement caching strategies
6. Optimize images and assets
7. Set up analytics
8. Implement security best practices
