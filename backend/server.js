const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { authorization } = require("./middlewares/auth");

const dotenv = require('dotenv').config();
const port = process.env.PORT;

// Connexion à la DB
connectDB();

const app = express();

// Middlewares
app.use(cors("*"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use(authorization);
app.use("/posts", require("./routes/post.routes"));
app.use("/users", require("./routes/user.routes"));

// Lancer le serveur
app.listen(port, () => {
  console.log("Le serveur a démarré au port " + port);
});
