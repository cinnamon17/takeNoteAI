import { Request, Response } from 'express'
import { transcribeAudio } from '../lib/aws/transcribe/transcribe'
import { uploadFile } from '../lib/aws/s3/take-note-s3'
import { v4 } from 'uuid'
import { getDataFromText } from '../lib/langchain/chat-model'

const fs = require('fs')

export const extractInformation = async (req: Request, res: Response) => {

  try {
    const name = v4()

    const { file } = req

    if (!file) {
      throw Error('File is required')
    }

    // TODO: Upload file from the web
    const basePath = file.path
    const filename = file.originalname
    const format = filename.split('.').reverse()[0]

    const data = fs.readFileSync(basePath)

    const objectName = name + '.' + format
    await uploadFile(objectName, data)

    // const source = 'https://take-notes-ai.s3.eu-south-2.amazonaws.com/' + objectName
    const source = 'https://take-notes-ai-outputs.s3.eu-west-2.amazonaws.com/audio.mp3'
    // TODO: The S3 repository must to be in the same region that the transcribe service
    const text = await transcribeAudio(name, source, format)
    // TODO: Transcribe does not return the text but the object class

    // TODO: Transform the text on data does should not be here.
    // @ts-ignore
    await getDataFromText(text)

    res.json({})
  } catch (e) {
    res.status(400).json({})
  }
}
