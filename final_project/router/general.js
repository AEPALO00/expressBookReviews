const express = require('express');
// let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const connectDB = async () => {
    try {
        const response = await axios.get("http://localhost:3000/data");
        const data = response.data;
    
        return data;
    } catch(err) {
        return err;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
      res.status(404).json({message:"Unable to register user!"});
  } else {
      // Check if user doesn't already exist
      if(!isValid(username)) {
        users.push({"username":username,"password":password});
        res.status(200).json({message:"User registered successfully. Now you can login."})
      } else {
        res.status(404).json({message:"User already exists!"});
      }
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
    let books = await connectDB();
    books = books[0];
    return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    let books = await connectDB();
    books = books[0];
    const isbn = parseInt(req.params.isbn);
    let bookIsbn = books[isbn];

    if(bookIsbn) {
        return res.send(bookIsbn);
    } else {
        return res.status(404).json({message:`Book with ISBN ${isbn} not found!`});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
    let books = await connectDB();
    books = books[0];
    const author = req.params.author.replaceAll("-"," ");
    let bookAuthor = null;

    for (const [key, value] of Object.entries(books)) {
        if (value["author"] === author) {
            bookAuthor = value;
        }
    }

    if(bookAuthor) {
        return res.send(bookAuthor)
    } else {
        return res.status(404).json({message:`Author ${author} not found!`});
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
    let books = await connectDB();
    books = books[0];
    const title = req.params.title.replaceAll("-"," ");
    let bookTitle = null;

    for (const [key, value] of Object.entries(books)) {
        if (value["title"] === title) {
            bookTitle = value;
        }
    }

    if(bookTitle) {
        return res.send(bookTitle);
    } else {
        return res.status(404).json({message:`Book with title ${title} not found!`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  let bookIsbn = books[isbn];
  let reviews = "";

  for(var ii; 0 < bookIsbn.reviews.length; ii++) {
    reviews += bookIsbn.reviews[ii];
    reviews += "\n"
  }

  if(reviews === "") {
    reviews = "No reviews yet for this book!"
  }

  return res.send(`${bookIsbn.title} reviews:\n ${reviews}`);
});

module.exports.general = public_users;
