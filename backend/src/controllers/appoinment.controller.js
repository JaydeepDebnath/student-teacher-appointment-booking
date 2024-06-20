import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Appoinment } from "../models/appoinment.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { response } from "express"

const bookAppoinment = asyncHandler( async (req,res)=>{
try {
    const { studentId, teacherId, datetime, notes} = req.body;

    const newAppoinment = new Appoinment({
        student:studentId,
        teacher:teacherId,
        datetime,
        notes,
    })

    await newAppoinment.save();

    return res
    .status(200)
    .json(new ApiResponse(200,newAppoinment,
    "Appoinment booked sucessfully "))

} catch (error) {
    throw new ApiError(400,error,"Appoinment not booked")
}
})

const cancelAppoinment = asyncHandler( async (req,res)=>{
    try {
        const { appoinmentId } = req.params;

        if(!appoinmentId){
            throw new ApiError(400,"Appoinment Id is required");
        }

        const deleteAppoinment = await Appoinment.findByIdAndDelte(appoinmentId);

        if(!deleteAppoinment){
            throw new ApiError(404,"Appoinment Id not found")
        }

        return res
        .status(200)
        .json(new ApiResponse(200,
        "Appoinment deleted sucessfully "))
    } catch (error) {
        throw new ApiError(400,"Appoinment could not canceled")
    }
})

// book appoinment
// cancel appoinment
// recheduled appoinment
// appoinmnetReminder
// complete