import { Request, Response } from 'express'
import { fetchTranscribeJob, transcribeAudio } from '../lib/aws/transcribe/transcribe'
import { getObjectFromS3, uploadFileToS3 } from '../lib/aws/s3/take-note-s3'
import { getAnswerFromQuestionsChatGPT } from '../lib/langchain/chat-model'
import fs from 'node:fs'
import { getRecordById, updateRecord } from '../db/services/record.service'
import { getAllQuestionsByKeys } from '../db/services/question.service'


export const extractInformation = async (req: Request, res: Response) => {

  try {
    // @ts-ignore
    const { id } = req.params // TODO: recordID
    const { file } = req

    if (!id) {
      throw Error('Id Record is required')
    }

    if (!file) {
      throw Error('File is required')
    }

    const record = await getRecordById(id)
    const questions = await getAllQuestionsByKeys(record.questionToAsk)

    const basePath = file.path
    const filename = file.originalname

    const data = fs.readFileSync(basePath)
    await uploadFileToS3(filename, data)

    const source = 'https://take-notes-ai.s3.eu-south-2.amazonaws.com/' + filename;
    const format = filename.split('.').reverse()[0]
    const transcribeJobName = await transcribeAudio(file.filename, source, format)

    let transcribeOutputUrl: string | undefined
    if (transcribeJobName) {

      let isCompleted = false
      while (!isCompleted) {
        const response = await fetchTranscribeJob(transcribeJobName)

        if (response) {

          if (response.url) {
            transcribeOutputUrl = response.url
          }

          if (response.status) {
            isCompleted = response.status === 'COMPLETED' || response.status === 'FAILED'
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000 * 15))
          }
        }
      }
    }

    if (!transcribeOutputUrl) {
      throw Error('Transcribe Output Url not was found')
    }

    // https://take-notes-ai-outputs.s3.eu-west-2.amazonaws.com/f347ca124823c7a01d03ee7b6f005226.json

    const jsonKey = transcribeOutputUrl.split('/').reverse()[0]

    const jsonObj = await getObjectFromS3(jsonKey)

    if (jsonObj) {
      const content = <{ results: { transcripts: Array<{ transcript: string }> } }>JSON.parse(jsonObj)
      const text = content.results.transcripts.map(it => it.transcript).join(' ')

      const response = await getAnswerFromQuestionsChatGPT(questions, text)
      const questionToAskKey = response.questions.map(it => it.key)
      const answerQuestionList = [...response.answerQuestionList, ...response.answerQuestionList]

      await updateRecord({
        questionToAsk: questionToAskKey,
        questions: answerQuestionList
      })
    }


    res.sendStatus(200)
  } catch (e) {
    res.status(400)
  }
}
