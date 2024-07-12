import {
    bookAppoinment,
    cancelAppoinment,
    rescheduledAppoinment,
    appointmentReminder,
} from '../controllers/appoinment.controller.js'
import { verifyJWT } from '../middlewares/auth.middlewares.js'

import { Router } from 'express'
import { createGoogleCalendarEvent } from '../middlewares/googleCallender.middlewares.js';

const router = Router();

router.route("/book").post(verifyJWT,bookAppoinment)
router.route("/cancel").post(verifyJWT,cancelAppoinment)
router.route("/reschedule").post(createGoogleCalendarEvent,rescheduledAppoinment)
router.route("/reminder").post(appointmentReminder)


export default router;