// FIX: Switched from `require` to `import` for express to align with ES module standards and resolve type errors on `req` and `res` objects.
// FIX: Import `Request` and `Response` types directly from Express for robust type safety in handlers.
import { Request, Response } from 'express';
import { teamMembersData } from './data/team';

// FIX: Use explicit `Request` and `Response` types from express for handler parameters to ensure type safety.
export const handleGetTeamMembers = (req: Request, res: Response) => {
    setTimeout(() => {
        res.json(teamMembersData);
    }, 1000); // Simulate network delay
};

// FIX: Use explicit `Request` and `Response` types from express for handler parameters to ensure type safety.
export const handleGetTeamMemberById = (req: Request, res: Response) => {
    const { memberId } = req.params;
    const member = teamMembersData.find(m => m.id === memberId);
    
    setTimeout(() => {
        if (member) {
            res.json(member);
        } else {
            res.status(404).json({ message: 'Team member not found.' });
        }
    }, 500); // Simulate network delay
};