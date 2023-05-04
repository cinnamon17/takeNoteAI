import database from '../mongoDB/database'
import { QuestionSchema } from '../../interfaces/question.interface'

export const getAllQuestionsByKeys = async (keys: Array<string>) => {
  return await database.getAll<QuestionSchema>('questions', {
    '$in': keys
  })
}
