import express from "express";
import {
  addStudent,
  deleteStudent,
  getStudentByPhone,
  studentDetails,
  studentList,
  updateStudent,
} from "../controller/studentController.js";
import auth from "../middleware/auth.js";

const studentRoute = express.Router();

studentRoute.get("/", auth, studentList);
studentRoute.get("/:id", auth, studentDetails);
studentRoute.post("/", auth, addStudent);
studentRoute.put("/:id", auth, updateStudent);
studentRoute.delete("/:id", auth, deleteStudent);
studentRoute.get("/phone/:phone", auth, getStudentByPhone);

export default studentRoute;
