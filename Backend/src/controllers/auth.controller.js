import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js";


// export async function register (req,res) {
//     const {username,email,password}=req.body;


//      const isUserAlreadyExists = await userModel.findOne({
//         $or: [ { email }, { username } ]
//     })

//     if (isUserAlreadyExists) {
//         return res.status(400).json({
//             message: "User with this email or username already exists",
//             success: false,
//             err: "User already exists"
//         })
//     }

//     const user = await userModel.create({ username, email, password })
//      const emailVerificationToken = jwt.sign({
//         email: user.email,
//     }, process.env.JWT_SECRET)

//     await sendEmail({
//         to: email,
//         subject: "Welcome to Perplexity!",
//         html: `
//                 <p>Hi ${username},</p>
//                 <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
//                 <p>Please verify your email address by clicking the link below:</p>
//                 <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
//                 <p>If you did not create an account, please ignore this email.</p>
//                 <p>Best regards,<br>The Perplexity Team</p>
//         `
//     })

//     res.status(201).json({
//         message: "User registered successfully",
//         success: true,
//         user: {
//             id: user._id,
//             username: user.username,
//             email: user.email
//         }
//     });
// }
export async function register(req, res) {
    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        });
    }

    const user = await userModel.create({
        username,
        email,
        password,
        verified: true // Temporary
    });

    // Email sending temporary disable
    /*
    const emailVerificationToken = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET
    );

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `
            <p>Hi ${username}</p>
            <a href="https://perplexity-1-5xj4.onrender.com/api/auth/verify-email?token=${emailVerificationToken}">
                Verify Email
            </a>
        `
    });
    */

    return res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


export async function login(req, res) {
    console.log("===== LOGIN REQUEST =====");
    console.log("Body:", req.body);

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    console.log("Searching Email:", email);

    const allUsers = await userModel.find();

    console.log("All Users Count:", allUsers.length);

    allUsers.forEach((u) => {
        console.log({
            id: u._id.toString(),
            email: u.email,
            username: u.username,
            verified: u.verified,
        });
    });

    const user = await userModel.find({ email });

    console.log("Matched User:", user);

    if (user.length === 0) {
        console.log("❌ User not found");
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found",
        });
    }

    const currentUser = user[0];

    const isPasswordMatch = await currentUser.comparePassword(password);

    console.log("Password Match:", isPasswordMatch);
    console.log("Verified:", currentUser.verified);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
        });
    }

    if (!currentUser.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
        });
    }

    const token = jwt.sign(
        {
            id: currentUser._id,
            username: currentUser.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: currentUser._id,
            username: currentUser.username,
            email: currentUser.email,
        },
    });
}



//  * @desc Get current logged in user's details
//  * @route GET /api/auth/get-me
//  * @access Private

export async function getMe(req, res) {
    console.log("========== GET ME ==========");
    console.log("Decoded Token:", req.user);

    const userId = req.user.id;
    console.log("User ID:", userId);

    const user = await userModel.findById(userId).select("-password");

    console.log("User From DB:", user);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        });
    }

    return res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    });
}


export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;

        await user.save();

        const html =
            `
        <h1>Email Verified Successfully!</h1>
        <p>Your email has been verified. You can now log in to your account.</p>
        <a href="http://localhost:3000/login">Go to Login</a>
    `

        return res.send(html);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}
