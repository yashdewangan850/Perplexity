import jwt from "jsonwebtoken";

export function authUser(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Debug Logs
        console.log("========== AUTH MIDDLEWARE ==========");
        console.log("Token:", token);
        console.log("Decoded Token:", decoded);
        console.log("====================================");

        req.user = decoded;

        next();
    } catch (err) {
        console.error("JWT Error:", err.message);

        return res.status(401).json({
            message: "Unauthorized",
            success: false,
            err: "Invalid token"
        });
    }
}