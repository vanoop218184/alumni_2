const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();
require("./Config/config.js");
const cors = require("cors"); 
app.use(express.json()); // it parse the incoming JSON data ,make it available into req.body
app.use(cors());//it is a security feauture built into web browsers  to control  how resources are accesssed  across differnt browsers,
app.use(bodyParser.urlencoded({ extended: true })); // it parse the form data and make it available in req.body
app.use(bodyParser.json());// old version of express.json ,they are doing same work
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));// same as bodyparser
const UserRoutes = require("./Routes/AlumniRoutes.js");
const PORT = process.env.PORT || 8001;
app.use("/alumni", UserRoutes); // starting middleware

app.listen(PORT, () => {
  console.log(`server is running on port number ${PORT}`);
});

