import User from '../Models/user.model.js'
import jwt from 'jsonwebtoken'
//import expressJwt from 'express-jwt'
import { expressjwt } from "express-jwt";
import config from '../config/config.js'
const signin = async (req, res) => {
    try {
        let user = await User.findOne({ "email": req.body.email }) 
        if (!user)
        return res.status('401').json({ error: "User not found" }) 
        if (!user.authenticate(req.body.password)) {
        return res.status('401').send({ error: "Email and password don't match." })
        }
        const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, role: user.role  }, config.jwtSecret) 
        res.cookie('t', token, { expire: new Date() + 9999 }) 
        return res.json({
        token, 
        user: {
        _id: user._id, 
        name: user.name,
        email: user.email, 
        role: user.role
        }
        })
        } catch (err) {
        return res.status('401').json({ error: "Could not sign in" }) 
        }
        
}
const signout = (req, res) => {
        res.clearCookie("t")
        return res.status('200').json({ 
        message: "signed out"
        }) 

}
const requireSignin = expressjwt({ 
    secret: config.jwtSecret, 
    algorithms: ["HS256"],
    userProperty: 'auth'
    })
    
    const setUser = async (req, res, next) => {
        if (req.auth && req.auth._id && req.auth.name) {
            req.user = {
                _id: req.auth._id,
                name: req.auth.name
            }
            next()
        } else {
            return res.status(401).json({ error: "Not authorized" })
        }
    }

      const hasAuthorization = (req, res, next) => { 
      const authorized = req.profile && req.auth
      && req.profile._id == req.auth._id 
      if (!(authorized)) {
      return res.status('403').json({ 
      error: "User is not authorized"
      }) 
      } 
      next()
      }
      const forgotPassword = async (req, res) => {
        try {
          // Look up the user by email from the request body
          let user = await User.findOne({ "email": req.body.email });
          if (!user)
            return res.status(401).json({ error: "User not found" });
          
          // Generate a reset token similar to signin.
          const resetToken = jwt.sign(
            { _id: user._id, email: user.email },
            config.jwtSecret,
            { expiresIn: '1h' } // Token valid for 1 hour
          );
          
          // Retrieve the security question from the user's record
          // If no security question is set, you can send a default message or handle it accordingly.
          const securityQuestion = user.securityQuestion || "No security question registered.";
      
          // Return the reset token and the security question so that the frontend dialog can display it.
          return res.json({
            //message: "Reset instructions have been generated. Security question retrieved.",
            token: resetToken,
            securityQuestion: securityQuestion
          });
        } catch (err) {
          return res.status(500).json({ error: "Could not process forgot password" });
        }
      }
      const verifySecurityAnswer = async (req, res) => {
        try {
          const { email, securityAnswer } = req.body;
          // Find the user by email
          let user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
      
          // Compare the provided securityAnswer with what's in the database
          if (!user.authenticateSecurityAnswer(securityAnswer)) {
            return res.status(400).json({ error: "Incorrect security answer" });
          }
      
          // If the answer matches, return a success message
          return res.json({ message: "Security answer verified." });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "Server error verifying security answer" });
        }
      }
      const resetPassword = async (req, res) => {
        try {
          const { email, newPassword } = req.body;
          // Find the user by email
          let user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
      
          // Update the user's password
          // Make sure your User model or a pre-save hook hashes the password
          user.password = newPassword;
          await user.save();
      
          return res.json({ message: "Password has been reset successfully." });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "Server error resetting password" });
        }
      }   
export default { signin, signout, requireSignin, hasAuthorization, setUser, forgotPassword, verifySecurityAnswer, resetPassword }