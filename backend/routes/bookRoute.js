import express from "express";
import {
  addBook,
  bookDetails,
  bookList,
  deleteBook,
  issueBook,
  updateBook,
} from "../controller/bookController.js";
import auth from "../middleware/auth.js";

const bookRoute = express.Router();

bookRoute.get("/", auth, bookList);
bookRoute.get("/:id", auth, bookDetails);
bookRoute.post("/", auth, addBook);
bookRoute.put("/:id", auth, updateBook);
bookRoute.delete("/:id", auth, deleteBook);
bookRoute.post("/issue", auth, issueBook);

export default bookRoute;
