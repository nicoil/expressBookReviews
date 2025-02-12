const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
      resolve(books);
  })
  myPromise.then((successMessage) => {
      res.send(successMessage);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve, reject) => {
      resolve(books[isbn]);
  })
  myPromise.then((successMessage) => {
      res.send(successMessage);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let myPromise = new Promise((resolve, reject) => {
      let authors = Object.values(books).filter((book) => {
          return book.author === author;
      })
      resolve(authors);
  })
  myPromise.then((successMessage) => {
      res.send(successMessage);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let myPromise = new Promise((resolve, reject) => {
      let titles = Object.values(books).filter((book) => {
          return book.title === title;
      })
      resolve(titles);
  })
  myPromise.then((successMessage) => {
      res.send(successMessage);
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book.reviews);
});

module.exports.general = public_users;
