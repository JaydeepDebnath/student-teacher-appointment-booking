import { ApiError } from "../utils/ApiError.js"
import nodemailer from 'nodemailer'
import { ApiResponse } from "../utils/ApiResponse.js";
import { Teacher } from "../models/teacher.models.js"

const transporter = nodemailer.createTransport({
    host : process.env.SMTP_SERVER_HOST,
    port : process.env.PORT,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass : process.env.SMTP_PASS,
    },
});

export const testEmail = async (to,subject,text) => {
    try {
        const info = await transporter.sendMail({
            from:process.env.SMTP_FROM_EMAIL,
            to,
            subject,
            text,
        });

        return res
        .status(201)
        .json(
            new ApiResponse(200, "Email sent successfully")
        )

    } catch (error) {
        throw new ApiError(500,"Error sending email")
    }
}


  export  const sendEmail = async (recipient, subject, text)=>{
        try {
            let info = await transporter.sendEmail({
                from :" Teacher email ",
                to : recipient,
                subject:subject,
                text:text,
            })
            return res
            .status(200)
            .json(new ApiResponse(200,
            "Email sent sucessfully" ))
            
        } catch (error) {
            throw new ApiError(403,"Error while sending Email")
        }
    }
