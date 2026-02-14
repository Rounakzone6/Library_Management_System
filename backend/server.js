import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/connectDB.js";
import bookRoute from "./routes/bookRoute.js";
import adminRoute from "./routes/adminRoute.js";
import studentRoute from "./routes/studentRoute.js";

const port = process.env.PORT || 4000;
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/admin", adminRoute);
app.use("/students", studentRoute);
app.use("/books", bookRoute);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
