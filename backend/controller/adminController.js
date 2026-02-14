import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.json({ success: false, message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new adminModel({
      name,
      email,
      password: hashedPassword,
    });

    const admin = await newAdmin.save();
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      admin: { name: admin.name, email: admin.email },
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password required",
      });
    }
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Admin does not exist" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
        admin: { name: admin.name, email: admin.email },
        message: "Login Successful",
      });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await adminModel.findById(id).select("-password");
    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }
    res.json({ success: true, admin });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const updatedAdmin = await adminModel
      .findByIdAndUpdate(id, { name, email }, { new: true })
      .select("-password");
    if (!updatedAdmin) {
      return res.json({ success: false, message: "Admin not found" });
    }
    res.json({
      success: true,
      message: "Profile Updated",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await adminModel.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.json({ success: false, message: "Admin not found" });
    }
    res.json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { register, login, adminDetails, updateAdmin, deleteAdmin };
