import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export default async function authMiddleware(req, res, next) {
    // Grab the token from the Authorization header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
        success : false, 
        message : "Unauthorized, token missing"
        });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify & User Object
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select("-password");
        
        if(!user){
        return res.status(401).json({
        success : false, 
        message : "User not found!"
        });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('JWT verification failed',error);
        res.status(401).json({
            success : false,
            message : "Token expired"
        })  
    }

}