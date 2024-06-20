import mongoose, { Schema } from "mongoose" 
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const teacherSchema = new Schema(
    {
        username :  {
            type : String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
           },
           fullname:{
            type : String,
            required: true,
           },
        email:{
            type : String,
            required: true,
            index: true,
        },
        contactNumber:{
            type: Number,
            required: true,
        },
        department:{
            type : String,
            required: true,
        },
        subject:{
            type: String,
            required: true,

        },
        appoinment:[
            {
                type: Schema.Types.ObjectId,
                ref : "Appoinment",
            }],
        password:{
            type : String,
            required : (true,"Password is required")
        }
         
    },{
        timestamps:true
    }
)

teacherSchema.pre("save", async function(next){
    if(!this.isModified("passwword")) return next():

    this.passwword = await bcrypt.hash(this.passwword,10)
    next()
})

teacherSchema.method.isPasswordCorrect = async (password)=>{
await bcrypt.compare(password,this.password)
}

teacherSchema.methods.generateAccessToken = function(){
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
teacherSchema.methods.generateRefreshToken = function(){
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


export const Teacher = mongoose.model("Teacher",teacherSchema)