import express from 'express'
import { logGrievence, userGrievece } from '../controller/grievenceController.js'
import {verifyUser} from '../middleware/verifyuser.js'
const router = express.Router()
router.get('/get', verifyUser,userGrievece)
router.post('/post',verifyUser,logGrievence)
router.patch('/update',verifyUser,logGrievence)

export default router