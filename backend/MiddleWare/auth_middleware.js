const jwt = require("jsonwebtoken");
const User = require("../Models/User.js");
// this middle is for user authentication
const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers; // destructuring the headers and accessin the authorisation value
  if (authorization && authorization.startsWith("Bearer")) {
    // it checks if autherisation value is present or not ,if present then is it statring from bearer
    try {
      token = authorization.split(" ")[1]; // splittin g the authorisation on the basis of space bw bearer and token,after this at index 1 token will be avialable
      const { USER_id } = jwt.verify(
        token,
        process.env.JWT_TOKEN,
        async (err, user) => {
          // this function is verifing token send from the forntend is valid or not ,if it is valid the it will return the values ,that we have used while making token
          if (err) {
            res.send({ status: "failed", message: "Some Internal Error" }); // if token is invalid then it will return this response
          } else {
            req.user = await User.findById(user.USER_id).select("-password"); // if token is verified, then is will find the user data  from id and add the all info in req.body
          }
          next(); // calling next middleware
        }
      );
    } catch (error) {
      res.send({ status: "failed", message: "Unauthorized User" }); // sending response to frontend
    }
  } else {
    res.send({ status: "failed", message: "Unauthorized user" }); // sendigng response to frotnend
  }
};
module.exports = checkUserAuth;
