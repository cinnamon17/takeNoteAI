import { Request, Response } from 'express'
import fs from 'node:fs'
import { uploadFileToS3 } from '../lib/aws/s3/take-note-s3'
import { getAnswerFromQuestionsChatGPT } from '../lib/langchain/chat-model'
import { getRecordById, updateRecord } from '../db/services/record.service'
import { getAllQuestionsByKeys } from '../db/services/question.service'
import { speech2Text } from '../lib/openai/speech-2-text'


export const extractInformation = async (req: Request, res: Response) => {

  try {
    // @ts-ignore
    const { id } = req.params
    const { file } = req

    if (!id) {
      throw Error('Record ID is required')
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

    const text = await speech2Text(file.path)

    let response

    response = await getAnswerFromQuestionsChatGPT(questions, text)
    const questionToAskKey = response.questions.map(it => it.key)
    const answerQuestionList = [...response.answerQuestionList, ...record.questions]

    await updateRecord(id, {
      questionToAsk: questionToAskKey,
      questions: answerQuestionList
    })

    res.status(200).json({ script: text, answers: response?.answerQuestionList })
  } catch (e) {
    console.log(e)
    res.status(400).json(e)
  }
}
