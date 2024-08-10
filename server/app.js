const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3040;
require("dotenv").config();

//================ Enabling express to use body of the request ================================
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Adjust the limit as needed
app.use(express.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//================ CORS ================================
const cors = require("cors");
app.use(cors());

// =============== DATABASE CONNECTION =====================
const mongoose = require("mongoose");
// to print incoming requests from mongoose in the terminal
mongoose.set('debug', true);
async function connecting() {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to the DB");
  } catch (error) {
    console.log(
      "ERROR: Seems like your DB is not running, please start it up !!!"
    );
  }
}
connecting();

// =============== ROUTES ==============================
app.use("/users", require("./routes/users.routes"));
app.use("/recipes", require("./routes/recipes.routes"));

// =============== START SERVER =====================
app.listen(port, () => console.log(`server listening on port ${port}`));
