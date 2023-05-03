import { Router } from 'express'
import { extractInformation } from '../controllers/extract-information'
import multer from 'multer'

const router = Router()
const upload = multer({ dest: 'uploads/' })

router.post('/upload-audio', upload.single('audio'), extractInformation)

export default router
