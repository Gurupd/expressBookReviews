// auth.js
const express = require('express');
let books = require("./booksdb.js");
const regd_users = express.Router();

// Function to update an object based on ID
function updateObjectById(array, idToUpdate, updatedFields) {
    return array.map((obj) => {
      if (obj.username === idToUpdate) {
        // Merge the existing object with the updated fields
        return { ...obj, ...updatedFields };
      }
      return obj;
    });
  }
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    console.log("inside regd users", req.user);
    let bookDetail = books[req.params.isbn];
    let reviewVal = req.query.review; 
    console.log(bookDetail);
    if(bookDetail["reviews"] && bookDetail["reviews"].length){
        let review =   bookDetail["reviews"].filter((e)=> e.username == req.user.data.username);
        if(review && review.length){

            bookDetail["reviews"] =  updateObjectById(bookDetail["reviews"], review[0].username, {review: reviewVal});
            console.log("review[0]", review[0].username);
          console.log(bookDetail["reviews"]);
        }
  else{
    bookDetail["reviews"] = [...bookDetail["reviews"], ...[{review: req.query.review, username: req.user.data.username}]];
    console.log(bookDetail);
    console.log(books);
  }  
 
    }
else{
    bookDetail["reviews"] = [{review: req.query.review, username: req.user.data.username}];
    console.log(bookDetail);
    console.log(books);
}

  //Write your code here
  return res.status(200).json({message: "book review added/updated successfully", data:books});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    console.log("inside regd users", req.user);
    let bookDetail = books[req.params.isbn];
    console.log(bookDetail);
    if(bookDetail["reviews"] && bookDetail["reviews"].length){
        let reviews =   bookDetail["reviews"].filter((e)=> e.username != req.user.data.username);
     
            bookDetail["reviews"] = reviews; 
            // console.log("review[0]", review[0].username);
          console.log(bookDetail["reviews"]);

    }
else{
   return res.status(400).json({message: "no reviews found!"});
}

  //Write your code here
  return res.status(200).json({message: "book review deleted successfully", data:books});
});

module.exports.authenticated = regd_users;