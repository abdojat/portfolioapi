# Portfolio Backend

A comprehensive Node.js backend for managing your portfolio website with an admin panel.

## Features

- **Content Management**: Easy-to-use admin panel to update portfolio content
- **Contact Form Handling**: Process and manage contact form submissions
- **File Upload**: Upload images for projects and profile pictures
- **Authentication**: Secure admin login system
- **Email Notifications**: Get notified when someone contacts you
- **Database**: MongoDB integration for data persistence
- **API**: RESTful API for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Copy the environment example file and configure it:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Admin Credentials (change these!)
ADMIN_EMAIL=admin@yourportfolio.com
ADMIN_PASSWORD=admin123

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup

Make sure MongoDB is running on your system, or use MongoDB Atlas:

```bash
# Local MongoDB
mongod

# Or update MONGODB_URI in .env for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### 5. Access Admin Panel

Visit `http://localhost:5000/admin` to access the admin panel.

Default credentials:
- Email: `admin@yourportfolio.com`
- Password: `admin123`

**Important**: Change these credentials in the `.env` file!

## API Endpoints

### Public Endpoints

#### Portfolio Data
- `GET /api/portfolio` - Get all portfolio data

#### Contact Form
- `POST /api/contact` - Submit contact form

### Protected Endpoints (Admin Only)

#### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info
- `PUT /api/auth/profile` - Update admin profile
- `PUT /api/auth/password` - Change password

#### Portfolio Management
- `PUT /api/portfolio` - Update entire portfolio
- `PUT /api/portfolio/:section` - Update specific section (hero, about, contact)
- `POST /api/portfolio/projects` - Add new project
- `PUT /api/portfolio/projects/:id` - Update project
- `DELETE /api/portfolio/projects/:id` - Delete project

#### Contact Management
- `GET /api/contact` - Get all contact submissions
- `GET /api/contact/:id` - Get specific contact submission
- `PUT /api/contact/:id` - Update contact status
- `DELETE /api/contact/:id` - Delete contact submission
- `GET /api/contact/stats/overview` - Get contact statistics

#### Admin Panel
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/upload` - Upload image
- `GET /api/admin/uploads` - Get uploaded files
- `DELETE /api/admin/upload/:filename` - Delete uploaded file
- `GET /api/admin/export` - Export portfolio data
- `POST /api/admin/import` - Import portfolio data
- `POST /api/admin/backup` - Create backup

## Frontend Integration

### Update Your React Frontend

1. **Install axios** (if not already installed):
```bash
cd client
npm install axios
```

2. **Create API service** (`client/src/services/api.js`):
```javascript
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const getPortfolioData = async () => {
  const response = await api.get('/portfolio');
  return response.data.data;
};

export const submitContact = async (contactData) => {
  const response = await api.post('/contact', contactData);
  return response.data;
};

export default api;
```

3. **Update your components** to use the API:

```javascript
// In your App.tsx or main component
import { useEffect, useState } from 'react';
import { getPortfolioData } from './services/api';

function App() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPortfolioData();
        setPortfolioData(data);
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero data={portfolioData?.hero} />
      <About data={portfolioData?.about} />
      <Projects data={portfolioData?.projects} />
      <Contact data={portfolioData?.contact} />
      <Footer />
    </div>
  );
}
```

4. **Update Contact component** to use the API:
```javascript
import { submitContact } from '../services/api';

const Contact = ({ data }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact(formData);
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // ... rest of component
};
```

## Admin Panel Features

### Dashboard
- Overview statistics
- Recent contact messages
- Quick access to all sections

### Content Management
- **Hero Section**: Update title, subtitle, description, and social links
- **About Section**: Update personal info, description, and profile image
- **Projects**: Add, edit, and delete projects with full details
- **Contact**: Update contact information and description

### Contact Management
- View all contact form submissions
- Mark messages as read/replied
- Delete messages
- Contact statistics

### File Management
- Upload images for projects
- View uploaded files
- Delete files
- Cloudinary integration (optional)

### Data Management
- Export portfolio data as JSON
- Import portfolio data
- Create backups
- Restore from backups

## Security Features

- JWT authentication for admin access
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://yourdomain.com
```

### Recommended Hosting

- **Backend**: Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas
- **File Storage**: Cloudinary or AWS S3
- **Frontend**: Vercel, Netlify, or GitHub Pages

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure network access for MongoDB Atlas

2. **CORS Errors**
   - Update `CLIENT_URL` in `.env`
   - Check if frontend URL matches

3. **Admin Login Issues**
   - Verify admin credentials in `.env`
   - Check if admin account exists in database

4. **File Upload Issues**
   - Ensure uploads directory exists
   - Check file size limits
   - Verify Cloudinary credentials (if using)

### Logs

Check server logs for detailed error information:
```bash
npm run dev
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review server logs
3. Verify environment configuration
4. Test API endpoints with Postman or similar tool

## License

MIT License - feel free to use this for your own portfolio! 