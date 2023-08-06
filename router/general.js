const express = require('express');
let books = require("./booksdb.js");
const jwt = require('jsonwebtoken');
const public_users = express.Router();

const users = [];


public_users.post("/register", (req,res) => {
    //Write your code here
    const {username,password}=req.body;
  
    if (!username || !password){
        res.send("username and password are requried")
    }
    if (users.some(user=>user.username===username)) {
        res.status(409).send("user already exists")
    }
    users.push(username)
    return res.send("user registered sucessfully");
  });
  

public_users.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  let promise=new Promise ((resolve,reject)=>{
    setTimeout(()=>{
        resolve(books)
    },1000)
  })
  const result =await promise;
  return res.status(300).json(result);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  let isbnRating=new Promise((resolve,reject)=>{
      setTimeout(() => {
        const {isbn}=req.params
        console.log(isbn);
        let booksobj= Object.values(books[isbn])
        resolve(booksobj)
      }, 1000);
  })
  const rating =await isbnRating
  res.send(rating)   
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const auth= new Promise((resolve,reject)=>{
    const booksArray=Object.values(books);
    const bookFilter=booksArray.filter((user)=>user.author===req.params.author);
    resolve(bookFilter)
  })
  const authorPromise=await auth
  return res.status(300).json(authorPromise);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const titlePromise =new Promise((resolve,reject)=>{
    const booksArray=Object.values(books);
    const filterTitle=booksArray.filter(user=>user.title===req.params.title)
    console.log(filterTitle);
    resolve(filterTitle)
  })
  const getTitle= await titlePromise
  return res.status(300).json(getTitle);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const {isbn}=req.params;
    const review=books[isbn].reviews
    return res.status(300).json(review);
});

module.exports.general = public_users;