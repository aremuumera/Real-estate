import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) =>{
    console.log('register operations')
        
    const {username, email, password} = req.body;
    console.log(req.body)
    
    try{
    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
        // creating a new user and saving to database
        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password:hashedPassword,
            }
        })
        console.log(newUser)
        res.status(201).json({message: "User created successfully"})
       
    }
    catch(err){
        console.log(err)
        res.status(500).json({MESSAGE: "Fail to create user"})
    }
};


export const login = async (req, res) =>{
    const {username, password} = req.body;
    try {
    // check if the user exist
        const user = await prisma.user.findUnique({
            where:{username}
        })
        if(!user) return res.status(404).json({message: "invalid credentials"})
    // check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(400).json({message: "Invalid credentials"})
    //Generate token and send to the user
        const age = 1000 * 60 * 60 * 24 * 7
        const token = jwt.sign(
            {
            id: user.id,
            isAdmin: false,
            }, 
            process.env.JWT_SECRET_KEY, 
            {expiresIn: age})

    // While logging in only we only send the username, id  and email
    const {password: userPassword, ...userInfo} = user;
        
        // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
        res.cookie("token", token, {
            httpOnly:true,
            // secure:true,
            maxAge: age,
        })
        .status(200)
        .json(userInfo)

    }
    catch(err){ 
        console.log(err)
        res.status(500).json({message: "Failed to login!"})

    }
};

export const logout = (req, res) =>{
    console.log('logout operations')
    res.clearCookie("token").status(200).json({message: "Logout successfully"})
}

