// FIX: Switched from `require` to `import` for express to align with ES module standards and resolve type errors on `req` and `res` objects.
// FIX: Import `Request` and `Response` types directly from Express for robust type safety in handlers.
import { Request, Response } from 'express';
import { UserRole } from './types';

interface MockUser {
    name: string;
    role: UserRole;
}

const mockUsers: { [email: string]: MockUser } = {
  'master@highq.com': {
    name: 'Master Admin',
    role: UserRole.MASTERCLASS,
  },
  'bde@highq.com': {
    name: 'Amélie Laurent',
    role: UserRole.BDE,
  },
};

// FIX: Use explicit `Request` and `Response` types from express for handler parameters to ensure type safety.
export const handleLogin = (req: Request, res: Response) => {
    const { email, password } = req.body;
    setTimeout(() => {
        if (mockUsers[email] && password === 'password123') {
            res.json(mockUsers[email]);
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    }, 1500);
};

// FIX: Use explicit `Request` and `Response` types from express for handler parameters to ensure type safety.
export const handleRequestPasswordReset = (req: Request, res: Response) => {
    const { email } = req.body;
    setTimeout(() => {
      // console.log(`Password reset requested for: ${email}. If this email is registered, a reset link would be sent.`);
      res.status(200).json({ message: 'Password reset request received.' });
    }, 1500);
};

// FIX: Use explicit `Request` and `Response` types from express for handler parameters to ensure type safety.
export const handleResetPassword = (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    setTimeout(() => {
        if (token === 'dummy-token-123') {
            // console.log(`Password has been reset with new password: ${newPassword} for token: ${token}`);
            res.status(200).json({ message: 'Password has been reset successfully.' });
        } else {
            res.status(400).json({ message: 'Invalid or expired reset token.' });
        }
    }, 1500);
};

// FIX: Use explicit `Request` and `Response` types from express for handler parameters to ensure type safety.
export const handleCompleteOnboarding = (req: Request, res: Response) => {
    const { workspaceName } = req.body;
    setTimeout(() => {
        // console.log(`Onboarding completed with workspace name: "${workspaceName}"`);
        res.status(200).json({ message: 'Onboarding completed successfully.' });
    }, 1000);
};