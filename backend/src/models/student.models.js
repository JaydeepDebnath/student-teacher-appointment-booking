import mongoose, { Schema } from "mongoose" 
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const studentSchema = new Schema(
    {
       name :  {
        type : String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true
       },
       email:{
        class: String,
        required: true,
       },
       class:{
        trype: String,
        required: true,
        lowercase:true,
        index: true,
       },
       depertment:{
        type : String,
        required: true,
        index : true,
       },
       subject:{
        type : String,
        required: true,
        index : true,
       },
       achademic_year:{
        type : String,
        required: true,
        index : true,
       },
       registration:[
        {
            type: Schema.Types.ObjectId,
            ref : "Registration"
        }
       ],
       appoinment:[
        {
            type: Schema.Types.ObjectId,
            ref : "Appoinment",
        }
       ],
       contactNumber:{
        type:Number,
        required: true,
       },
       passwword:{
        type: String,
        required: [true,"Password is required"]
       } ,
       refreshToken:{
        type: String
       }
    },{
        timestamps:true,
    }
)

// hooks 
studentSchema.pre("save", async function(next){
    if(!this.isModified("passwword")) return next():

    this.passwword = await bcrypt.hash(this.passwword,10)
    next()
})

studentSchema.method.isPasswordCorrect = async (password)=>{
await bcrypt.compare(password,this.password)
}

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.username,
            contactNumber: this.contactNumber
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Student = mongoose.model("Student",studentSchema)
