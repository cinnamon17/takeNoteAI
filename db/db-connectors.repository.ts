import { mConnect } from './mongoDB/connection'
import database from './mongoDB/database'

class DbConnectorsRepository {
  private static instance: undefined | DbConnectorsRepository
  public database = database

  private constructor() {
  }

  static getInstance(): DbConnectorsRepository {
    if (this.instance) {
      return this.instance
    }
    this.instance = new DbConnectorsRepository()
    return this.instance
  }

  start() {
    mConnect().then(() => {
      console.log('Successful connection!')
    }).catch(e => {
      console.log(e)
    })

  }
}

export default DbConnectorsRepository.getInstance()
