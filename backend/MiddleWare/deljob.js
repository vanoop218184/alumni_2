const moment = require("moment"); //  nodejs package for managing date and time
const Job = require("../Models/Job.js");
const deleteOldJobs = async (req, res, next) => {
  try {
    const currentDate = moment().format("YYYY-MM-DD"); // accuring data in the give format ,same format i have taken while posting job ,in form of job deadline
    const result = await Job.deleteMany({ date: { $lt: currentDate } }); // this  will delte all the jobs whose deadline date is less than current date
    next(); // calls another middleware
  } catch (error) {
    next(); // same here also calling the next middleware
  }
};
module.exports = deleteOldJobs;
