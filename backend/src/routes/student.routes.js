import {
    refreshAccessToken,
    registerStudent,
    loginStudent,
    userProfile,
    logout,
    changeCurrentPassword,
    updateAccountDetails,
    getAppoinment
} from '../controllers/student.controller.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import appoinmnetRouter from './appoinmnet.routes.js'
import { Router } from 'express'

const router = Router();

// Import router
router.route("/register").post(registerStudent)
router.route("/login").post(loginStudent)
router.route("/logout").post(verifyJWT,logout)
router.route("/profile").get(verifyJWT,userProfile)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/update").patch(verifyJWT,updateAccountDetails)

// Appoinmnet router
router.use("/appoinmnet",appoinmnetRouter)
router.route("/get-appoinment").get(verifyJWT,getAppoinment)


export default router;
