import { Router } from 'express'
import { extractInformation } from '../controllers/extract-information'
import multer from 'multer'
import { createRecord } from '../controllers/create-record'

const router = Router()
const upload = multer({ dest: 'uploads/' })

router.post('/new-record', createRecord)
router.post('/upload-audio/:id', upload.single('audio'), extractInformation)

export default router
