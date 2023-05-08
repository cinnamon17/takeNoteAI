import { ChatOpenAI } from 'langchain/chat_models/openai'
import { Document } from 'langchain/document'
import { CharacterTextSplitter } from 'langchain/text_splitter'
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'
import { BaseChatMessage } from 'langchain/dist/schema'
import { QuestionSchema } from '../../interfaces/question.interface'
import { AnswerQuestionSchema } from '../../interfaces/answer-question.interface'

export const getAnswerFromQuestionsChatGPT = async (questions: Array<QuestionSchema>, text: string):
  Promise<{ questions: Array<QuestionSchema>, answerQuestionList: Array<AnswerQuestionSchema> }> => {

  const documents = await textToData(text)

  const answerQuestionList: Array<AnswerQuestionSchema> = new Array<AnswerQuestionSchema>()

  for (let doc of documents) {
    const promiseResponses = await checkIntent(questions, doc)

    const promiseQuestionList = new Array<Promise<BaseChatMessage>>()
    const questionList = new Array<QuestionSchema>()

    for (let i = 0; i < questions.length; i++) {
      const res = promiseResponses[i]
      const qItem = questions[i]

      const text = res.text.replace(/[^0-9a-zA-Z]/g, '')

      if (text == 'Yes') {
        const questionPromise = getAnswerFromText(doc.pageContent, qItem.question)
        promiseQuestionList.push(questionPromise)
        questionList.push(qItem)
      }
    }


    const promiseQuestionResponse = await Promise.all(promiseQuestionList)

    for (let i = 0; i < promiseQuestionResponse.length; i++) {
      const res = promiseQuestionResponse[i]
      const qItem = questionList[i]

      questions = questions.filter(it => it.key !== qItem.key)

      answerQuestionList.push({
        key: qItem.key,
        value: res.text
      })
    }

  }

  return { questions, answerQuestionList }
}

export const textToData = async (text: string) => {
  const splitter = new CharacterTextSplitter({
    separator: ' ',
    chunkSize: 20000,
    chunkOverlap: 3
  })
  const response = await splitter.createDocuments([text])
  console.log(response)
  return response
}

export const checkIntent = async (questions: Array<any>, doc: Document) => {
  const model = new ChatOpenAI({
    temperature: 0.5,
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const systemChatMessage = new SystemChatMessage(
    'You are an intent detector system \n' +
    'The client text is a conversation between two people (interviewer and interviewee) ' +
    'Identify the information from the interviewee. \n ' +
    'Your task is to determinate if, based on the client text you can answer the client question. \n' +
    'Your answer should be only one word in English language \n' +
    'If the answer is not in the text, do not try to guess it \n' +
    'Response with "Yes" if you can answer the question or response with "No" if you can not do it')

  const replaceClientValue = (text: string, question: string): HumanChatMessage => {

    const prompt = 'Client Text: {{clientText}} \n Client Question: {{clientQuestion}}'
      .replace('{{clientText}}', text)
      .replace('{{clientQuestion}}', question)

    return new HumanChatMessage(prompt)
  }

  const promiseList = new Array<Promise<BaseChatMessage>>()

  questions.forEach(it => {
    promiseList.push(
      model.call([
        systemChatMessage,
        replaceClientValue(doc.pageContent, it.question)
      ])
    )
  })

  return await Promise.all(promiseList)
}

export const getAnswerFromText = (text: string, question: string): Promise<BaseChatMessage> => {
  const model = new ChatOpenAI({
    temperature: 0.5,
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const replaceSystemMessageValue = (): SystemChatMessage => {
    let prompt = 'You are a data extractor system \n' +
      'Important: Your task is the next: Based on the client text you must to answer the client question. \n' +
      'The client text is a conversation between two people (interviewer and interviewee) ' +
      'Response the answer based on the interviewee information. \n' +
      'Important: Do not add more information. Be concise and clear \n' +
      'Response only the answer and in the same language that the question \n'

    return new SystemChatMessage(prompt)
  }

  const replaceHumanMessageValue = (): HumanChatMessage => {
    let prompt = 'Client Text: {{clientText}} \n Client Question: {{clientQuestion}}'
    prompt = prompt
      .replace('{{clientText}}', text)
      .replace('{{clientQuestion}}', question)

    return new HumanChatMessage(prompt)
  }

  return model.call([
    replaceSystemMessageValue(),
    replaceHumanMessageValue()
  ])

}
