import { Request, Response } from 'express'
import { RecordSchema } from '../interfaces/record.interface'
import { getDistinctKeys } from '../db/services/question.service'
import { insertRecord } from '../db/services/record.service'

export const createRecord = async (req: Request, res: Response) => {

  try {

    const keys = await getDistinctKeys()

    const schema: RecordSchema = {
      questionToAsk: keys,
      questions: []

    }
    const id = await insertRecord(schema)

    res.json({ id })
  } catch (e) {

  }
}
