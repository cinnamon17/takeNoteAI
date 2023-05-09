import { Router } from 'express'
import { extractInformation } from '../controllers/extract-information'
import multer from 'multer'
import { createRecord } from '../controllers/create-record'
import { allQuestions } from '../controllers/all-questions'
import { lastRecords } from '../controllers/last-records'
import path from 'path'

const router = Router()

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext)
  }
})

const upload = multer({ storage: storage })


router.get('/questions', allQuestions)
router.get('/', lastRecords)
router.post('/new-record', createRecord)
router.post('/upload-audio/:id', upload.single('audio'), extractInformation)

export default router
