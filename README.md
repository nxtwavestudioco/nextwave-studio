# NextWave Studio - Freelance Portfolio

A modern, interactive freelancer portfolio website with advanced invoice management, project showcase, and subscription handling system.

## Features

### Frontend
- **Modern Design**: Dark mode with neon accents, glassmorphism UI, smooth animations
- **Responsive**: Fully responsive design for all devices
- **Interactive Sections**: Hero, About, Projects, Services, Contact, Invoices
- **Invoice System**: Complete client portal with PDF generation and professional formatting
- **Project Showcase**: Image gallery with screenshot uploads for project presentations
- **Monthly Subscriptions**: Manage recurring payments with custom notes
- **Admin Mode**: Toggle-based admin/user mode separation
- **Social Media Integration**: Editable social links (GitHub, Email)
- **Payment Management**: Bank details, GCash, and payment tracking

### Backend
- **REST API**: Complete API endpoints for all features
- **In-Memory Database**: Ready for production database integration
- **CORS Enabled**: Cross-origin support for frontend
- **Scalable**: Easy to integrate with MongoDB, PostgreSQL, Firebase, etc.

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- jsPDF (PDF generation)

### Backend
- Node.js
- Express.js
- CORS middleware
- dotenv

## Project Structure

```
nextwave-studio/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   ├── services/          # API service module
│   ├── App.jsx
│   └── index.js
├── server/               # Backend API
│   ├── server.js
│   ├── package.json
│   ├── README.md
│   └── .env.example
├── package.json
└── README.md
```

## Quick Start

### Frontend Setup

1. Clone repository:
```bash
git clone <repository-url>
cd nextwave-studio
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
REACT_APP_API_URL=http://localhost:5000
```

4. Start development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
PORT=5000
NODE_ENV=development
```

4. Start server:
```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

Server runs on [http://localhost:5000](http://localhost:5000)

## Admin Mode

Click the **lock icon** in the navigation bar to toggle between User and Admin modes.

### Admin Capabilities
- Create and manage invoices
- Set up bank/GCash payment details
- Manage monthly subscriptions
- Upload and manage project screenshots
- Edit social media links

### User View
- View invoices (amounts hidden)
- See project presentations
- Access payment information
- View social media links

## Invoice Features

- **Professional PDF**: Formatted invoices with company header and borders- **Custom Logo**: Place a `logo.png` in the `public/` folder (transparent preferred) and it will appear in the PDF header. The code falls back gracefully if the file is missing.- **Line Items**: Add multiple items with quantity and price
- **Tax Calculation**: Automatic tax calculation
- **PDF Download**: Download formatted PDFs
- **Client Portal**: Separate client/admin views

## Project Showcase

- **Screenshot Gallery**: Upload multiple screenshots per project
- **Slide Presentation**: Click through project slides
- **Admin Upload**: Admin can add/remove project screenshots
- **Live Preview**: See uploaded images immediately

## Monthly Subscriptions

- **Recurring Payments**: Set up monthly billing
- **Payment Notes**: Mark subscriptions as "Monthly Payment only"
- **Easy Management**: Add or remove subscriptions
- **Tracking**: Monitor active subscriptions

## API Documentation

See `server/README.md` for detailed API endpoint documentation.

## Build for Production

```bash
npm run build
```

## Deployment

### Frontend
- **GitHub Pages**: Configure `package.json` with homepage
- **Vercel**: Connect GitHub repository
- **Netlify**: Connect GitHub repository
- **AWS S3 + CloudFront**: Upload build folder

### Backend
- **Heroku**: Push to Heroku with Procfile
- **AWS EC2**: Deploy Node.js application
- **Google Cloud Run**: Containerize and deploy
- **Railway.app**: Simple deployment with GitHub

## Database Integration

The backend currently uses in-memory storage. For production, integrate:

- **MongoDB**: NoSQL database
- **PostgreSQL**: Relational database
- **Firebase Firestore**: Cloud database
- **AWS DynamoDB**: Serverless database

Update `server/server.js` models and connections accordingly.

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Backend (server/.env)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

## Admin Password/Authentication

Currently uses toggle-based mode. For production, implement:
- JWT token authentication
- Password protection
- Session management
- Role-based access control

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### CORS Issues
Update `REACT_APP_API_URL` in `.env` to match your backend URL

### PDF Not Downloading
Check browser console for errors, ensure jsPDF is installed

## Future Enhancements

- [ ] Database integration
- [ ] Authentication system
- [ ] Email notifications
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Image optimization
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Invoice templates
- [ ] Client review system

## Contributing

Pull requests are welcome. Please ensure code follows project style.

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions, please create an issue in the repository.