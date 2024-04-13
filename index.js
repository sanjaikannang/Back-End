import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./connectMongoDB.js";
import userRoutes from "./Routes/userRoutes.js"

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user',userRoutes);

// app.use('/',(req, res) => {
//     res.send("This ia an Startoon Labs Project !!!")
// })

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
