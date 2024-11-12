const jwt = require("jsonwebtoken");
const User = require("../Models/User.js");
const Job = require("../Models/Job.js");
const Gal = require("../Models/Gal.js");
const bcrypt = require("bcrypt");
const moment = require("moment");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

cloudinary.config({
  cloud_name: process.env.Cloud_name,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SEC,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "alumni_pictures",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage: storage }).single("picture");
class AlumniControllers {
 static Register = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      const { batch, company, email, link, name, password, phone, position } =
        req.body;
      const picture = req.file ? req.file.path : null;

      try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          return res.send({ status: "failed", message: "Already Registered" });
        }

        if (
          name &&
          email &&
          password &&
          phone &&
          company &&
          position &&
          link &&
          batch &&
          picture
        ) {
          // Create new user instance
          let user = new User({
            batch,
            company,
            email,
            link,
            name,
            phone,
            position,
            picture,
            password,
          });
          console.log(picture);
          let result = await user.save();
          result = await result.toObject();

          let saved_user = await User.findOne({ email: email });
          delete saved_user.password;
          saved_user = saved_user.toObject();

          const token = jwt.sign(
            { USER_id: saved_user._id },
            process.env.JWT_TOKEN,
            { expiresIn: "7d" }
          );
          res.send({
            status: "Passed",
            message: "Registered Successfully",
            token: token,
            picture: saved_user.picture, // Return the Cloudinary URL in response
          });
        } else {
          res.send({
            status: "failed",
            message: "All data are necessary to be filled",
          });
        }
      } catch (error) {
        console.log(error);
        res.send({ status: "failed", message: "Some Internal Error" });
      }
    });
  }
  static Login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    if (password && email) {
      const user = await User.findOne({ email: email });
      if (user) {
        const ismatch = await bcrypt.compare(password, user.password);
        if (ismatch) {
          const token = jwt.sign({ USER_id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: "7d",
          });
          res.send({
            status: "Passed",
            message: "Login Successfully",
            token: token,
          });
        } else {
          res.send({
            status: "failed",
            message: "either password or Email is wrong",
          });
        }
      } else {
        res.send({ status: "failed", message: "Invalid email or password" });
      }
    } else {
      res.send({ status: "failed", message: "All field are required" });
    }
  };
  static AddNewJob = async (req, res) => {
    let newjob = new Job(req.body);
    let result = await newjob.save();
    if (result) {
      res.send(result);
    } else {
      res.send({ error: "getting some error from server side" });
    }
  };
  static Update = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      const id = req.params.id;
      const { batch, company, email, link, name, phone, position } = req.body;
      console.log(req.file);
      const picture = req.file ? req.file.filename : null; // Store filename if file is uploaded

      try {
        let updateData = {
          batch,
          company,
          email,
          link,
          name,
          phone,
          position,
        };

        // If a new picture is uploaded, add it to the updateData
        if (picture) {
          updateData.picture = picture;
        }

        // Update user information in the database
        let result = await User.updateOne(
          { _id: id },
          { $set: updateData },
          { new: true }
        );
        if (result.nModified > 0) {
          const user = await User.findOne({ _id: id });
          if (user) {
            res.send(user);
          } else {
            res.send({ error: "no data updated" });
          }
        } else {
          res.send({ error: "no data updated" });
        }
      } catch (error) {
        res.send({ status: "failed", message: error.message });
      }
    });
  };

  static GetData = async (req, res) => {
    let result = await User.findOne({ _id: req.params.id }, { new: true });
    if (result) {
      res.send(result);
    }
  };
  static GalleryImages = async (req, res) => {
    const result = await Gal.find();
    res.send(result);
  };
  static GetAllJobs = async (req, res) => {
    const currentDate = moment().format("YYYY-MM-DD");
    console.log(currentDate);
    const result = await Job.find({
      date: { $gte: currentDate },
    });
    res.send(result);
  };
  static GetAllAlumni = async (req, res) => {
    const result = await User.find();
    res.send(result);
  };
  static ProfileData = async (req, res) => {
    res.json({ user: req.user });
  };
}

module.exports = AlumniControllers;
