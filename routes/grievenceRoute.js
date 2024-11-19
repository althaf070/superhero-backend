import express from 'express'
import { getGrievances, getRecentResolvedCases, grivenceDashboard, logGrievence, updateGrievanceStatus, userGrievece } from '../controller/grievenceController.js'
import {verifyUser} from '../middleware/verifyuser.js'
const router = express.Router()
router.get('/get', verifyUser,userGrievece)
router.post('/post',verifyUser,logGrievence)

router.patch('/update/:id',updateGrievanceStatus)
router.get('/grievences',getGrievances)
router.get('/recent-cases',getRecentResolvedCases)
router.get('/dashboard',grivenceDashboard)

export default router