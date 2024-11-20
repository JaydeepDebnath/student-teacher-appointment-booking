import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const teacherSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        contactNumber: {
            type: String, 
            required: true
        },
        department: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        },
        appoinment: [
            {
                type: Schema.Types.ObjectId,
                ref: "Appoinment" 
            }
        ],
        password: {
            type: String,
            required: true
        },
        refreshToken:{
            type:String,
        },
        role: {
            type: String,
            enum: ['admin', 'teacher'],
            default: 'teacher'
        },
        googleCredentials: {
            type: Schema.Types.Mixed,
            // required: true
        }
    },
    {
        timestamps: true
    }
);

// Hash password
teacherSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// method to check password
teacherSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate access token
teacherSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Generate refresh token
teacherSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const Teacher = mongoose.model("Teacher", teacherSchema);
