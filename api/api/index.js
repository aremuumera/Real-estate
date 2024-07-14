import express from "express";
import postRoute from '../routes/post.route.js'
import authRoute from '../routes/auth.route.js'
import testRoute from '../routes/test.route.js'
import useRoute from '../routes/user.route.js'
import chatRoute from '../routes/chat.route.js'
import messageRoute from '../routes/message.route.js'
import cookieParser from "cookie-parser";
import cors from 'cors'


const app = express();

app.use(cors({
    // origin:"http://localhost:5174",
    origin: "https://real-estate-three-orcin.vercel.app",
    credentials:true,            
    optionSuccessStatus:200
}))
app.use(express.json());
app.use(cookieParser());


app.use("/api/posts", postRoute );
app.use("/api/auth", authRoute );
app.use("/api/test", testRoute );
app.use("/api/users", useRoute );
app.use("/api/chats", chatRoute);
app.use("/api/message", messageRoute);


app.get("/", (req, res) => {
  res.send("Welcome to your Yikes estate");
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
})