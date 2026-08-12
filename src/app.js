require("dotenv").config();

const express = require("express");

const app = express();

const urlRoutes = require("./routes/url.routes");

app.use(express.json());

app.use("/", urlRoutes);

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

module.exports = app;