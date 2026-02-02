# Todoist Application - Setup and Deployment Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Environment Setup

1. Create a `.env` file in the root directory:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/todoist?retryWrites=true&w=majority"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Database

```bash
npx prisma generate
npx prisma db push
```

### Step 4: Run Development Server

```bash
npm run dev
```

### Step 5: Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Database Setup Options

### Option 1: MongoDB Atlas (Recommended - Free Tier Available)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free Tier)
4. Go to Database Access → Add New Database User
5. Go to Network Access → Add IP Address (allow from anywhere: 0.0.0.0/0)
6. Go to Databases → Connect → Connect your application
7. Copy the connection string and update `.env`

Example connection string:

```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/todoist?retryWrites=true&w=majority
```

### Option 2: Local MongoDB

1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use this connection string in `.env`:

```
DATABASE_URL="mongodb://localhost:27017/todoist"
```

---

## 🔐 Creating Your First Account

1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Fill in:
   - Name: Your full name
   - Email: Your email address
   - Password: At least 8 characters
3. Click "Create account"
4. You'll be automatically logged in and redirected to the dashboard

---

## 📝 Application Workflow

### 1. Creating Your First Project

1. Go to **Projects** page
2. Click "Create Project" button
3. Enter:
   - Project Name (e.g., "Marketing Campaign")
   - Description (optional)
4. Click "Create Project"

### 2. Adding Task Lists to Projects

1. Open a project
2. Click "Add Task List" or "Create List"
3. Enter list name (e.g., "To Do", "In Progress", "Done")
4. Task lists help organize tasks within a project

### 3. Creating Tasks

**Option A: From Projects Page**

1. Go to a project
2. Select a task list
3. Click "Add Task"
4. Fill in task details

**Option B: From "Add Task" Button**

1. Click "Add Task" in sidebar
2. Fill in:
   - Task Title (required)
   - Description
   - Priority (Low, Medium, High)
   - Status (Pending, In Progress, Completed)
   - Project (required)
   - Task List (required)
   - Assign To (required)
   - Due Date (optional)
3. Click "Create Task"

### 4. Managing Tasks

- **View All Tasks**: Go to "My Tasks" page
- **Update Task**: Click on a task to open details, edit and save
- **Change Status**: Click status dropdown to update
- **Delete Task**: Click delete button on task card
- **Add Comments**: Open task details and add comments

### 5. Team Collaboration

1. Go to **Team Members** page
2. Click "Add User" to invite team members
3. Assign tasks to team members
4. View team member profiles and activity

---

## 🎨 Using the Application

### Dashboard

- View task statistics (total, completed today, in progress, overdue)
- See assigned tasks that need attention
- Monitor recent activity across all projects

### My Tasks

- Filter tasks by status (All, Today, Pending, In Progress, Completed)
- Sort by due date or priority
- Quick actions: complete, edit, or delete tasks

### Projects

- View all your projects
- See project progress (completed/total tasks)
- Filter projects by status
- Access project board view for Kanban-style management

### Task Details

- View complete task information
- See task history (who changed what and when)
- Read and add comments
- Update task properties
- View related project and assignee information

---

## 🔧 Development Workflow

### Making Database Changes

1. Update `prisma/schema.prisma`
2. Run: `npx prisma db push`
3. Run: `npx prisma generate`

### Adding New API Routes

1. Create file in `app/api/[route-name]/route.ts`
2. Implement HTTP methods (GET, POST, PUT, PATCH, DELETE)
3. Use authentication helper functions
4. Return JSON responses

### Adding New Pages

1. Create folder in `app/[page-name]/`
2. Add `page.tsx` file
3. Import and use Sidebar and Header components
4. Fetch data from API routes
5. Handle loading and error states

---

## 🚢 Production Deployment

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   ```
   DATABASE_URL=your-production-mongodb-url
   JWT_SECRET=your-production-secret
   NODE_ENV=production
   ```
5. Deploy!

### Railway Deployment

1. Go to [Railway](https://railway.app)
2. Create new project from GitHub
3. Add environment variables
4. Deploy automatically

### Environment Variables for Production

**Required:**

- `DATABASE_URL`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string (use [this generator](https://randomkeygen.com/))
- `NODE_ENV`: Set to "production"

**Security Note:** Never commit `.env` file to version control. Always use environment variables in production.

---

## 🐛 Troubleshooting

### "Cannot connect to database"

- Verify DATABASE_URL is correct
- Check MongoDB service is running
- Verify network access in MongoDB Atlas
- Run `npx prisma db push` again

### "Authentication failed" or "Token invalid"

- Clear browser cookies
- Check JWT_SECRET is set correctly
- Ensure JWT_SECRET doesn't contain special characters that need escaping

### "Module not found" errors

- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` folder and run `npm install` again
- Clear Next.js cache: delete `.next` folder

### Page is blank or not loading

- Check browser console for errors
- Verify API routes are returning data (use browser DevTools → Network tab)
- Check if user is authenticated (localStorage should have 'user' and 'tokenExpiry')

### Tasks not showing up

- Verify user is signed in
- Check that projects and task lists exist
- Ensure tasks are assigned to the correct user
- Check database for data: use MongoDB Compass or Atlas UI

---

## 📊 Database Seeding (Optional)

To quickly populate the database with sample data:

1. Create a seed script `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const password = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password,
      role: "ADMIN",
    },
  });

  // Create project
  const project = await prisma.project.create({
    data: {
      projectName: "Sample Project",
      description: "This is a sample project",
      createdBy: user1.id,
    },
  });

  // Create task list
  const taskList = await prisma.taskList.create({
    data: {
      projectId: project.id,
      listName: "To Do",
    },
  });

  // Create task
  await prisma.task.create({
    data: {
      listId: taskList.id,
      assignedTo: user1.id,
      title: "Sample Task",
      description: "This is a sample task",
      priority: "Medium",
      status: "Pending",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

2. Add to `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

3. Run: `npm install -D ts-node`
4. Run: `npx prisma db seed`

---

## 🔍 API Testing

Use tools like:

- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **Thunder Client** (VS Code extension)

Example API test:

```bash
# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get tasks
curl http://localhost:3000/api/tasks \
  -H "Cookie: token=YOUR_TOKEN_HERE"
```

---

## 📞 Support

For issues or questions:

1. Check this guide first
2. Review error messages in browser console
3. Check server logs in terminal
4. Search existing issues in repository
5. Create a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Error messages
   - Screenshots (if applicable)

---

## ✅ Checklist for Going Live

- [ ] Database is set up and accessible
- [ ] Environment variables are configured
- [ ] All dependencies are installed
- [ ] Prisma schema is generated and pushed
- [ ] Application runs locally without errors
- [ ] At least one user account exists
- [ ] JWT_SECRET is strong and unique
- [ ] Production environment variables are set
- [ ] Application is deployed and accessible
- [ ] HTTPS is enabled
- [ ] Error logging is configured
- [ ] Backup strategy is in place

---

**Congratulations! Your Todoist application is now fully functional! 🎉**

Start organizing your tasks and boost your productivity!
