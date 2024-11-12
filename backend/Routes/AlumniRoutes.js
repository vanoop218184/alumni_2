const express = require("express");
const AlumniControllers = require("../controllers/AlumniControllers.js");
const authmiddleware = require("../MiddleWare/auth_middleware.js");
const del = require("../MiddleWare/deljob.js");
const router = express.Router();

//protected routes
router.use("/dashdata", authmiddleware); //middleware for user authentication, it will check and return body.user with all user data
router.use("/jobs", del); // this is for deleting any job whose deadline come  to end

router.get("/", () => {
  res.send("hello Alumni from this side"); // testing route
});

//public routes
router.get("/dashdata", AlumniControllers.ProfileData); // it will return all the information of the user after proper authetication middleware
router.post("/register", AlumniControllers.Register); // it  will control the register functionality
router.post("/login", AlumniControllers.Login); // it will control the login  functionality
router.post("/add", AlumniControllers.AddNewJob); // the controller will allow alumni to add new jobs
router.put("/user/:id", AlumniControllers.Update); // this controller will allower the user to make changes in their data
router.get("/user/:id", AlumniControllers.GetData); // this will return the alumni data from thier according to their data
router.get("/gallery", AlumniControllers.GalleryImages); // this controller will return all the images in the gallery
router.get("/jobs", AlumniControllers.GetAllJobs); // this controller will return all the jobs posted by the alumni
router.get("/alum", AlumniControllers.GetAllAlumni); // this controller will return all the alumni who is connected to this website

module.exports = router;
