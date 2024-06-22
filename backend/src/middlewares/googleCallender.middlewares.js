import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import Teacher from '../models/teacher.model.js';

// Load client secrets from a local file 
const credentials = JSON.parse(fs.readFileSync('credentials.json'))
const { client_secret,client_id,redirect_uris } = credentials.installed;

const oAuth2Client = new OAuth2Client( client_id,client_secret,redirect_uris[0] )

// Middlewares to aurthorize Google calender access for teacher

export const authorizeGoogleCalendar = asyncHandler( async ( req,res,next )=>{
    try {
        const teacherId = req.teacher._id;
        const teacher = await Teacher.findById(teacherId).select('googleCredentials')

        if (!teacher || !teacher.googleCredentials) {
            throw new ApiError(403, "Google credentials not found for the teacher");
        }

        const { client_id,client_secret,redirect_uris } = teacher.googleCredentials.installed;
        const oAuth2Client = new OAuth2Client( client_id,client_secret,redirect_uris[0] )

        if (!oAuth2Client.credentials){
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type:'offline',
                scope:'https://www.googleapis.com/auth/calendar.events'
            })

            res.redirect(authUrl)
        }else{
            req.googleAuth = oAuth2Client;
            next();
        }

    } catch (error) {
        throw new ApiError(403,error.status || error.message || "Error authorizing Google Calendar")
    }
});

export const handleGoogleCallback = asyncHandler( async ( req,res,next )=>{
    const code = req.query.code;
    if(!code){
        throw new ApiError(400,"Authorization code is missing ")
    }

    try {
        const { tokens } = await oAuth2Client.getToken(code)
        oAuth2Client.setCredentials(tokens);

        // Save updated tokens
        const teacherId = req.teacher._id;
        const teacher = await Teacher.findById(teacherId)
        
        teacher.googleCredentials.tokens = tokens;
        await teacher.save();

        req.googleAuth = oAuth2Client;
        next();
    } catch (error) {
        throw new ApiError(500,"Error retriieving access token by Google")
    }
})

// Create an event in google Calender

export const createGoogleCalendarEvent = asyncHandler( async ( req,res,next )=>{
    const calendar = google.calendar({version:'v3',auth:req.googleAuth });
    const event = {
        summary : summary ||"Sample Event",
        location: location || "Sample Location",
        description : description || "Sample description",
        start: {
            dateTime : new Date().toISOString(),
            timeZone : 'America/Los_Angeles',
            },
        end:{
            dateTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
            timeZone:'America/Los_Angeles',
            },
        reminders:{
            useDefault : false,
            overrides:[
                { method:'email',minutes: 24 * 60 },
                { method:'popup',minutes: 10},
            ]
        },
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,  
        })

        res.status(200)
        .json({ message: 'Event created', 
                eventLink: response.data.htmlLink 
            });
        
    } catch (error) {
        throw new ApiError(500,`Error creating event: ${error.message}`)
    }
});