import { ChatOpenAI } from 'langchain/chat_models/openai'
import { Document } from 'langchain/document'
import { CharacterTextSplitter } from 'langchain/text_splitter'
import { HumanChatMessage } from 'langchain/schema'

export const getDataFromText = async (text: string) => {
  const documents = await textToData(text)
  const data = await dataToModel(documents)
  return { data }
}

export const textToData = async (text: string) => {
  const splitter = new CharacterTextSplitter({
    separator: ' ',
    chunkSize: 7,
    chunkOverlap: 3
  })
  const response = await splitter.createDocuments([text])
  console.log(response)
  return response
}

export const dataToModel = async (documents: Array<Document>) => {
  const model = new ChatOpenAI({
    temperature: 0.5,
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const humanMessage = new HumanChatMessage('What is a good name for a company that makes colorful socks?')
  const response = await model.call([
    humanMessage
  ])

  return { response }
}
