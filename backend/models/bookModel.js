import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    copies: { type: Number, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
  },
  { timestamps: true },
);

const bookModel = mongoose.models.book || mongoose.model("book", bookSchema);

export default bookModel;
