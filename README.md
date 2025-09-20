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

# Portfolio Backend

Professional, production-ready Node.js backend for a personal portfolio website with a lightweight admin panel.

This repository provides:

- A single-document portfolio data model (hero, about, projects, contact, footer)
- Contact form handling with email notification support
- Admin authentication (JWT + bcrypt)
- File upload + Cloudinary support (optional)
- RESTful API and an embedded admin panel served from /admin

---

## Table of contents

- Features
- Tech stack
- Quick start
- Configuration (.env)
- Available scripts
- API overview
- Admin panel & data initialization
- Security & production notes
- Deployment recommendations
- Contributing
- License

---

## Features

- Single document portfolio model with sections: hero, about, projects, contact, footer
- Project CRUD, skills CRUD, contact management, file uploads, export/import and backups
- Admin dashboard with basic statistics
- Email notifications for incoming contact messages (configurable)
- Optional Cloudinary uploads with local fallback

## Tech stack

- Node.js + Express
- MongoDB (Mongoose)
- JWT for authentication
- Multer + multer-storage-cloudinary for uploads
- Helmet, compression, cors, express-rate-limit for basic security and performance

## Quick start

Prerequisites

- Node.js (>= 16 recommended)
- npm or yarn
- MongoDB (local) or MongoDB Atlas

1) Install dependencies

```powershell
cd c:\Users\3bdojat\Desktop\portfolio\server
npm install
```

2) Create a .env file

Copy `env.example` to `.env` and fill in your values. In PowerShell:

```powershell
Copy-Item env.example .env
# then edit .env with your editor of choice
```

Important environment variables are listed in the Configuration section below.

3) (Optional) Initialize the database

This project includes an `init-db` script that creates a default admin (using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`) and seed portfolio data.

```powershell
npm run init-db
```

4) Start the server

```powershell
# development (nodemon)
npm run dev

# production
npm start
```

The API will be available at http://localhost:5000/api by default, and the admin panel at http://localhost:5000/admin.

## Configuration (.env)

Copy `env.example` and set these (high level):

- PORT (default: 5000)
- NODE_ENV (development|production)
- MONGODB_URI (mongodb://localhost:27017/portfolio or MongoDB Atlas URI)
- JWT_SECRET and JWT_EXPIRE
- ADMIN_EMAIL and ADMIN_PASSWORD (used by `init-db` to create a first admin)
- EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS (optional — for contact form notifications)
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (optional)
- CLIENT_URL (frontend URL for CORS)

Do NOT commit your `.env` to version control.

## Available scripts

- `npm start` — start server with Node.js
- `npm run dev` — start server with nodemon (development)
- `npm run init-db` — initialize DB: create default admin and seed portfolio data

These scripts are defined in `package.json`.

## API overview

Base URL: /api

Health
- GET /api/health — basic health check

Public
- GET /api/portfolio — fetch the full portfolio document
- POST /api/contact — submit the contact form (validates name, email, message)

Authentication
- POST /api/auth/login — authenticate admin, returns JWT

Protected (require Authorization: Bearer <token>)

Auth
- GET /api/auth/me — get current admin profile
- PUT /api/auth/profile — update admin name/email
- PUT /api/auth/password — change password
- GET /api/auth/admins — (super-admin) list admins
- POST /api/auth/admins — (super-admin) create admin

Portfolio (public read, protected write)
- PUT /api/portfolio — replace/update portfolio document
- PUT /api/portfolio/:section — update a single section (e.g. hero, about)
- POST /api/portfolio/projects — add a project
- PUT /api/portfolio/projects/:id — update project
- DELETE /api/portfolio/projects/:id — delete project

Contact (admin)
- GET /api/contact — list contact submissions (pagination + filtering)
- GET /api/contact/:id — get a single submission
- PUT /api/contact/:id — update status (unread/read/replied)
- DELETE /api/contact/:id — delete submission
- GET /api/contact/stats/overview — contact statistics

Admin utilities
- GET /api/admin/dashboard — dashboard statistics
- POST /api/admin/upload — upload image (multipart/form-data, field name: image)
- GET /api/admin/uploads — list uploaded files (local uploads folder)
- DELETE /api/admin/upload/:filename — delete local upload
- GET /api/admin/export — export portfolio and contacts as JSON
- POST /api/admin/import — import portfolio and contacts from JSON
- POST /api/admin/backup — create a local backup file under `backups/`

Upload routes (Cloudinary middleware)
- POST /api/upload/image — another endpoint that uses Cloudinary parser (see `routes/uploadRoutes.js`)

Static
- Admin panel: GET /admin (served from `admin/` folder)
- Uploads: served from /uploads

## Admin panel & data initialization

- Admin panel is a static SPA located in `admin/` and served at `/admin`.
- The `init-db` script creates a default admin using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from your `.env` if no admin exists. Make sure to set strong credentials before running in production.

## Security & production notes

- Authentication: JWT tokens signed with `JWT_SECRET`. Keep it secret and long.
- Passwords are hashed with bcrypt.
- Helmet and compression are enabled.
- Basic rate limiting is included (configurable in `server.js`).
- Consider additional hardening for production: HTTPS, stricter CORS, centralized logging, process manager (PM2), and automatic backups.

## Deployment recommendations

- Use MongoDB Atlas for production DB and set `MONGODB_URI` accordingly.
- Use Cloudinary for file storage by setting Cloudinary env variables — otherwise uploads are stored in the local `uploads/` folder.
- Recommended hosting: Railway, Render, Heroku, or DigitalOcean App Platform for the backend; Vercel or Netlify for frontend.

Example environment variables for production (keep them secret):

```text
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-frontend-domain.example
```

## Troubleshooting

- MongoDB connection errors: check that `MONGODB_URI` is correct and the DB is reachable.
- Email not sent: verify SMTP creds and that less-secure access / app password is configured for providers like Gmail.
- Upload errors: check `CLOUDINARY_*` vars or file size/type limits (5MB by default).

Check logs (development):

```powershell
npm run dev
```

## Contributing

Contributions are welcome. Please file issues or pull requests. Keep changes focused and include tests when possible.

Suggested workflow:

```powershell
git checkout -b feat/describe-change
git add .
git commit -m "feat: brief description"
git push origin feat/describe-change
```

## License

This project is released under the MIT License.
