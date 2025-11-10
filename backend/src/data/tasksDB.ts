import { Task, TaskStatus, Comment, TaskPriority } from '../types';
import { addNotification } from './notificationsDB';
import { teamMembersData } from './team';

const initialTasks: Task[] = [
  // To Do
  { id: 'task-1', title: 'Identify 50 new prospects in the SaaS industry', priority: 'High Priority', status: 'todo', assignees: ['1', '3'], comments: [
      { id: 'c-1-1', authorId: '2', authorName: 'Benoît Dubois', authorAvatar: 'https://i.pravatar.cc/150?img=2', text: 'Let\'s aim to get this done by EOD Friday.', timestamp: '10:30 AM' }
  ] },
  { id: 'task-2', title: 'Research top 10 competitors for Q3 strategy meeting', priority: 'Important', status: 'todo', assignees: ['2'], comments: [
      { id: 'c-2-1', authorId: 'master-admin', authorName: 'Master Admin', authorAvatar: 'https://i.pravatar.cc/150?img=12', text: 'Please ensure this is comprehensive. The board will be reviewing.', timestamp: 'Yesterday' },
      { id: 'c-2-2', authorId: '2', authorName: 'Benoît Dubois', authorAvatar: 'https://i.pravatar.cc/150?img=2', text: 'Understood. I have started the initial research.', timestamp: '9:00 AM' }
  ] },
  // In Progress
  { id: 'task-5', title: 'Qualify 20 inbound leads from last week\'s marketing campaign', priority: 'High Priority', status: 'inprogress', assignees: ['1', '2'], comments: [
    { id: 'c-5-1', authorId: '1', authorName: 'Amélie Laurent', authorAvatar: 'https://i.pravatar.cc/150?img=1', text: 'Halfway through this list. Some promising ones here!', timestamp: '1:15 PM'}
  ] },
  // Completed
  { id: 'task-8', title: 'Closed deal with Innovatech Solutions ($50k ARR)', priority: 'Important', status: 'completed', assignees: ['5', '2'], comments: [
    { id: 'c-8-1', authorId: '4', authorName: 'David Garcia', authorAvatar: 'https://i.pravatar.cc/150?img=4', text: 'Great team effort on this one! 🎉', timestamp: '3 days ago'}
  ] },
];

let tasks: Task[] = [...initialTasks];

export const getTasks = () => tasks;
export const getTaskById = (id: string) => tasks.find(t => t.id === id);

export const addTask = (taskData: { title: string; priority: TaskPriority; assignees: string[] }): Task => {
    const newTask: Task = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        priority: taskData.priority,
        status: 'todo',
        assignees: taskData.assignees,
        comments: [],
    };
    tasks = [newTask, ...tasks];

    // Generate notifications for assignees
    taskData.assignees.forEach(assigneeId => {
        addNotification({
            userId: assigneeId,
            type: 'task_assigned',
            title: 'New Task Assigned to You',
            description: `A new task has been assigned: "${newTask.title}"`,
            link: '/bde/dashboard'
        });
    });

    return newTask;
};

export const updateTaskStatus = (taskId: string, newStatus: TaskStatus, userId: string): Task | null => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    const task = tasks[taskIndex];
    const user = teamMembersData.find(m => m.id === userId);

    const statusOrder: Record<TaskStatus, number> = { 'todo': 1, 'inprogress': 2, 'completed': 3 };
    
    // Enforce one-way status progression
    if (statusOrder[newStatus] < statusOrder[task.status]) {
        return null;
    }
    
    task.status = newStatus;
    tasks[taskIndex] = task;

    // Generate notifications for the master admin
    if (user) {
        if (newStatus === 'inprogress') {
             addNotification({
                userId: 'master-admin',
                type: 'task_progress',
                title: 'Task In Progress',
                description: `${user.name} has started working on task: "${task.title}"`,
                link: '/master/dashboard'
            });
        } else if (newStatus === 'completed') {
             addNotification({
                userId: 'master-admin',
                type: 'task_completed',
                title: 'Task Completed',
                description: `${user.name} has completed the task: "${task.title}"`,
                link: '/master/dashboard'
            });
        }
    }

    return task;
};

export const addCommentToTask = (taskId: string, commentData: { authorId: string, text: string }): Task | null => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    const author = teamMembersData.find(m => m.id === commentData.authorId) || { id: 'master-admin', name: 'Master Admin', avatar: 'https://i.pravatar.cc/150?img=12' };

    const newComment: Comment = {
        id: `c-${taskId}-${Date.now()}`,
        authorId: commentData.authorId,
        authorName: author.name,
        authorAvatar: author.avatar,
        text: commentData.text,
        timestamp: 'Just now',
    };

    const task = tasks[taskIndex];
    task.comments.push(newComment);
    tasks[taskIndex] = task;

    // Notify other assignees (but not the author)
    task.assignees.forEach(assigneeId => {
        if (assigneeId !== commentData.authorId) {
            addNotification({
                userId: assigneeId,
                type: 'chat_mention',
                title: `New Comment on "${task.title}"`,
                description: `${author.name}: "${commentData.text}"`,
                link: '/bde/dashboard',
            });
        }
    });

    return task;
};
