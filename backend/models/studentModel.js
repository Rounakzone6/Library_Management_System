import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "book" }],
  },
  { timestamps: true },
);

const studentModel =
  mongoose.models.student || mongoose.model("student", studentSchema);

export default studentModel;
