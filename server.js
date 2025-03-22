require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let otpStore = {}; // Stores OTP temporarily

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASSWORD, // App password
    },
});

// Send OTP API
app.post("/send-otp", (req, res) => {
    let { email } = req.body;
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;

    let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, message: "Failed to send OTP" });
        }
        res.status(200).json({ success: true, message: "OTP sent successfully", otp: otp }); // Remove OTP from response in production
    });
});

// Verify OTP API
app.post("/verify-otp", (req, res) => {
    let { email, otp } = req.body;

    if (otpStore[email] && otpStore[email] === otp) {
        delete otpStore[email]; // Remove OTP after verification
        return res.status(200).json({ success: true, message: "✅ OTP Verified!" });
    }
    res.status(400).json({ success: false, message: "❌ Invalid OTP" });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
