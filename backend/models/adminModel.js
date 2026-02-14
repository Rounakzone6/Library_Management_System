import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "book" }],
  },
  { timestamps: true },
);

const adminModel =
  mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
