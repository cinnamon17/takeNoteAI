import { Request, Response } from 'express'
import { getAllQuestions } from '../db/services/question.service'

export const allQuestions = async (req: Request, res: Response) => {

  try {
    const questions = await getAllQuestions()

    res.json(questions)
  } catch (e) {
    res.status(400).json(e)
  }
}
