import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendEmail } from "./email.sender.";

export const sendAppoinmentReminderEmail = asyncHandler( async ( req,res )=>{
    const recipientEmail = appoinment.student.email;
    const subject = `Reminder : Appointment on ${appointment.datetime}`
    const message = `Dear ${appoinment.student.name}, \n This is a reminder for your appoinment on
    ${appoinment.datetime}. \n Regards.`;

    try {
       await sendEmail(recipientEmail , subject , message );

       return res
       .status(200)
       .json(new ApiResponse(200,
       `Reminder email sent sucessfully on this email : ${appoinment.student.email}` ))

    } catch (error) {
        throw new ApiError(403,"Failed to send reminder email");
    }
} )