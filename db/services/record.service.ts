import database from '../mongoDB/database'
import { RecordSchema } from '../../interfaces/record.interface'

export const getRecordById = async (id: string) => {
  return await database.getById<RecordSchema>('records', id)
}

export const updateRecord = async (id: string, doc: RecordSchema) => {
  return await database.update('records', id, doc)
}


export const insertRecord = async (schema: RecordSchema) => {
  return await database.insert('records', schema)
}
