const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Book = require('../models/Book_model');

/**
 * @route GET ''.
 * @desc Hitting the home endpoint .
 */
router.get('/', ()=>{
  console.log('Home endpoint hit...');
  res.send('Welcome to Fabian´s library system');
});

/**
 * @route GET 'get-all-books'.
 * @desc Returning an array of all books.
 */
router.get('/get-all-books', async (req, res) => {
  try {
    // As the list of books can contain many books, instead of finding all as a bunch, it streams the data.
    let stream_of_all_books = await Book.find({},{ __v: 0,},{}).cursor();     
    let found_books = [];

    // Pushing a new document into a new array as it comes.
    stream_of_all_books.on("data", (doc) =>{                   
      found_books.push(doc);
    });

    // Sending all documents when finishing fetching them.
    stream_of_all_books.on("close",  ()=> {
      console.log(found_books);
      return res.status(200).send(found_books);
    });
    
  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
});

/**
 * @route POST 'create-book'.
 * @desc Saving a single book that did not exist before.
 */
router.post('/create-book',  [
  // Validating that the necessary properties are not empty
  check("title", "Should not be empty").notEmpty().trim(),
  check("author", "Should not be empty").notEmpty().trim(),
  check("year", "Should be number, not empty").trim().isNumeric(),
  check("number_pages",  "Should be number, not empty").trim().isNumeric(),
  check("cover", "Should not be empty").notEmpty().trim(),
  check("description", "Should not be empty").notEmpty().trim()
], async (req, res) => {

  // Returning an error array as a response if any error
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }

  // Creating a new Book document if all properties were received
  try {
    const new_book = new Book({
      title: req.body.title,
      author: req.body.author,
      year: +req.body.year,
      number_pages: +req.body.number_pages,
      cover: req.body.cover,
      description: req.body.description
     });
  
     //Saving data into MongoDB
     const saved_book = await new_book.save();
    


    // As the list of books can contain many books, instead of finding all as a bunch, it streams the data.
    let stream_of_all_books = await Book.find({},{ __v: 0,},{}).cursor();     
    let found_books = [];

    // Pushing a new document into a new array as it comes.
    stream_of_all_books.on("data", (doc) =>{                   
      found_books.push(doc);
    });

    // Sending all documents when finishing fetching them.
    stream_of_all_books.on("close",  ()=> {
      console.log("Saved book: ", saved_book);
      return res.status(200).send([{saved_book},found_books]);
    
    });

   

  } catch (error) {
    // Printing and sending the error response if any
    console.log(error);
    return res.status(400).json({error});
  }  
});

/**
 * @route POST 'edit-book'.
 * @desc Editing a single book that did not exist before.
 */
router.post('/edit-book',  [
  // Validating that the necessary properties are not empty
  check("title", "Should not be empty").notEmpty().trim(),
  check("author", "Should not be empty").notEmpty().trim(),
  check("id", "Should not be empty").notEmpty().trim(),
  check("year", "Should be number, not empty").trim().isNumeric(),
  check("number_pages",  "Should be number, not empty").trim().isNumeric(),
  check("cover", "Should not be empty").notEmpty().trim(),
  check("description", "Should not be empty").notEmpty().trim()
], async (req, res) => {

  // Returning an error array as a response if any error
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }
  
  // Editing the found Book document if all properties were received
  try {
    let found_book = await Book.findById(req.body.id);

    // Sending the error as a response if the book does not exist
    if(!found_book){
      return res.status(400).send("Book not found");
    }

    // Editing the found Book document
    found_book.title = req.body.title;
    found_book.author= req.body.author;
    found_book.year= +req.body.year;
    found_book.number_pages= +req.body.number_pages;     
    found_book.cover= req.body.cover;
    found_book.description= req.body.description;     
  
    // Saving book and sending the response
    const saved_book = await found_book.save();
  




    // As the list of books can contain many books, instead of finding all as a bunch, it streams the data.
    let stream_of_all_books = await Book.find({},{ __v: 0,},{}).cursor();     
    let found_books = [];

    // Pushing a new document into a new array as it comes.
    stream_of_all_books.on("data", (doc) =>{                   
      found_books.push(doc);
    });

    // Sending all documents when finishing fetching them.
    stream_of_all_books.on("close",  ()=> {
      console.log("Edited book: ", saved_book);
      return res.status(200).send([{saved_book},found_books]);
    
    });









  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }  
});

/**
 * @route DELETE 'delete-book'.
 * @desc Deleting a book.
 */
router.delete('/delete-book',  [
  // Validating that the ID if the book is present
  check("id", "Should not be empty").notEmpty().trim()  
], async (req, res) => {

  // Sending error as a response if any error
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }
  
  try {

    // Verifying that the book id exists in the DB
    let book_to_be_deleted = await Book.findById(req.body.id);

    // If does not exist, we send the error response
    if(!book_to_be_deleted){
      console.log("Book not found");
      return res.status(400).send("Trying to delete a book not found, nothing happened");
    }

    // If book exists, we remove it and confirm by printing the id and sending the document as a response
   await book_to_be_deleted.remove();








    // As the list of books can contain many books, instead of finding all as a bunch, it streams the data.
    let stream_of_all_books = await Book.find({},{ __v: 0,},{}).cursor();     
    let found_books = [];

    // Pushing a new document into a new array as it comes.
    stream_of_all_books.on("data", (doc) =>{                   
      found_books.push(doc);
    });

    // Sending all documents when finishing fetching them.
    stream_of_all_books.on("close",  ()=> {
      console.log("Deleted book: " ,book_to_be_deleted);
      return res.status(200).send([{deleted_book: book_to_be_deleted},found_books]);
    
    });




  


  } catch (error) {
    console.log(error);
    return res.status(400).json({error});
  }
});

module.exports = router;