import database from '../mongoDB/database'
import { RecordSchema } from '../../interfaces/record.interface'

export const getRecordById = async (id: string) => {
  return await database.getById<RecordSchema>('records', id)
}

export const updateRecord = async (doc: RecordSchema) => {

}
