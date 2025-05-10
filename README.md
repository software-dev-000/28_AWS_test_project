# Image Sharing Platform

A simple image sharing platform where users can create projects and share images.

## Features
- User authentication (email + password)
- Create public/private projects
- Upload and view images
- Comment on public projects

## Tech Stack
- Frontend: React
- Backend: Express.js
- Database: AWS RDS (MySQL)
- Storage: AWS S3

## Project Structure
```
.
├── frontend/           # React frontend application
├── backend/           # Express backend server
│   ├── src/
│   │   ├── models/    # Database models
│   │   ├── routes/    # API routes
│   │   ├── config/    # Configuration files
│   │   └── migrations/# Database migrations
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (AWS RDS)
- AWS Account (for S3 and RDS)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   DB_HOST=your-rds-endpoint
   DB_USER=your-db-username
   DB_PASSWORD=your-db-password
   DB_NAME=image_sharing_db
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=your-aws-region
   S3_BUCKET_NAME=your-bucket-name
   JWT_SECRET=your-jwt-secret
   ```
4. Run database migrations:
   ```bash
   npm run migrate
   ```
5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:3001
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Projects
- GET /api/projects - Get all public projects
- POST /api/projects - Create new project
- GET /api/projects/:id - Get project details
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

### Images
- POST /api/projects/:id/images - Upload image
- GET /api/projects/:id/images - Get project images
- DELETE /api/projects/:id/images/:imageId - Delete image

### Comments
- POST /api/projects/:id/comments - Add comment
- GET /api/projects/:id/comments - Get project comments
- DELETE /api/projects/:id/comments/:commentId - Delete comment 