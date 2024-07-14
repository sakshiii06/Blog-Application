import express from "express"
import authRoutes from "./routes/auth1.js"
import userRoutes from "./routes/users1.js"
import postRoutes from "./routes/posts1.js"
import cookieParser from "cookie-parser"
import cors from "cors";
import multer from "multer";
const app=express();
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials:true,
    // Replace with your frontend origin
  }));

app.use(express.json())
app.use(cookieParser({withCredentials: true}))
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
   
    cb(null, Date.now()+file.originalname)
  }
})
const upload =multer({ storage})
app.post("/api/upload", upload.single("file"), function(req, res){
  const file=req.file
res.status(200).json(file.filename);
})
app.use("/api/auth1",  authRoutes)
app.use("/api/users1",  userRoutes)
app.use("/api/posts1",  postRoutes)
app.listen(8800,()=>{
    console.log("Connected!")
})


//{withCredentials: true}