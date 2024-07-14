import jwt from "jsonwebtoken"


export const userLoggedIn = async (req, res) =>{
    console.log(req.userId)
    res.status(200).json({message: "you are Authenticated"}); // you are Authenticated

}


export const AdminLoggedIn = async (req, res) =>{
    const token = req.cookies.token
    if(!token) return res.status(401).json({message: "Unauthorized route"}) //if there is no token

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err) return res.status(403).json({message: "Token is not valid"}) // there is token but not valid
        if(!payload.isAdmin) return res.status(403).json({message: "You are not authorized to access this route"}) // for admin

    })
    res.status(200).json({message: "you are Authenticated for this route"}); // you are Authenticated
}