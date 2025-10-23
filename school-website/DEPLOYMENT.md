# School Website - Deployment Guide

## 🚀 Production Deployment

This guide will help you deploy both the backend and frontend of the school website.

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (for cloud database)
- Hosting platform account (Render, Railway, Heroku, or VPS)

---

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select your preferred region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Save these credentials!

4. **Whitelist IP Addresses**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/school-website?retryWrites=true&w=majority`

---

## 🔧 Backend Deployment

### Option 1: Deploy to Render (Recommended - Free Tier Available)

1. **Prepare Backend**
   ```bash
   cd school-website
   ```

2. **Update package.json** (already configured)
   - Ensure `"start": "node server/server.js"` is in scripts

3. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

4. **Deploy on Render**
   - Go to https://render.com
   - Sign up/Login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: school-website-backend
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variables**:
       ```
       MONGODB_URI=your_mongodb_atlas_connection_string
       JWT_SECRET=your_random_secret_key_here
       PORT=5000
       NODE_ENV=production
       ```
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy your backend URL (e.g., `https://school-website-backend.onrender.com`)

### Option 2: Deploy to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables (same as above)
6. Deploy!

---

## 🎨 Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Update API URL in Frontend**
   
   Edit `client/src/utils/api.js`:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com/api';
   ```

2. **Build Frontend**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: client
     - **Build Command**: `npm run build`
     - **Output Directory**: build
     - **Environment Variables**:
       ```
       REACT_APP_API_URL=https://your-backend-url.onrender.com/api
       ```
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy to Netlify

1. Update API URL (same as above)
2. Build the project
3. Go to https://netlify.com
4. Drag and drop the `client/build` folder
5. Add environment variable in Netlify dashboard

---

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school-website
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
NODE_ENV=production
```

### Frontend (.env in client folder)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

## 📝 Post-Deployment Steps

1. **Create Admin User**
   - Use MongoDB Compass or Atlas UI
   - Connect to your database
   - Go to `users` collection
   - Create a document:
     ```json
     {
       "username": "admin",
       "email": "admin@school.com",
       "password": "$2a$10$hashed_password_here",
       "role": "admin",
       "createdAt": "2024-01-01T00:00:00.000Z"
     }
     ```
   - Or use the registration endpoint once, then change role to "admin"

2. **Test the Application**
   - Visit your frontend URL
   - Try logging in at `/admin/login`
   - Test all features

3. **Upload Initial Content**
   - Login to admin panel
   - Add hero content
   - Add about section
   - Upload gallery images
   - Add faculty members

---

## 🛠️ Local Development

```bash
# Install dependencies
cd school-website
npm install
cd client
npm install
cd ..

# Start backend (from school-website folder)
npm start

# Start frontend (in new terminal, from school-website/client folder)
cd client
npm start
```

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:3000

---

## 📁 Project Structure

```
school-website/
├── server/              # Backend
│   ├── server.js       # Main server file
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── middleware/     # Auth & upload middleware
├── client/             # Frontend (React)
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   └── utils/      # API utilities
│   └── public/         # Static files
├── uploads/            # Uploaded files (auto-created)
├── package.json        # Backend dependencies
└── .env               # Environment variables
```

---

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong MongoDB password
- [ ] Enable MongoDB IP whitelist
- [ ] Use HTTPS for production
- [ ] Keep dependencies updated
- [ ] Don't commit .env files
- [ ] Set up CORS properly
- [ ] Validate all user inputs

---

## 🐛 Troubleshooting

### Backend Issues
- **MongoDB Connection Failed**: Check connection string and IP whitelist
- **Port Already in Use**: Change PORT in .env
- **CORS Errors**: Verify frontend URL in CORS configuration

### Frontend Issues
- **API Calls Failing**: Check REACT_APP_API_URL
- **Build Errors**: Clear node_modules and reinstall
- **Images Not Loading**: Check uploads folder permissions

---

## 📞 Support

For issues or questions:
1. Check the logs in your hosting platform
2. Verify environment variables
3. Test API endpoints with Postman
4. Check MongoDB Atlas connection

---

## 🎉 You're All Set!

Your school website is now deployed and ready to use!

**Admin Panel**: `https://your-site.com/admin/login`
**Main Site**: `https://your-site.com`

Remember to:
- Regularly backup your database
- Monitor your hosting platform usage
- Keep your dependencies updated
- Test new features before deploying
