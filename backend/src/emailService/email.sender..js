import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {nodemailer} from 'nodemailer'

const transporter = nodemailer.createTransport({
    host : process.env.SMTP_SERVER_HOST, // Replace with your SMTP server host
    port : process.env.PORT,
    secure:false,
    auth:{
        user : teacher.email,
        pass : teacher.password,
    },
})


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
