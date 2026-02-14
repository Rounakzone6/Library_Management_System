import adminModel from "../models/adminModel.js";
import studentModel from "../models/studentModel.js";
import validator from "validator";

const studentList = async (req, res) => {
  try {
    const students = await studentModel.find({});
    if (students.length === 0) {
      return res.json({
        success: false,
        message: "No students found in library.",
      });
    }
    res.json({ success: true, students });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const studentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentModel.findById(id);
    if (!student)
      return res.json({ success: false, message: "Student not found." });
    res.json({ success: true, student });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const { name, email, phone } = req.body;

    if (!name || !email || !phone)
      return res.json({ success: false, message: "Missing details." });

    if (!validator.isMobilePhone(phone, "en-IN")) {
      return res.json({
        success: false,
        message: "Phone number should be a valid Indian number",
      });
    }

    const existingStudent = await studentModel.findOne({ email });
    if (existingStudent)
      return res.json({ success: false, message: "Student already exists." });

    const newStudent = await studentModel({
      name,
      email,
      phone,
      admin: adminId,
    });
    await newStudent.save();
    await adminModel.findByIdAndUpdate(adminId, {
      $push: { students: newStudent._id },
    });

    res.json({
      success: true,
      message: "New student added",
      student: newStudent,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const updatedStudent = await studentModel.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true },
    );
    if (!updatedStudent)
      return res.json({ success: false, message: "Student not found." });
    res.json({
      success: true,
      message: "Student details updated.",
      student: updatedStudent,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentModel.findByIdAndDelete(id);
    if (!student)
      return res.json({ success: false, message: "Student not found." });

    await adminModel.updateOne({ student: id }, { $pull: { student: id } });

    res.json({ success: true, message: "Student removed." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getStudentByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const student = await studentModel.findOne({ phone });

    if (!student) {
      return res.json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, student });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  studentList,
  studentDetails,
  addStudent,
  updateStudent,
  deleteStudent,
  getStudentByPhone,
};
