# Todoist - Full-Stack Task Management Application

A modern, fully-functional task management application built with Next.js 16, TypeScript, Prisma, and MongoDB.

## ✨ Features

### Authentication

- ✅ Secure sign up and sign in with JWT tokens
- ✅ HTTP-only cookie-based sessions
- ✅ Protected routes with middleware
- ✅ Role-based access control (Admin/Staff)

### Dashboard

- ✅ Real-time task statistics
- ✅ Activity feed with recent changes
- ✅ Quick task overview
- ✅ Assigned tasks display

### Task Management

- ✅ Create, read, update, and delete tasks
- ✅ Task priorities (Low, Medium, High)
- ✅ Task status tracking (Pending, In Progress, Completed)
- ✅ Due date management
- ✅ Task assignments to team members
- ✅ Task history tracking
- ✅ Comments on tasks

### Project Management

- ✅ Create and manage projects
- ✅ Project-based task lists
- ✅ Task organization by lists
- ✅ Project statistics and progress tracking
- ✅ Kanban board view

### Team Management

- ✅ User management (create, update, delete)
- ✅ Team member profiles
- ✅ Task assignments
- ✅ User activity tracking

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with jose library
- **Notifications**: react-hot-toast
- **Icons**: Lucide React

## 📦 Getting Started

### Prerequisites

- Node.js 20+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/todoist?retryWrites=true&w=majority"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   NODE_ENV="development"
   ```

3. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
todoist/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── tasks/        # Task management
│   │   ├── projects/     # Project management
│   │   ├── users/        # User management
│   │   ├── dashboard/    # Dashboard data
│   │   ├── tasklists/    # Task list management
│   │   └── comments/     # Task comments
│   ├── components/       # Reusable React components
│   ├── dashboard/        # Dashboard pages
│   ├── my-tasks/         # Task pages
│   ├── projects/         # Project pages
│   ├── tasks/            # Task detail/create pages
│   ├── users/            # User management pages
│   └── signin/signup/    # Auth pages
├── lib/
│   ├── db.ts             # Database connection
│   ├── prisma.ts         # Prisma client
│   └── validations/      # Zod validation schemas
├── prisma/
│   └── schema.prisma     # Database schema
├── middleware.ts         # Authentication middleware
└── package.json
```

## 🔌 API Routes

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/logout` - Sign out user

### Tasks

- `GET /api/tasks` - Get all user's tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `PATCH /api/tasks/[id]` - Update task status
- `DELETE /api/tasks/[id]` - Delete task

### Projects

- `GET /api/projects` - Get all user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get specific project
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Task Lists

- `GET /api/tasklists?projectId=[id]` - Get lists for project
- `POST /api/tasklists` - Create new task list

### Users

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get specific user
- `PATCH /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity

### Comments

- `GET /api/comments?taskId=[id]` - Get task comments
- `POST /api/comments` - Create new comment

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ Protected API routes
- ✅ Middleware authentication
- ✅ Input validation with Zod
- ✅ SQL injection prevention (Prisma ORM)

## 🌐 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
DATABASE_URL="your-production-mongodb-url"
JWT_SECRET="your-super-secure-production-secret"
NODE_ENV="production"
```

### Recommended Platforms

- Vercel (optimized for Next.js)
- Railway
- Render
- AWS
- Digital Ocean

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

Built with ❤️ using Next.js, Prisma, and MongoDB
