const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    let bookIsbn = books[isbn];

    return res.send(bookIsbn);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.replaceAll("-"," ");
  let bookAuthor = null;

  console.log(author)
  
  for (const [key, value] of Object.entries(books)) {
    if (value["author"] === author) {
        bookAuthor = value;
    }
  }

  if(bookAuthor) {
    return res.send(bookAuthor);
  } else {
    return res.send(`Author ${author} not found!`);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.replaceAll("-"," ");
  let bookTitle = null;
  console.log(title)
  for (const [key, value] of Object.entries(books)) {
    if (value["title"] === title) {
        bookTitle = value;
    }
  }

  if(bookTitle) {
    return res.send(bookTitle);
  } else {
    return res.send(`Book with title ${title} not found!`);
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
