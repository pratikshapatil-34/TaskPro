import User from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "147827c0acf28c8d6463c9b000cc59f4d9ef5018d5ff65d5654991a181940c5e" ;
const TOKEN_EXPIRES = '7d';

const createToken = (id) => jwt.sign(
  { id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
)

//Register Function
export async function registerUser(req,res) {
    const {name,email,password} = req.body;
    if (!name || !email ||!password){
        return res.status(400).json({success: false,message:"All fields are required"})
    }
    if(!validator .isEmail(email)){
    return res.status(400).json({success: false,message: "Invalid Email"})
    }
    if(password.length < 8){
        return res.status(400).json({success:false,message :"Password must be atleast 8 characters"})
    }
    try{
        if(await User.findOne({email})){
            return res.status(400).json({success:false,message:"User Already exists"})
        }
        const hashed = await bcrypt.hash(password,10)
        const user = await User.create({name, email, password: hashed});
        const token = createToken(user._id);

        res.status(201).json({success:true,token,user :{id:user._id,name :user.name,email:user.email}});

    }catch(err){
            console.log(err);
            res.status(500).json({success:false,message:"Server Error"});
    }
}

//Login Function
export async function userLogin(req,res){
    const {email,password} = req.body;

    if(!email || !password) {
        return res.status(400).json({success:false,message:"Email and Password required"});
    }
    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({success:false,message:"Invalid Credentials"});
        }

        const match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.status(401).json({success:false,message:"Invalid Credentials"});

        }
        const token = createToken(user._id);
        res.json({success:true,token,user:{id:user._id,name:user.name,email:user.email}});
    }
    catch(err){
        console.log(err);
        res.status(400).json({success:false,message:"Server Error"});
    }
}

export async function getCurrentUser(req,res) {
    try{
        const user = await User.findById(req.user.id).select("name email");
        if(!user){
            return res.status(400).json({success:false,message:"User not found"});
        } 
        res.json({success:true,user})
    }
   catch(err){
    console.log(err);
    res.status(400).json({success:false,message:"Server Error"});    
   } 
}
export async function updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "Both current and new passwords are required" });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "New password must be at least 8 characters long" });
    }

    try {
        // FIX 1: Use Capitalized 'User' model instead of lowercase 'user'
        const user = await User.findById(req.user.id).select("password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const match = await bcrypt.compare(currentPassword, user.password);
        
        // FIX 2: Change to (!match). Throw error when password does NOT match
        if (!match) {
            return res.status(401).json({ success: false, message: "Current password incorrect" });
        }

        // Hash and update safely
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        
        res.json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    } 
}

export async function updateProfile(req, res) {
    const { name, email, currentPassword, newPassword } = req.body;
    
    if (!name || !email || !validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Valid Name and Email required" });
    }

    try {
        // 1. Verify email uniqueness
        const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // 2. Fetch User
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 3. Optional password verification conditional handling
        if (currentPassword && newPassword) {
            if (newPassword.length < 8) {
                return res.status(400).json({ success: false, message: "New password must be at least 8 characters" });
            }
            
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                return res.status(401).json({ success: false, message: "Current password incorrect" });
            }
            
            user.password = await bcrypt.hash(newPassword, 10);
        }

        // 4. Assign profile info and commit changes
        user.name = name;
        user.email = email;
        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

    
    