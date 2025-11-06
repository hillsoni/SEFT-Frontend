# SEFT Frontend-Backend Integration Setup Guide

## ✅ Integration Complete!

Your SEFT-Frontend and SEFT-Backend are now fully integrated with proper API connections.

## 📋 Prerequisites

1. **Backend Running**: Make sure your SEFT-Backend is running on `http://localhost:5000`
2. **Database**: Ensure PostgreSQL database is configured and running
3. **Environment Variables**: Backend `.env` file should be configured

## 🚀 Quick Start

### 1. Configure Frontend API URL

Create a `.env` file in `SEFT-Frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If your backend runs on a different port, update the URL accordingly.

### 2. Install Frontend Dependencies

```bash
cd SEFT-Frontend
npm install
```

### 3. Start Backend Server

```bash
cd SEFT-Backend
python run.py
```

The backend should start on `http://localhost:5000`

### 4. Start Frontend Development Server

```bash
cd SEFT-Frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔗 Integrated Features

### ✅ Authentication
- **Login**: `/api/auth/login` - JWT token authentication
- **Register**: `/api/auth/register` - User registration
- **Logout**: `/api/auth/logout` - Token blacklisting
- **Profile**: `/api/auth/profile` - Get/Update user profile

### ✅ Diet Plans
- **Generate**: `/api/diet/generate` - AI-powered diet plan generation
- **Get All**: `/api/diet/` - Retrieve user's diet plans
- **Get Latest**: `/api/diet/latest` - Get most recent plan

### ✅ Chatbot
- **Send Query**: `/api/chatbot/query` - Ask diet/nutrition questions
- **Get History**: `/api/chatbot/history` - View chat history
- **Statistics**: `/api/chatbot/statistics` - Get chat stats

### ✅ Protected Routes
All routes require JWT authentication:
- Dashboard
- Diet Plans
- Workout/Yoga/Meditation
- Challenges
- Routine

## 📁 File Structure

```
SEFT-Frontend/
├── src/
│   ├── api.js              # ✅ API integration with all endpoints
│   ├── context/
│   │   └── AuthContext.jsx # ✅ Backend JWT authentication
│   ├── pages/
│   │   ├── Login.jsx       # ✅ Backend login integration
│   │   ├── Register.jsx    # ✅ Backend registration
│   │   └── Diet.jsx        # ✅ Backend diet plan generation
│   └── components/
│       └── Chatbot.jsx     # ✅ Backend AI chatbot
└── App.jsx                 # ✅ Private routes with AuthProvider
```

## 🔧 API Configuration

The API base URL is configured in `src/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
```

To change the API URL, create a `.env` file in `SEFT-Frontend/`:

```env
VITE_API_BASE_URL=http://your-backend-url/api
```

## 🧪 Testing the Integration

1. **Register a new user**:
   - Go to `/register`
   - Fill in username, email, password
   - Submit and check backend database

2. **Login**:
   - Go to `/login`
   - Enter credentials
   - Check browser console for JWT token in localStorage

3. **Generate Diet Plan**:
   - Login first
   - Go to `/diet`
   - Fill form and submit
   - Check backend API logs for Gemini AI call

4. **Use Chatbot**:
   - Click chatbot icon
   - Ask diet/nutrition questions
   - Check backend for saved queries

## 🐛 Troubleshooting

### Frontend can't connect to backend
- Check backend is running: `http://localhost:5000/health`
- Verify CORS is enabled in backend (already configured)
- Check API URL in `.env` file

### Authentication not working
- Check JWT token in localStorage: `localStorage.getItem('access_token')`
- Verify token expiration (1 hour default)
- Check backend logs for authentication errors

### Diet plan generation fails
- Ensure Gemini API key is set in backend `.env`
- Check backend logs for API errors
- Verify user is logged in (JWT token present)

### Chatbot not responding
- Verify user is authenticated
- Check backend Gemini service is configured
- Ensure question contains diet-related keywords

## 📝 Notes

- All API calls include JWT token automatically via axios interceptors
- Token is stored in `localStorage` as `access_token`
- User data is stored in `localStorage` as `user`
- 401 errors automatically redirect to login page
- All protected routes require valid JWT token

## 🎉 Success!

Your frontend and backend are now fully integrated! All API calls go through your SEFT-Backend with proper authentication.


