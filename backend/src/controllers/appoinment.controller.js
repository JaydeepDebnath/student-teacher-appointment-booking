import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Appointment } from "../models/appoinment.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Teacher } from "../models/teacher.models.js"
import { Student } from "../models/student.models.js"
import { createGoogleCalendarEvent } from "../middlewares/googleCallender.middlewares.js"

import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { response } from "express"
import { sendAppoinmentReminderEmail } from "../emailService/reminder.service.js"


const bookAppoinment = asyncHandler( async (req,res)=>{
try {
    const userType = req.teacher._id || req.student._id;

    if (userType !== 'teacher' && userType !== 'student') {
        throw new ApiError(403, 'Unauthorized: Only teachers and students can book appointments');
    }

    const { studentId, teacherId, datetime, notes} = req.body;

    if (userType === 'teacher') {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            throw new ApiError(404, 'Teacher not found');
        }
    } else if (userType === 'student') {
        const student = await Student.findById(studentId);
        if (!student) {
            throw new ApiError(404, 'Student not found');
        }
    }

    const calenderResponse = await createGoogleCalendarEvent( req,res )
    const newAppoinment = new Appointment({
        student:studentId,
        teacher:teacherId,
        datetime,
        notes,
        location,
        description,
        startDateTime,
        endDateTime,
        googleEventId:calenderResponse.data.id,
        user:userId,
    })

    await newAppoinment.save();

    return res
    .status(200)
    .json(new ApiResponse(200,
    {googleCalendarEvent:calenderResponse.data},
    `Appoinment booked sucessfully ,\n
     Appoinment  : ${newAppoinment}` ))

} catch (error) {
    throw new ApiError(400,error,"Appoinment not booked")
}
})

// getAppoinmentDetails

const cancelAppoinment = asyncHandler( async (req,res)=>{
    try {
        const { appoinmentId , teacherId } = req.params;

        if(!appoinmentId){
            throw new ApiError(400,"Appoinment Id is required");
        }

        const deleteAppoinment = await Appointment.findByOne({
            _id:appoinmentId,
            teacher: teacherId,
        });

        if (!deleteAppoinment){
            throw new ApiError(304,"Appointment not found or does not belong to the teacher")
        }
        
        await Appointment.findByIdAndDelete(appoinmentId)

        return res
        .status(200)
        .json(new ApiResponse(200,
        "Appoinment deleted sucessfully "))
    } catch (error) {
        throw new ApiError(400,"Appoinment could not canceled")
    }
})

const rescheduledAppoinment = asyncHandler( async (req,res)=>{
    try {
        const { appoinmentId ,teacherId, datetime } = req.params;

        if(!(appoinmentId && datetime )){
            throw new ApiError(304,"Appoinment Id and Datetime is neded")
        }

        const calenderResponse = await createGoogleCalendarEvent( req,res );
        const scheduledappoinment = await Appointment.findByIdAndUpdate(
            appoinmentId,req.teacher._id,
            {
                $set:{
                   datetime,
                   status,
                   cancellationReason,
                }
            },
            { new : true }
        )

        if(!scheduledappoinment){
            throw new ApiError(300,"Rescheduled not sucessfully , please try again ....")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200,appoinmentId,"Rescheduled program updated Sucessfully",)
        )

    } catch (error) {
        throw new ApiError(404,"Error occured in rescheduling appoinment")
    }
})

const appointmentReminder = asyncHandler ( async (req,res)=>{
    try {
        const dateTime = new Date();
        const appoinment = await Appointment.find({
            'reminder.dateTime': {$lte:dateTime}
        });

        for (const appoinment of appoinments) {
            for ( const reminder of appoinment.reminder){
                if ( reminder.dateTime <= dateTime){
                    switch (reminder.type) {
                        case email:
                           try {
                            sendAppoinmentReminderEmail( appoinment,reminder )
                           } catch (error) {
                            throw new ApiError(404,"Error sending email")
                           }
                            break;
                        case sms:

                            break;
                        default:
                            break;
                    }
                }
            }
        }
        
    } catch (error) {
        throw new ApiError(404,"Reminder did not complete sucessfully ")
    }
})

export {
    bookAppoinment,
    cancelAppoinment,
    rescheduledAppoinment,
    appointmentReminder,
};

// book appoinment
// cancel appoinment
// recheduled appoinment
// appoinmnetReminder
// complete