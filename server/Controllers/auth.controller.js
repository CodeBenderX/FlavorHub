import User from '../Models/user.model.js'
import jwt from 'jsonwebtoken'
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
        const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, admin: user.admin  }, config.jwtSecret) 
        res.cookie('t', token, { expire: new Date() + 9999 }) 
        return res.json({
        token, 
        user: {
        _id: user._id, 
        name: user.name,
        email: user.email, 
        admin: user.admin
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
          
          let user = await User.findOne({ "email": req.body.email });
          if (!user)
            return res.status(401).json({ error: "User not found" });
          
          
          const resetToken = jwt.sign(
            { _id: user._id, email: user.email },
            config.jwtSecret,
            { expiresIn: '1h' } 
          );
          
          
          const securityQuestion = user.securityQuestion || "No security question registered.";
      
          
          return res.json({
            
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
          
          let user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
      
          
          if (!user.authenticateSecurityAnswer(securityAnswer)) {
            return res.status(400).json({ error: "Incorrect security answer" });
          }
      
          
          return res.json({ message: "Security answer verified." });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "Server error verifying security answer" });
        }
      }
      const resetPassword = async (req, res) => {
        try {
          const { email, newPassword } = req.body;
          
          let user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ error: "User not found" });
          }
      
          user.password = newPassword;
          await user.save();
      
          return res.json({ message: "Password has been reset successfully." });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "Server error resetting password" });
        }
      }   
      const isAdmin = (req, res, next) => {
        
        if (req.auth && req.auth.admin === true) {
          return next();
        }
        return res.status(403).json({ error: "User is not authorized as admin" });
      };
      export const canUpdateUser = (req, res, next) => {
        
        if (req.auth && (req.auth._id === req.profile._id || req.auth.admin === true)) {
          return next();
        }
        return res.status(403).json({ error: "User is not authorized" });
      };
      
export default { signin, signout, requireSignin, hasAuthorization, setUser, forgotPassword, verifySecurityAnswer, resetPassword, isAdmin, canUpdateUser }