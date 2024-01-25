const express = require("express"); //importing express module
const app = express(); //creating app instance
app.use(express.json()); // for parsing application/json

class Book {
  //initialize the Book
  constructor(title, author, ISBN) {
    this.title = title;
    this.author = author;
    this.ISBN = ISBN;
  }

  //displaying the book information
  displayInfo() {
    // Display book information
    const information = `Title: ${this.title}, Author: ${this.author}, ISBN: ${this.ISBN}`;
    return information;
  }
}

class EBook extends Book {
  //initialize the EBook
  constructor(title, author, ISBN, fileFormat) {
    super(title, author, ISBN);
    // Initialize fileFormat
    this.fileFormat = fileFormat;
  }

  //displaying the book information
  displayInfo() {
    // Override to display eBook information
    const information = `Title: ${this.title}, Author: ${this.author}, ISBN: ${this.ISBN}, FileFormat: ${this.fileFormat}`;
    return information;
  }
}

class Library {
  //initialize the Library
  constructor() {
    this.books = [];
  }
  addBook(book) {
    // Add book to library
    const newBook = book;
    this.books = [...this.books, newBook];
  }
  displayBooks() {
    // Display all books in library
    const books = this.books;
    return books;
  }
  searchByTitle(title) {
    // Search books by title
    try {
      const result = this.books.filter((eachBookObj) => {
        return eachBookObj.title.toLowerCase().includes(title.toLowerCase());
      });

      if (result.length === 0) {
        throw "No books found";
      }
      return result;
    } catch (error) {
      //   console.log(error);
      return error;
    }
  }

  deleteBook(ISBN) {
    //finding if book name exists or not
    //Handling the wrong title
    try {
      const isExists = this.books.find(
        (eachBookObj) => eachBookObj.ISBN === ISBN
      );

      console.log(isExists);
      if (isExists === undefined) {
        throw "No such book exists";
      } else {
        const result = this.books.filter((eachBookObj) => {
          return eachBookObj.ISBN !== ISBN;
        });

        this.books = [...result];
      }
      return "book deleted successfully";
    } catch (error) {
      //   console.log(error);
      return error;
    }
  }
}

//initialize the new library instance
const library = new Library();

// API Endpoints

//API for adding book
app.post("/addBook", (req, res) => {
  const { title, author, ISBN, fileFormat } = req.body;
  if (fileFormat === undefined) {
    const newBook = new Book(title, author, ISBN);
    library.addBook(newBook);
  } else {
    const newBook = new EBook(title, author, ISBN, fileFormat);
    library.addBook(newBook);
  }

  res.send("book added successfully");
});

//API for getting list of books in library
app.get("/listBooks", (req, res) => {
  res.send(library.displayBooks());
});

//API for searching books
app.get("/searchBooks", (req, res) => {
  const { search_q } = req.query;
  res.send(library.searchByTitle(search_q));
});

//deleting a book from library
app.delete("/deleteBook/:ISBN/", (req, res) => {
  const { ISBN } = req.params;
  const id = parseInt(ISBN);
  const result = library.deleteBook(id);
  res.send(result);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
