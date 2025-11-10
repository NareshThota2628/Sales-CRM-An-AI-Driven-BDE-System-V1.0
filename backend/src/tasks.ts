// FIX: Import `Request` and `Response` types directly from Express for robust type safety in handlers.
import { Request, Response } from 'express';
import * as tasksDB from './data/tasksDB';

export const handleGetTasks = (req: Request, res: Response) => {
    const { userId } = req.query;
    setTimeout(() => {
        if (userId) {
            // BDE gets tasks assigned to them
            const allTasks = tasksDB.getTasks();
            const userTasks = allTasks.filter(task => task.assignees.includes(userId as string));
            res.json(userTasks);
        } else {
            // Master gets all tasks
            res.json(tasksDB.getTasks());
        }
    }, 500);
};

export const handleCreateTask = (req: Request, res: Response) => {
    const { title, priority, assignees } = req.body;
    // Assuming master is creating, no user check needed for this mock
    if (!title || !priority || !assignees) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    const newTask = tasksDB.addTask({ title, priority, assignees });
    res.status(201).json(newTask);
};

export const handleUpdateTaskStatus = (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { status, userId } = req.body;
    
    if (!status || !userId) {
        return res.status(400).json({ message: 'Missing status or userId.' });
    }

    const updatedTask = tasksDB.updateTaskStatus(taskId, status, userId);
    
    if (updatedTask) {
        res.json(updatedTask);
    } else {
        res.status(400).json({ message: 'Invalid status transition or task not found.' });
    }
};

export const handleAddCommentToTask = (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { authorId, text } = req.body;

    if (!authorId || !text) {
        return res.status(400).json({ message: 'Missing authorId or text.' });
    }

    const updatedTask = tasksDB.addCommentToTask(taskId, { authorId, text });

    if (updatedTask) {
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found.' });
    }
};