import { Task, TaskStatus, Comment, TaskPriority } from '../types';
import { addNotification } from './notificationsDB';
import { teamMembersData } from './team';

const initialTasks: Task[] = [];

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