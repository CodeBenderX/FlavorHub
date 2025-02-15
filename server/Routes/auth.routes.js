import express from 'express'
import authCtrl from '../Controllers/auth.controller.js' 
const router = express.Router()
router.route('/auth/signin').post(authCtrl.signin)
router.route('/auth/signout').get(authCtrl.signout)
export default router

