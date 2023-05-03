import { Request, Response } from 'express'
import { transcribeAudio } from '../lib/aws/transcribe/transcribe'
import { uploadFile } from '../lib/aws/s3/take-note-s3'
import { getDataFromText } from '../lib/langchain/chat-model'
import fs from 'node:fs';

export const extractInformation = async (req: Request, res: Response) => {

  try {

      const { file } = req;

    if (!file) {
      throw Error('File is required')
    }

    const basePath = file.path
    const filename = file.originalname
    const format = filename.split('.').reverse()[0]

    const data = fs.readFileSync(basePath);

    await uploadFile(filename, data);

     //const source = 'https://take-notes-ai.s3.eu-south-2.amazonaws.com/' + req.file.filename;
     const source = 'https://take-notes-ai-outputs.s3.eu-west-2.amazonaws.com/audio.mp3'
    // TODO: The S3 repository must to be in the same region that the transcribe service
     const text = await transcribeAudio(file.filename, source, format)
    // TODO: Transcribe does not return the text but the object class

    // TODO: Transform the text on data does should not be here.
    // @ts-ignore
    await getDataFromText(text);

    res.sendStatus(200);
  } catch (e) {
    res.status(400);
  }
}
