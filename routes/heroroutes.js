import express from 'express'
import { heroCheckAuth, heroLogin, heroLogout } from '../controller/heroController.js'
import { verifyHero } from '../middleware/verifyhero.js'


const router = express.Router()
router.post('/hero-login',heroLogin)

router.get('/check-hero',verifyHero,heroCheckAuth)
router.post('/hero-logout',verifyHero,heroLogout)

export default router