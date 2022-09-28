import {Router} from 'express'
import playerList from './handler/playerlist'

const router = Router()
router.get('/playerlist',playerList)
export default router

