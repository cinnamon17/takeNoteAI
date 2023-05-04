import { Request, Response } from 'express'
import database from '../db/mongoDB/database'
import { RecordSchema } from '../interfaces/record.interface'

export const createRecord = async (req: Request, res: Response) => {

  try {

    const keys = await database.distinct('questions', 'key')

    const schema: RecordSchema = {
      questionToAsk: keys,
      questions: []

    }
    const id = await database.insert('records', schema)

    res.json({ id })
  } catch (e) {

  }
}
