import database from '../mongoDB/database'
import { QuestionSchema } from '../../interfaces/question.interface'

export const getAllQuestionsByKeys = async (keys: Array<string>) => {
  return await database.getAll<QuestionSchema>('questions', {
   'key': {
     '$in': keys
   }
  })
}


export const getDistinctKeys = async (key = 'key') => {
  return await database.distinct('questions', key)
}
