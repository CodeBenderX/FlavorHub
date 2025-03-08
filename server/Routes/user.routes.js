import express from 'express'
import userCtrl from '../Controllers/user.controller.js'
import authCtrl from '../Controllers/auth.controller.js'
const router = express.Router()
router.route('/api/users').post(userCtrl.create)
router.route('/api/users').get(userCtrl.list)
router.route('/api/users/:userId')
.get(authCtrl.requireSignin, userCtrl.read)
.put(authCtrl.requireSignin, authCtrl.hasAuthorization, 
userCtrl.update)
.delete(authCtrl.requireSignin, authCtrl.hasAuthorization, 
userCtrl.remove)
router.param('userId', userCtrl.userByID)
router.route('/api/users/:userId').get(userCtrl.read)
router.route('/api/users/:userId').put(userCtrl.update)
router.route('/api/users/:userId').delete(userCtrl.remove)
// Admin-specific route to update a user's admin status
router.route('/api/users/:userId/admin')
  .put(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.setAdmin);

  // New route: Update security question/answer
  router.route('/api/users/:userId/security')
  .put(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.updateSecurity);  

  // New route: Update password (accessible by self or admin)
router.route('/api/users/:userId/password')
.put(authCtrl.requireSignin, authCtrl.canUpdateUser, userCtrl.updatePassword);

export default router


