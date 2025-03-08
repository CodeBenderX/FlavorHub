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
export default router

// import express from 'express';
// import userCtrl from '../Controllers/user.controller.js';
// import authCtrl from '../Controllers/auth.controller.js';

// const router = express.Router();

// // Public route to create a new user (sign up)
// router.route('/api/users')
//   .post(userCtrl.create)
//   // List users only for authenticated admins
//   .get(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.list);

// // User-specific endpoints (for reading, updating, and deleting a user)
// router.route('/api/users/:userId')
//   .get(authCtrl.requireSignin, userCtrl.read)
//   .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
//   .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

// Admin-specific route to update a user's admin status
// router.route('/api/users/:userId/admin')
//   .put(authCtrl.requireSignin, authCtrl.isAdmin, userCtrl.setAdmin);

// // Parameter middleware to automatically load user object when :userId is present
// router.param('userId', userCtrl.userByID);

// export default router;
