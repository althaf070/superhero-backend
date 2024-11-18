import express from 'express'
import { getGrievances, logGrievence, userGrievece } from '../controller/grievenceController.js'
import {verifyUser} from '../middleware/verifyuser.js'
const router = express.Router()
router.get('/get', verifyUser,userGrievece)
router.post('/post',verifyUser,logGrievence)
router.patch('/update',verifyUser,logGrievence)

router.get('/grievences',getGrievances)
export default router