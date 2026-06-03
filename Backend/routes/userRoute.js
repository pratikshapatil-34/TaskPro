import express, { application } from "express"
import { getCurrentUser,registerUser,userLogin,updatePassword,updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();
//public links
userRouter.post("/register",registerUser);
userRouter.post("/login",userLogin);

//private links
userRouter.get("/me",authMiddleware,getCurrentUser);
userRouter.put("/profile",authMiddleware,updateProfile);
userRouter.put("/password",authMiddleware,updatePassword);

export default userRouter;
