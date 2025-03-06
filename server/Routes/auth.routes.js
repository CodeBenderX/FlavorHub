import express from 'express'
import authCtrl from '../Controllers/auth.controller.js' 
const router = express.Router()
router.route('/auth/signin').post(authCtrl.signin)
router.route('/auth/signout').get(authCtrl.signout)
router.route('/auth/forgot-password').post(authCtrl.forgotPassword);
router.route('/auth/verify-security-answer').post(authCtrl.verifySecurityAnswer);
router.route('/auth/reset-password').post(authCtrl.resetPassword);
export default router

