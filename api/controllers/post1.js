import {db} from "../db.js"
import jwt from "jsonwebtoken"

export const getPosts = (req, res) => {
    const q = req.query.cat ? "SELECT * FROM posts WHERE cat=($1)" : "SELECT * FROM posts";
    db.query(q, [req.query.cat], (err, data) => {
        if (err) return res.send(err);
        return res.status(200).json(data.rows); // Ensure only the rows are returned
    });
};
export const getPost = (req, res) => {
  const q = "SELECT p.id, username, title, description, p.img AS postImg, u.image AS userImg, date, cat " +
           "FROM users u " +
           "JOIN posts p ON u.id = p.uid " +
           "WHERE p.id = $1";

  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      console.error('Error executing query', err.stack);
      return res.status(500).send(err);
    }
    if (data.rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const postData = data.rows[0];
    return res.status(200).json(postData);
  });
};
  
export const addPost=(req, res)=>{
  const token=req.cookies.access_token
   if(!token) return res.status(401).json("Not authenticated!")
    jwt.verify(token , "jwtkey", (err, userInfo)=>{
  if(err)return res.status(403).json("Token is not valid!");
  const q="INSERT INTO posts(title, description, img, cat, date, uid ) VALUES ($1, $2, $3, $4, $5, $6)"
  const values=[
    req.body.title,
    req.body.description,
    req.body.img,
    req.body.cat,
    req.body.date,
    userInfo.id
  ]
  db.query(q, values, (err, data) => {
    if (err) {
        console.error('Database Error:', err); // Log the database error
        return res.status(500).json(err);
    }
    return res.json("Post has been updated.");
});
});
}

export const deletePost=(req, res)=>{
   const token=req.cookies.access_token
   if(!token) return res.status(401).json("Not authenticated!")
    jwt.verify(token , "jwtkey", (err, userInfo)=>{
  if(err)return res.status(403).json("Token is not valid!")
    
    
    const postId=req.params.id
  const q="DELETE FROM posts WHERE id=($1) AND uid=($2)";
  db.query(q, [postId, userInfo.id], (err, data)=>{
    if(err) return res.status(403).json("You can delete only your post!");
    return res.json("Post has been deleted!");
  })
    })

}



export const updatePost=(req, res)=>{
  const token=req.cookies.access_token
  if(!token) return res.status(401).json("Not authenticated!")
   jwt.verify(token , "jwtkey", (err, userInfo)=>{
 if(err)return res.status(403).json("Token is not valid!");
 const postId=req.params.id
 
 const q="UPDATE posts SET title=($1), description=($2), img=($3), cat=($4) WHERE id=($5) AND uid=($6)"
 const values=[
   req.body.title,
   req.body.description,
   req.body.img,
   req.body.cat,
  ]
 db.query(q, [...values, postId, userInfo.id], (err, data)=>{
   if(err) return res.status(500).json(err);
   return res.json("Post has been updated!")
 })
});
}


//req.params.id