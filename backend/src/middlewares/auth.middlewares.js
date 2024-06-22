import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { OAuth2Client, OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import fs from 'fs'
import { Teacher } from '../models/teacher.models.js'
import { Student } from '../models/student.models.js'

export const verifyJWT = asyncHandler( async ( req,res,next )=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token){
            throw new ApiError(401,"Unorthorized request") 
        }
    
            const decodedToken = jwt.verify
            (token,process.env.ACCESS_TOKEN_SECRET)
    
            const teacher = await Teacher.findById(decodedToken?._id)
            .select("-password -refreshToken")
            const student = await Student.findById(decodedToken?._id)
            .select("-password -refreshToken")
             
            if (!( teacher || student )){
                throw new ApiError(401,"Invalid access token")
            }
            
            if( teacher && teacher.role !== "admin"){
                throw new ApiError(403,"Not authorized as admin")
            }
            req.teacher = teacher;

            req.student = student;

            // Check if teacher has Google credentials stored
            if(!teacher.googleCredentials){
                throw new ApiError(403,"Google credentials not found for the teacher")
            }
            // Check if student has Google credentials stored
            if(!student.googleCredentials){
                throw new ApiError(403,"Google credentials not found for the student")
            }

            // Use stored credentials to authorize Google Calendar
            
            const teacherCredentials = {
                client_secret: teacher.googleCredentials.installed.client_secret,
                client_id: teacher.googleCredentials.installed.client_id,
                redirect_uris: teacher.googleCredentials.installed.redirect_uris
            };
            
            const studentCredentials = {
                client_secret: student.googleCredentials.installed.client_secret,
                client_id: student.googleCredentials.installed.client_id,
                redirect_uris: student.googleCredentials.installed.redirect_uris
            };
            
            const oAuth2Client = new OAuth2Client( teacherCredentials , studentCredentials )

            req.googleAuth = oAuth2Client;
            next()

    } catch (error) {
        throw new ApiError(404,error?.message || "Invalid access token")
    }   
})