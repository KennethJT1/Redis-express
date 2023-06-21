const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();
const authRouth = require("./routes/auth");
const dashboardRouth = require("./routes/dashboard");

const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is available");
  })
  .catch((error) => {
    console.log("Database is unavailable", error);
  });

app.use(express.json());

//routes
app.use("/", authRouth);
app.use("/", dashboardRouth);

const PORT = process.env.PORT || 3434;

app.listen(PORT, console.log(`Redisexpress  listening on port ${PORT}`));
