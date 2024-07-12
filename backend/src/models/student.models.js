import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const studentSchema = new Schema(
    {
        name: {
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
        studentClass: {
            type: String,
            required: true,
            lowercase: true,
            index: true
        },
        department: {
            type: String,
            required: true,
            index: true
        },
        subject: {
            type: String,
            required: true,
            index: true
        },
        academicYear: { 
            type: String,
            required: true,
            index: true
        },
        registration: [
            {
                type: Schema.Types.ObjectId,
                ref: "Registration"
            }
        ],
        appointment: [
            {
                type: Schema.Types.ObjectId,
                ref: "Appointment"
            }
        ],
        contactNumber: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Hooks
studentSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// method to check password
studentSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate access token
studentSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            contactNumber: this.contactNumber
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Generate refresh token
studentSchema.methods.generateRefreshToken = function() {
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

export const Student = mongoose.model("Student", studentSchema);
