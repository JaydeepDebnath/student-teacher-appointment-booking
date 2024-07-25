import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Student } from "../models/student.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshToken = async(studentId)=>
    {
        try {
          const student = await Student.findById(studentId) 
          const accessToken = student.generateAccessToken()
          const refreshToken = student.generateRefreshToken()
    
          student.refreshToken = refreshToken  //get refresh token from user
          await student.save({validateBeforeSave : false})    // .save , save to the db.validteBeforeSave dosen't check any validation
    
          return {accessToken,refreshToken}
    
        } catch (error) {
            throw new ApiError(500,"Something went wrong while generating refresh and access token")
        }
};

const registerStudent = asyncHandler( async ( req,res )=>{
    const { name, email,studentClass , contactNumber, password , department ,achademic_year, subject } = req.body
    console.log(req.body)
    if (
        [ name, email,studentClass, contactNumber,department,subject, achademic_year, password]
        .some((field) => field?.trim() === "")
    ) {
        throw new ApiError(404,"All fileds are requird ")
    }

    // const existedStudent = await Student.findOne({
    //     $or: [{email},{name}]
    // })

    // if(!existedStudent){
    //     throw new ApiError(400,`User with ${email} or ${contactNumber} or already exists`)
    // }

    const student = await Student.create({
        name,
        email,
        studentClass,
        contactNumber,
        password,
        department,
        subject,
        achademic_year,
    })

    const createdStudent = await Student.findById(student._id).select(
        "-password -refreshToken"
    )

    if (!createdStudent){
        throw new ApiError(500," Something went wrong ")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdStudent, "Student details registered Successfully")
    )
});


const loginStudent = asyncHandler( async (req,res)=>{
    const { name,password,email } = req.body;
    console.log(req.body);
    
    if (!( name || email )){
        throw new ApiError(400,"Contact Number or Password is required ")
    }

    const student = await Student.findOne({
        $or : [{name},{email}]
    });

    if(!student){
        throw new ApiError(400,"Student does not exists")
    }

    const isPasswordValid = await student.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid user credentials")
    }

    const { accessToken,refreshToken } = await generateAccessAndRefreshToken(student._id)

    const loggedInStudent = await Student.findById(student._id).select
    ("-password -refreshToken");

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
                student : loggedInStudent,accessToken,refreshToken
            },
            "Student logged in sucessfully"
        )
       )
});

const logout = asyncHandler( async ( req,res )=>{
    await Student.findByIdAndUpdate(
        req.student._id,   // query
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
    
        const student = await Student.findById(decodedToken?._id)
    
        if(!student) 
        {
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken !==student?.refreshToken)
        {
            throw new ApiError(401,"Refresh token is Expired")
        }
    
    
        const options =    
        {
            httpOnly : ture,
            secure : true
        }
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(student._id)
    
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
    
        const student = await Student.findById(req.student?._id)
        const isPasswordCorrect = await student
        .isPasswordCorrect(oldPassword)
    
        if(!isPasswordCorrect){
            throw new ApiError(400,"Invalid old password")
        }
    
        student.password = newPassword
        await student.save({validateBeforeSave : false})
    
        return res
        .status(200)
        .json(new  ApiResponse(200,{},"Password changed sucessfully"))
});

const updateAccountDetails = asyncHandler(async(req,
    res)=>{
        const {name,department,eamil,contactNumber} = req.body           // for update files , use a differnet method

        if(!(name || eamil || department || contactNumber)){
           throw new ApiError(400,"Any of these fields are required") 
        }

        const student = await Student.findByIdAndUpdate(
            req.student?._id,
            {
                $set:{
                    name,
                    eamil,
                    department,
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
    const getStudentAppoinment = await Student.aggregate([
        {
            $match : {
                _id : new mongoose.Types.
                ObjectId(req.student._id)
            }
        },
        {
            $lookup:"appoinments",
            localFiled : "_id",
            foreignField: "student",
            as : "appoinment",
            pipeline:[
                {
                    $lookup:{
                        from:"students",
                        localFiled:"student",
                        foreignField: "_id",
                        as : "student",
                        
                   }
                },
                {
                    $unwind: "appoinments",
                },
                {
                    $lookup:{
                        from : "teachers",
                        localFiled:"appointments.teacher",
                        foreignField:"_id",
                        as:"appointments.student"
                    }
                },
                {
                    $project:{
                        "appointments._id": 1,
                        "appointments.datetime": 1,
                        "appointments.notes": 1,
                        "appointments.teacher.username": 1,
                        "appointments.teacher.contactNumber": 1
                    }
                },
            ]
            
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200,getStudentAppoinment,
    "Appointments geeting sucessfully "))
});



export {
    generateAccessAndRefreshToken,
    refreshAccessToken,
    registerStudent,
    loginStudent,
    logout,
    changeCurrentPassword,
    updateAccountDetails,
    getAppoinment
}