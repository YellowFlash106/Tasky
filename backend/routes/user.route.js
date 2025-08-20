import express from 'express'
import { changePassword, 
         getCurrentUser, 
         loginUser, 
         registerUser, 
         updateProfile 
       } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';


const userRouter = express.Router();

// Public Links 
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Private Links Procect also
userRouter.get("/me",authMiddleware, getCurrentUser);
userRouter.put("/profile", authMiddleware, updateProfile);
userRouter.put("/password", authMiddleware, changePassword);

export default userRouter;