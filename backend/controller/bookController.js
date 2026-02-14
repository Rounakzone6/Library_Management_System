import adminModel from "../models/adminModel.js";
import bookModel from "../models/bookModel.js";
import studentModel from "../models/studentModel.js";

const bookList = async (req, res) => {
  try {
    const books = await bookModel.find({});
    if (books.length === 0) {
      return res.json({
        success: false,
        message: "No books found in library.",
      });
    }
    res.json({ success: true, books });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const bookDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);
    if (!book) {
      return res.json({ success: false, message: "Book not found." });
    }
    res.json({ success: true, book });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Invalid Book ID" });
  }
};

const addBook = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { title, author, category, copies } = req.body;
    const existingBook = await bookModel.findOne({ title });
    if (existingBook) {
      return res.json({ success: false, message: "Book already exists." });
    }
    const newBook = new bookModel({
      title,
      author,
      category,
      copies,
      admin: adminId,
    });
    await newBook.save();
    await adminModel.findByIdAndUpdate(adminId, {
      $push: { books: newBook._id },
    });
    res.json({
      success: true,
      message: "Book added successfully.",
      book: newBook,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, category, copies } = req.body;
    const updatedBook = await bookModel.findByIdAndUpdate(
      id,
      { title, author, category, copies },
      { new: true },
    );
    if (!updatedBook) {
      return res.json({ success: false, message: "Book not found." });
    }
    res.json({
      success: true,
      message: "Book details updated.",
      book: updatedBook,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookModel.findByIdAndDelete(id);
    if (!book) {
      return res.json({ success: false, message: "Book not found." });
    }
    await adminModel.updateOne({ books: id }, { $pull: { books: id } });

    res.json({ success: true, message: "Book removed." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const issueBook = async (req, res) => {
  try {
    const { studentId, bookIds } = req.body;

    const student = await studentModel.findById(studentId);
    if (!student)
      return res.json({ success: false, message: "Student not found" });
    for (const bookId of bookIds) {
      const book = await bookModel.findById(bookId);

      if (book && book.copies > 0) {
        book.copies -= 1;
        await book.save();
        student.books = student.books || [];
        student.books.push(book._id);
      } else {
        return res.json({
          success: false,
          message: `Book "${book.title}" is out of stock.`,
        });
      }
    }
    await student.save();

    res.json({ success: true, message: "Books issued successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { bookList, bookDetails, addBook, updateBook, deleteBook, issueBook };
