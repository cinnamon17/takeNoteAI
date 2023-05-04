import { AnswerQuestionSchema } from './answer-question.interface'

export interface RecordSchema {
  questionToAsk: Array<string>
  questions: Array<AnswerQuestionSchema>
}
