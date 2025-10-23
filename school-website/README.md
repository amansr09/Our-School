# 🏫 School Website - Full Stack Application

A modern, full-featured school website with admin panel for content management. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### Public Website
- **Hero Section** - Editable welcome section with circular image
- **About Section** - School information with image
- **Announcements** - Latest school announcements
- **Academic Programs** - Program offerings
- **Gallery** - Photos and videos with modal viewers
- **Faculty** - Staff profiles with photos
- **Contact Form** - Get in touch functionality
- **Responsive Design** - Works on all devices

### Admin Panel
- **Secure Login** - JWT-based authentication
- **Content Management** - Edit all sections inline
- **Gallery Management** - Upload photos and videos
- **Faculty Management** - Add/edit/delete faculty members
- **Event Management** - Manage school events
- **Announcements** - Create and manage announcements
- **Edit Mode** - Visual editing directly on the website

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd school-website
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create `.env` in root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/school-website
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

5. **Start the application**
   
   **Backend** (from root directory):
   ```bash
   npm start
   ```
   
   **Frontend** (in new terminal, from client directory):
   ```bash
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Panel: http://localhost:3000/admin/login

## 📁 Project Structure

```
school-website/
├── server/                 # Backend
│   ├── server.js          # Express server
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Content.js
│   │   ├── Gallery.js
│   │   ├── Faculty.js
│   │   ├── Event.js
│   │   └── Announcement.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── content.js
│   │   ├── gallery.js
│   │   ├── faculty.js
│   │   ├── events.js
│   │   └── announcements.js
│   └── middleware/        # Custom middleware
│       ├── auth.js
│       └── upload.js
├── client/                # Frontend (React)
│   ├── public/
│   │   └── images/       # Static images
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/        # Page components
│   │   │   ├── Home.js
│   │   │   ├── Gallery.js
│   │   │   ├── Faculty.js
│   │   │   └── admin/    # Admin pages
│   │   ├── utils/
│   │   │   └── api.js    # API calls
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── uploads/              # User uploaded files
├── package.json          # Backend dependencies
├── .env                  # Environment variables
├── .gitignore
├── DEPLOYMENT.md         # Deployment guide
└── README.md
```

## 🔐 Admin Access

### Default Admin Setup

1. **Create admin user in MongoDB**:
   ```javascript
   {
     "username": "admin",
     "email": "admin@school.com",
     "password": "hashed_password",
     "role": "admin"
   }
   ```

2. **Or register and manually change role to "admin" in database**

3. **Login at**: http://localhost:3000/admin/login

### Admin Features
- Edit Mode toggle
- Inline content editing
- Image uploads
- Gallery management
- Faculty management
- Event management
- Announcement management

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Content
- `GET /api/content/:section` - Get content by section
- `PUT /api/content/:id` - Update content (auth required)

### Gallery
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Upload media (auth required)
- `DELETE /api/gallery/:id` - Delete media (auth required)

### Faculty
- `GET /api/faculty` - Get all faculty
- `POST /api/faculty` - Add faculty (auth required)
- `PUT /api/faculty/:id` - Update faculty (auth required)
- `DELETE /api/faculty/:id` - Delete faculty (auth required)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (auth required)
- `PUT /api/events/:id` - Update event (auth required)
- `DELETE /api/events/:id` - Delete event (auth required)

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement (auth required)
- `PUT /api/announcements/:id` - Update announcement (auth required)
- `DELETE /api/announcements/:id` - Delete announcement (auth required)

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions including:
- MongoDB Atlas setup
- Backend deployment (Render/Railway)
- Frontend deployment (Vercel/Netlify)
- Environment configuration
- Post-deployment steps

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation
- File upload restrictions
- Environment variable protection

## 🎨 Customization

### Changing Colors
Edit CSS files in `client/src/`:
- `index.css` - Global styles
- `Home.css` - Home page styles
- `Gallery.css` - Gallery styles
- Component-specific CSS files

### Adding New Sections
1. Create model in `server/models/`
2. Create routes in `server/routes/`
3. Create component in `client/src/pages/`
4. Add to navigation in `Navbar.js`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Made with ❤️ for educational institutions**
