# 🚀 Deployment Guide - Soccer Store

Deploy your Soccer Store to production using **GitHub**, **Render** (backend), and **Vercel** (frontend).

## 📋 Prerequisites

1. GitHub account
2. Render account (https://render.com) - Free tier available
3. Vercel account (https://vercel.com) - Free tier available

## 🔧 Step 1: Push to GitHub

1. Initialize git (if not already done):
```bash
cd /Users/apoorvbhardwaj/Desktop/vibe-commerce
git init
git add .
git commit -m "Initial commit - Soccer Store"
```

2. Create a new repository on GitHub (don't initialize with README)

3. Push to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 🖥️ Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up/login

2. Click **"New +"** → **"Web Service"**

3. Connect your GitHub repository

4. Configure the service:
   - **Name**: `soccer-store-backend` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (or set to `backend` if you want)

5. **Environment Variables** (optional, but recommended):
   - `PORT`: `5050` (Render will override this, but good to have)
   - `NODE_ENV`: `production`

6. Click **"Create Web Service"**

7. Wait for deployment to complete. Render will give you a URL like:
   `https://soccer-store-backend.onrender.com`

8. **Important**: Note down this URL - you'll need it for the frontend!

## ⚡ Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up/login with GitHub

2. Click **"Add New..."** → **"Project"**

3. Import your GitHub repository

4. Configure the project:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `build` (should auto-detect)

5. **Environment Variables**:
   - Click **"Environment Variables"**
   - Add: `REACT_APP_API_URL` = `https://YOUR_RENDER_URL.onrender.com`
     (Replace `YOUR_RENDER_URL` with your actual Render backend URL)

6. Click **"Deploy"**

7. Vercel will build and deploy your frontend. You'll get a URL like:
   `https://soccer-store.vercel.app`

## ✅ Step 4: Update Backend CORS (if needed)

Your backend already has CORS enabled, but if you need to restrict it to your Vercel domain:

1. Go to Render dashboard → Your backend service → **Environment**
2. Add environment variable:
   - `FRONTEND_URL`: `https://YOUR_VERCEL_URL.vercel.app`

3. Update `backend/server.js` to use this:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

## 🔄 Updating Your App

After making changes:

1. **Commit and push to GitHub**:
```bash
git add .
git commit -m "Your update message"
git push
```

2. **Render** will automatically redeploy your backend
3. **Vercel** will automatically redeploy your frontend

## 📝 Notes

- **Free Tier Limits**:
  - Render: Services spin down after 15 mins of inactivity (first request may be slow)
  - Vercel: Unlimited deployments, great performance

- **Database**: SQLite database is stored on Render's filesystem. For production, consider upgrading to PostgreSQL.

- **Environment Variables**: Keep sensitive data in Render/Vercel environment variables, not in code.

## 🎉 You're Live!

Your Soccer Store is now live at your Vercel URL!

