import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({message: "Unauthorized"}) //if there is no token

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if(err) return res.status(403).json({message: "Token is not valid"}) // there is token but not valid
        req.userId = payload.id;
        next();
    })
    

}