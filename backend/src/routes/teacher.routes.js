import {
    registerTeacher,
    loginTeacher,
    logout,
    userProfile,
    changeCurrentPassword,
    updateAccountDetails,
    getAppoinment,
    } from '../controllers/teacher.controllers.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'
import appoinmnetRouter from './appoinmnet.routes.js'
import { Router } from 'express'

const router = Router();

// Teacher routes
router.route("/register").post(registerTeacher)
router.route("/login").post(loginTeacher)
router.route("/profile").get(verifyJWT,userProfile)
router.route("/logout").post(verifyJWT,logout)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/update").patch(verifyJWT , updateAccountDetails)

// Appoinmnet routes
router.use("/appoinmnet",appoinmnetRouter)
router.route("/get-appoinmnet").patch(verifyJWT , getAppoinment)

export default router


