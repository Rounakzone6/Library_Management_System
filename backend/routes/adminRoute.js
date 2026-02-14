import express from "express";
import {
  login,
  register,
  adminDetails,
  updateAdmin,
  deleteAdmin,
} from "../controller/adminController.js";

const adminRoute = express.Router();

adminRoute.get("/", adminDetails);
adminRoute.post("/register", register);
adminRoute.post("/login", login);
adminRoute.put("/:id", updateAdmin);
adminRoute.delete("/:id", deleteAdmin);

export default adminRoute;
