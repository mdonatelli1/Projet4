const dotenv = require('dotenv').config();

const connectDB = require("./config/db");
const express = require("express");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const port = process.env.PORT;

// Connexion à la DB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("L'API est connectée !");
});

app.use("/api", router);

app.get("*", (req, res) => {
  res.status(404).json({ message: "Not Found !" });
});

// Lancer le serveur
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Le serveur a démarré au port " + port);
  }
});
