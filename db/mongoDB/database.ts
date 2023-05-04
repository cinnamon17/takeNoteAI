import * as mongoDB from 'mongodb'
import { FindOptions, ObjectId } from 'mongodb'
import { db } from './connection'
import { DatabaseInterface } from '../database.interface'

class Database implements DatabaseInterface {
  static instance: Database | undefined

  private constructor() {
  }

  static getInstance(): Database {
    if (this.instance) {
      return this.instance
    }
    this.instance = new Database()
    return this.instance
  }

  getById<T>(collection_name: string, id: string): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        const doc = await collection.findOne<T>({ _id: new mongoDB.ObjectId(id) }, {})

        if ((doc)) {
          resolve(doc)
        } else {
          reject()
        }
      } catch (e) {
        reject(e)
      }
    })
  }

  getAll<T>(collection_name: string, filter: {} = {}, options: FindOptions = {}): Promise<Array<T>> {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        const docs = await collection.find<Array<T>>(filter, options).toArray()
        // @ts-ignore
        resolve(docs)
      } catch (e) {
        reject(e)
      }
    })
  }

  insert(collection_name: string, document: {}): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        const doc = await collection.insertOne(document)
        resolve(doc.insertedId.toString())
      } catch (e) {
        reject(e)
      }
    })
  }

  update(collection_name: string, doc_id: string, document: {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        const updated = await collection.updateOne({ _id: new ObjectId(doc_id) }, { $set: document })
        resolve(updated)
      } catch (e) {
        reject(e)
      }
    })
  }

  updateMany(collection_name: string, filter: {} = {}, document: {} = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        const updated = await collection.updateMany(filter, { $set: document })
        resolve(updated)
      } catch (e) {
        reject(e)
      }
    })
  }

  delete(collection_name: string, doc_id: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        await collection.deleteOne({ _id: new ObjectId(doc_id) })
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  }

  aggregate(collection_name: string, pipeline: Array<any>): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        collection.aggregate(pipeline).toArray()
          .then(res => {
            resolve(res)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  countDocs(collection_name: string, filter: {}): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        collection.countDocuments(filter)
          .then(res => {
            resolve(res)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  distinct(collection_name: string, field: string): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      try {
        const collection = this.collection(db, collection_name)
        collection.distinct(field)
          .then(res => {
            resolve(res)
          })
          .catch(er => {
            reject(er)
          })
      } catch (e) {

      }
    })
  }

  collection(client: mongoDB.MongoClient, collection_name: string) {
    const database: mongoDB.Db = client.db(process.env.DATABASE_NAME)
    return database.collection(collection_name)
  }
}

const database = Database.getInstance()

export default database
