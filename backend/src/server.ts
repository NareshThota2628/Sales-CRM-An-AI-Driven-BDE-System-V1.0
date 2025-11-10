// FIX: Switched from `require` to `import` for express to align with ES module standards and resolve type errors.
// FIX: Explicitly import `Express` and type the `app` object to ensure correct type resolution for middleware.
import express, { Express } from 'express';
import cors from 'cors';
import { handleLogin, handleRequestPasswordReset, handleResetPassword, handleCompleteOnboarding } from './auth';
import { handleGetTeamMembers, handleGetTeamMemberById } from './team';
import { 
    handleGetTasks, 
    handleCreateTask, 
    handleUpdateTaskStatus, 
    handleAddCommentToTask 
} from './tasks';
import { handleGetNotificationsForUser, handleMarkNotificationsAsRead } from './notifications';

const app: Express = express();
const port = 3001;

app.use(cors());
// This middleware is needed to parse JSON request bodies.
app.use(express.json());

// Auth routes
app.post('/api/auth/login', handleLogin);
app.post('/api/auth/request-password-reset', handleRequestPasswordReset);
app.post('/api/auth/reset-password', handleResetPassword);

// User routes
app.post('/api/user/complete-onboarding', handleCompleteOnboarding);

// Team routes
app.get('/api/team', handleGetTeamMembers);
app.get('/api/team/:memberId', handleGetTeamMemberById);

// Task routes
app.get('/api/tasks', handleGetTasks); // Master gets all, BDE needs userId query param
app.post('/api/tasks', handleCreateTask); // Master creates
app.put('/api/tasks/:taskId/status', handleUpdateTaskStatus); // BDE updates
app.post('/api/tasks/:taskId/comments', handleAddCommentToTask); // BDE/Master adds comment

// Notification routes
app.get('/api/notifications/:userId', handleGetNotificationsForUser);
app.post('/api/notifications/read', handleMarkNotificationsAsRead); // Use POST for action with body


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});