import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Teacher } from "../models/teacher.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { response } from "express"


const generateAccessAndRefreshToken = async(userId)=>
    {
        try {
          const teacher = await Teacher.findById(userId) 
          const accessToken = Teacher.generateAccessToken()
          const refreshToken = Teacher.generateRefreshToken()
    
          teacher.refreshToken = refreshToken  //get refresh token from user
          await teacher.save({validateBeforeSave : false})    // .save , save to the db.validteBeforeSave dosen't check any validation
    
          return {accessToken,refreshToken}
    
        } catch (error) {
            throw new ApiError(500,"Something went wrong while generating refresh and access token")
        }
};

const registerTeacher = asyncHandler( async ( req,res )=>{
    const { username, email, contactNumber,fullname, password , department , subject } = req.body
    if (
        [ username, email,fullname, contactNumber,department,subject, password]
        .some((field) => field?.trim() === "")
    ) {
        throw new ApiError(404,"All fileds are requird ")
    }

    const existedTeacher = await Teacher.findOne({
        $or: [{email},{contactNumber}]
    })

    if(!existedTeacher){
        throw new ApiError(400,`User with ${email} or ${contactNumber} already exists`)
    }

    const teacher = await Teacher.create({
        username: username.toLowerCase(),
        fullname,
        email,
        contactNumber,
        password,
        department,
        subject,
    })

    const createdTeacher= await Teacher.findById(teacher._id).select(
        "-password -refreshToken"
    )

    if (!createdTeacher){
        throw new ApiError(500," Something went wrong ")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdTeacher, "Teacher registered Successfully")
    )
});

const loginTeacher = asyncHandler( async (req,res)=>{
    const { username,email,contactNumber,password } = req.body

    if (!( username || email || contactNumber)){
        throw new ApiError(400,"Username or Password or Contact Number is required ")
    }

    const teacher = await Teacher.findOne({
        $or : [{username},{email},{contactNumber}]
    })

    if(!teacher){
        throw new ApiError(400,"Teacher does not exists")
    }

    const isPasswordValid = await teacher.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid user credentials")
    }

    const { accessToken,refreshToken } = await generateAccessAndRefreshToken(teacher._id)

    const loggedInUser = await Teacher.findById(teacher._id).select
    ("-password -refreshToken")

    const options = {
        httpOnly : true,   
        secure : true
       }
    
       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",refreshToken,options)
       .json(
        new ApiResponse(
            200,{
                teacher : loggedInUser,accessToken,
                refreshToken
            },
            "Teacher logged in sucessfully"
        )
       )
});

const logout = asyncHandler( async ( req,res )=>{
    await Teacher.findByIdAndUpdate(
        req.teacher._id,   // query
        {
            $set :
            {
                refreshToken : undefined      // // which method need to update in db
            }            
        },
        {
            new : true , 
        }
    )

    const options = {
        httpOnly : true,    // cookies only modifieble by db,could not from frontend 
        secure : true
       }

       return res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(new ApiResponse(200,{},"Teacher logged out"))
});

const refreshAccessToken = asyncHandler(async(req,res)=>
    {
        const incomingRefreshToken = req.cookies.
        refreshToken || req.body.refreshToken
    
        if(!incomingRefreshToken)
        {
            throw new ApiError(401,"Invalid request ")
        }
    
        const decodedToken = jwt.verify
        (incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET)
    
        const teacher = await Teacher.findById(decodedToken?._id)
    
        if(!teacher) 
        {
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !==teacher?.refreshToken)
        {
            throw new ApiError(401,"Refresh token is Expired")
        }
    
    
        const options =    
        {
            httpOnly : ture,
            secure : true
        }
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(teacher._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken},
                " Access token refreshed "
                 
            )
        )
});
    
const changeCurrentPassword = asyncHandler(async(req,
    res)=>{
        const {oldPassword,newPassword} = req.body
    
            // if (!(newPassword === confPassword)) {
            //     throw new ApiError(400,"Both password must be equal")
            // }
    
        const teacher = await Teacher.findById(req.teacher?._id)
        const isPasswordCorrect = await teacher
        .isPasswordCorrect(oldPassword)
    
        if(!isPasswordCorrect){
            throw new ApiError(400,"Invalid old password")
        }
    
        teacher.password = newPassword
        await teacher.save({validateBeforeSave : false})
    
        return res
        .status(200)
        .json(new  ApiResponse(200,{},"Password changed sucessfully"))
});

const updateAccountDetails = asyncHandler(async(req,
    res)=>{
        const {fullName,eamil,contactNumber} = req.body           // for update files , use a differnet method

        if(!(fullName || eamil || contactNumber)){
           throw new ApiError(400,"All fields are required") 
        }

        const user = await Teacher.findByIdAndUpdate(
            req.teacher?._id,
            {
                $set:{
                    fullName,
                    eamil,
                    contactNumber,
                }
            },
            {new : true}

        ).select("-password")

        return res
        .status(200)
        .json(new ApiResponse(200,user,
        "Account details updated sucessfully "))
});

const getAppoinment = asyncHandler( async ( req,res )=>{
    const getTeacherAppoinment = await Teacher.aggregate([
        {
            $match : {
                _id : new mongoose.Types.
                ObjectId(req.teacher._id)
            }
        },
        {
            $lookup:"appoinments",
            localFiled : "_id",
            foreignField: "teacher",
            as : "appoinment",
            pipeline:[
                {
                    $lookup:{
                        from:"teachers",
                        localFiled:"teacher",
                        foreignField: "_id",
                        as : "teacher",
                        
                   }
                },
                {
                    $unwind: "appoinments",
                },
                {
                    $lookup:{
                        from : "students",
                        localFiled:"appointments.student",
                        foreignField:"_id",
                        as:"appointments.student"
                    }
                },
                {
                    $project:{
                        "appointments._id": 1,
                        "appointments.datetime": 1,
                        "appointments.notes": 1,
                        "appointments.student.fullName": 1,
                        "appointments.student.username": 1,
                        "appointments.student.contactNumber": 1
                    }
                },
            ]
            
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200,getTeacherAppoinment,
    "Appointments geeting sucessfully "))
})

export {
generateAccessAndRefreshToken,
registerTeacher,
loginTeacher,
logout,
refreshAccessToken,
changeCurrentPassword,
updateAccountDetails,
getAppoinment,
}