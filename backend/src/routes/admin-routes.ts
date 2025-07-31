import express, { Request, Response } from "express";
import AdminAuthMiddleware from "../middleware/admin-auth-middleware";
import isAdminUser from "../middleware/admin-middleware";

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userName: string;
        role: string;
    };
}

const router = express.Router();

router.get('/welcome-admin', AdminAuthMiddleware, isAdminUser, (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the admin dashboard",
        user: req.userInfo
    });
});

export default router; 