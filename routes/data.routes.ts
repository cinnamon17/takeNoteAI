import { Router } from 'express'
import { extractInformation } from '../controllers/extract-information'
import multer from 'multer'

const router = Router()
const upload = multer({ dest: 'uploads/' })

router.post('/data', upload.single('file'), extractInformation)

export default router
