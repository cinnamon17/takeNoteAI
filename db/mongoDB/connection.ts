import { MongoClient } from 'mongodb'

export let db: MongoClient

export const mConnect = async () => {
  const mongoConnector = new MongoClient(process.env.MONGO_URI!)
  db = await mongoConnector.connect()
}
