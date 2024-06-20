import mongoose, { Schema } from "mongoose" 
import jwt from "jsonwebtoken"

const appoinmentSchema = new Schema({
    student:{
        type: Schema.Types.ObjectId,
        ref : "Student",
        required : true,
    },
    teacher:{
        type : Schema.Types.ObjectId,
        ref : "Teacher",
        required : true,
    },
    dateTime : {
        type : Date,
        required : true,
    },
    status :{
        type : String,
        enum:['scheduled', 'canceled', 'completed'],
        default : 'scheduled'
    },
    notes :{
        type : String,
        default : '',
    }
},{
    timestamps: true,
})


const Appoinment = mongoose.model("Appoinment",appoinmentSchema)