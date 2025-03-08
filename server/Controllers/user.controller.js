import User from '../Models/user.model.js'
import extend from 'lodash/extend.js'
import errorHandler from './error.controller.js'
const create = async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const list = async (req, res) => {
    try {
        let users = await User.find().select('_id name email updated created admin')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}
const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}
const update = async (req, res) => {
    try {
        let user = req.profile
        user = extend(user, req.body)
        user.updated = Date.now()
        await user.save()
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const remove = async (req, res) => {
    try {
        let user = req.profile
        let deletedUser = await user.deleteOne()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        res.json(deletedUser)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const setAdmin = async (req, res) => {
    try {
      let user = req.profile; // Assume userByID middleware has loaded the user
      user.admin = req.body.admin; // Set admin field based on request body
      await user.save();
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    } catch (err) {
      return res.status(400).json({
        error: "Could not update admin status",
      });
    }
  }
  const updateSecurity = async (req, res) => {
    try {
      let user = req.profile; // Loaded via router.param
      const { securityQuestion, securityAnswerPlain } = req.body;
      if (!securityQuestion || !securityAnswerPlain) {
        return res.status(400).json({ error: "Security question and answer are required." });
      }
      // Update the security question and use the virtual setter for securityAnswerPlain
      user.securityQuestion = securityQuestion;
      user.securityAnswerPlain = securityAnswerPlain;
      user.updated = Date.now();
      await user.save();
      // Remove sensitive fields before sending the response
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json({ message: "Security question and answer updated successfully", user });
    } catch (err) {
      return res.status(400).json({ error: "Could not update security question/answer" });
    }
  }
  const updatePassword = async (req, res) => {
    try {
      let user = req.profile; // Loaded via router.param('userId', userCtrl.userByID)
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ error: "Password is required." });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters." });
      }
      // Set the new password (using your virtual setter, which will update salt and hashed_password)
      user.password = password;
      user.updated = Date.now();
      await user.save();
      // Remove sensitive fields before sending the response
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json({ message: "Password updated successfully", user });
    } catch (err) {
      return res.status(400).json({ error: "Could not update password." });
    }
  }
  
export default { create, userByID, read, list, remove, update, setAdmin, updateSecurity, updatePassword }
