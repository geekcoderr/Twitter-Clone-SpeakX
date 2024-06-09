import express from "express";
import { fetchLastState, fetchLastStatusJSON, register, signIn, signOut } from "../controllers/authControllers.js";
import { authSecurity } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/me', authSecurity, fetchLastState);
router.get('/me-raw',authSecurity,fetchLastStatusJSON);
router.post('/login', signIn);
router.post('/logout', signOut);
router.post('/signup', register);

export default router;
