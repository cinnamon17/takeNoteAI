import { Request, Response } from 'express'

export const lastRecords = (req: Request, res: Response) => {
  try {

  } catch (e) {
    res.status(400).json(e)
  }
}
