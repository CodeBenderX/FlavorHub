import express from 'express'
import userCtrl from '../Controllers/contact.controller.js'

const router = express.Router()
router.route('/api/contacts').post(userCtrl.create)
router.route('/api/contacts').get(userCtrl.list)
export default router