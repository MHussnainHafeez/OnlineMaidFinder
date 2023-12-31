// Client  model

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have greater than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "please Enter Your email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "please Enter Your Password"],
        minLength: [8, "Password should have greater than 8 characters"],
        select: false

    },
      role: {
        type: String,
        default: "client",

    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
  
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})
// hash password 
clientSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// JWT Token
clientSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// Compare Password
clientSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generating Password Reset Token
clientSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes (20).toString("hex");
    // Hashing and adding reset Password Token to userSchema
    this.resetPasswordToken = crypto
    .createHash ("sha256")
    .update (resetToken)
    .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
    };

module.exports = mongoose.model("Client", clientSchema);