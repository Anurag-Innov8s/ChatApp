import express from "express"
const router = express.Router()
import { signin,signup,signout } from "../controllers/authController.js"
router.post("/signup",signup)
router.post("/signin",signin)
router.post("/signout",signout)
export default router;