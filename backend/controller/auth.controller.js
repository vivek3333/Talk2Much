import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req,res) =>{
    try {
        const { fullName, userName, password, confirmPassword, gender} = req.body;

        
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passwords don't match" });
		}

        const user = await User.findOne({ userName });

        if (user) {
			return res.status(400).json({ error: "UserName already exists" });
		}
        
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);


        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?userName=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?userName=${userName}`;

        const newUser = new User({
            fullName,
            userName,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });
        
        if (newUser) {
            
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();
            
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profilePic: newUser.profilePic,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log("error in signup controllerrrr", error.message);
        res.status(500).json({error:"error internal server"});
    }
}

export const login = async (req,res) =>{
    try {
        const {userName, password} = req.body;
        const user = await User.findOne({userName});
        const isParrwordCorrect = await bcrypt.compare(password , user?.password || "");

        if(!user || !isParrwordCorrect){
            return res.status(400).json({error:"invalid username or password"});

        }
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({error:"error internal server"});
    }
}

export const logout = async (req,res) =>{
    try {
        res.cookie("jwt","", {maxAge:0})
        res.status(200).json({message:"Loggout successfully"});
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({error:"error internal server"});
    }
}


