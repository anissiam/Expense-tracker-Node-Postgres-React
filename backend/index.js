import cors from "cors"
import express from "express"
import dotenv from "dotenv"
import routes from "./routes/index.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000;

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-v1", routes);

app.get("/", (req, res) => {
 res.status(200).send({
     message: "Running"
 })
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});