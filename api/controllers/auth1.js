import {db} from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = (req,res) => {
    const saltRounds = 10;
    //check exsisting user
db.query("SELECT * FROM users WHERE email = ($1) OR username=($2)" ,
            [req.body.email , req.body.username],
            (err,data)=>{
                if(err) return res.json(err)
                if(data.rows.length>0) return res.status(409).json("User already exists");
    
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            db.query("INSERT INTO users (username, email, password) VALUES ($1,$2,$3)" ,
                [
                    req.body.username,
                    req.body.email,
                    hash,
                ], (err,data)=>{
                    if(err) return res.json(err)
                    return res.status(200).json("User has been registered.")
                }
            )
        });
    });
};
export const login = (req, res) => {
    //CHECK USER
  
    const q = "SELECT * FROM users WHERE username = ($1)";
  
    db.query(q, [req.body.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.rows.length === 0) return res.status(404).json("User not found!");
  
      //Check password
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data.rows[0].password
      );
  
      if (!isPasswordCorrect)
        return res.status(400).json("Wrong username or password!");
  
      const token = jwt.sign({ id: data.rows[0].id }, "jwtkey");
      const { password, ...other } = data.rows[0];
  
      res.cookie("access_token", token, {
        httpOnly: true,
     
       // Change to true if using HTTPS
        // Adjust as needed for development/production
      }).status(200).json(other);
    });
  };

export const logout = (req, res) => {
  res.clearCookie("access_token",{
   
    secure: true, // Change to true if using HTTPS
    sameSite: 'none', 
   }).status(200).json("User has been logged out.")
};



//res.cookie("access_token", token, {
  //httpOnly: true,
//}).status(200).json(other);

//res.clearCookie("access_token",{
 // sameSite:"none",
  // secure:true
 //}).status(200).json("User has been logged out.")
