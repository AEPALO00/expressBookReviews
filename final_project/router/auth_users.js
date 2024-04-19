const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let user = users.filter((user) => user.username === username);

    if(user.length > 0) {
        return true
    } else {
        return false
    }
}
 
const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let user = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });

    if(user.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
      res.status(404).json({message:"Unable to login user!"});
  } else {
    if(authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data:password
        }, 'access', { expiresIn: 60 * 60 })

        req.session.authorization = {
            accessToken,username
        }

        res.status(404).json({message:"User successfully logged in!"});
    } else {
        res.status(404).json({message:"User cannot be authenticated!"})
    }
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn]
  const username = req.session.authorization.username;
  let review = req.body.review;
  review = review.trim();
  
  if(book) {
    if(review) {
        const reviews = book.reviews;
        let userHasReview = reviews[username];
  
        if(userHasReview) {
          delete reviews[username];
        }
        reviews[username] = review;
  
        book["reviews"] = reviews;
        books[isbn] = book;
  
        res.status(200).json({message:`Review added to book with ibsn ${isbn}`});
    } else {
        res.status(404).json({message:"Invalid review!"})
    }
  } else {
    res.status(404).json({message:`Book with isbn ${isbn} not found!`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn]
    const username = req.session.authorization.username;

    if(book) {
        const reviews = book.reviews;
        let userHasReview = reviews[username];
  
        if(userHasReview) {
            delete reviews[username];

            res.status(200).json({message:`Review of book with isbn ${isbn} has been deleted`});
        } else {
            res.status(404).json({message:`User's review doesn't exist for book with isbn ${isbn}`});
        }
    } else {
        res.status(404).json({message:`Book with isbn ${isbn} not found!`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
