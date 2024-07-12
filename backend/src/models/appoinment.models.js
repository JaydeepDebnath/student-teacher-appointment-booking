import mongoose, { Schema } from "mongoose" ;

const appointmentSchema = new Schema({
    student:{
        type: Schema.Types.ObjectId,
        ref : "Student",
        required:true,
    },
    teacher:{
        type : Schema.Types.ObjectId,
        ref : "Teacher",
        required:true,
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
    },
    cancellationReason:{
        type : String,
        default: '',
    },
    reminders:{
        type : [String],
        required:[],
    },
},{
    timestamps: true,
});


export const Appointment = mongoose.model("Appointment",appointmentSchema)