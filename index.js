// import connectToMongo from "./db";
const express = require("express");
const connectToMongo = require("./db");
const app = express();
const cors = require("cors");

app.get("/", (req, res) => {
  res.send("site loading ");
});

app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(3001, () => {
  console.log("connection established at port 3000");
});

connectToMongo();
