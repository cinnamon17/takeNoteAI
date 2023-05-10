export interface DatabaseInterface {
  getById(collection_name: string, id: string): Promise<any>
  getAll(collection_name: string, filter: {}, options: {}): Promise<any>
  insert(collection_name: string, document: {}): Promise<any>
  update(collection_name: string, doc_id: string, document: {}): Promise<any>
  updateMany(collection_name: string, filter: {}, document: {}): Promise<any>
  delete(collection_name: string, doc_id: string): Promise<any>
  aggregate(collection_name: string, pipeline: Array<any>): Promise<any>
  countDocs(collection_name: string, filter: {}): Promise<any>
}
