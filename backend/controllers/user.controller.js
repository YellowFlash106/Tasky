import User from "../models/user.model.js";
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const TOKEN_EXPIRES = '24h';

const createToken = (userId) => jwt.sign({id: userId }, JWT_SECRET,{ expiresIn : TOKEN_EXPIRES});

// Register User
export async function registerUser(req, res){
    const { name , email, password } = req.body;
    if(!name || !email || !password){
      return res.status(400).json({
        success : false,
        message : "All fields are required"
      })
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
        success : false,
        message : "Invalid Email"
      })
    }

    if(password.length < 6){
        return res.status(400).json({
        success : false,
        message : "Password must be atleast 6 Characters"
      })
    }
    try {
       if(await User.findOne({email})){
          return res.status(400).json({
           success : false,
           message : "User already exists"
         })  
       }  
       const hashed = await bcrypt.hash(password , 10);
       const user = await User.create({ name, email, password: hashed});
       const token = createToken(user._id);

       res.status(201).json({
        success : true,
        token, 
        user : {id : user._id, name : user.name, email : user.email}
       })

    } catch (error) {
        console.log('Error in registerUser Controller',error);
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
        
    }
}

// Login User
export async function loginUser(req, res) {
    const { email, password} = req.body;
    if(!email || !password){
       return res.status(400).json({
        success : false,
        message : "All fields are required"
      })    
    }

    try {
        const user = await User.findOne({email});
        if(!user){
           return res.status(401).json({
           success : false,
           message : "Invalid credentials"
           })
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
        return res.status(400).json({
        success : false,
        message : "Password does not match!"
        })
        }

        const token = createToken(user._id);
        return res.status(200).json({
        success : true, 
        token, 
        user : { id: user._id, name: user.name, email: user.email}
        })

    } catch (error) {
        console.log('Error in loginUser Controller',error);
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

// Get Current User
export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user._id).select("name email");
        if(!user){
          return res.status(400).json({
          success : false,
          message : "User not found!"
          })  
        }
        res.json({ success : true, user});
    } catch (error) {
        console.log('Error in getCurrentUser Controller',error);
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

// Update Profile 
export async function updateProfile(req, res) {
    const {name, email} = req.body;
    if(!name || !email || !validator.isEmail(email)){
      return res.status(400).json({
      success : false,
      message : "Please enter valid name and email"
      })
    }

  try {
    // check if another user already uses this email
    const exists = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email is already used!"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select("name email");

    res.json({ success: true, user });

    } catch (error) {
        console.log('Error in updateProfile Controller',error);
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
}

// Change Password
export async function changePassword(req, res) {

    const {currPassword, newPassword} = req.body;
    if(!currPassword || !newPassword || newPassword.length < 6){
      return res.status(400).json({
      success : false,
      message : "Password invalid or too short!"
      })
    }

    try {
        const user = await User.findById(req.user.id).select("password");
        if(!user){
          return res.status(400).json({
          success : false,
          message : "User not found!"
          })
        }

        const match = await bcrypt.compare(currPassword, user.password);
        if(!match){
          return res.status(400).json({
          success : false,
          message : "Current Password incorrect!"
          })
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: true, message: "Password changed successfully."})
    } catch (error) {
        console.log('Error in changePassword Controller',error);
        res.status(500).json({
            success : false,
            message : "Internal Server Error"
        })    
    }
}