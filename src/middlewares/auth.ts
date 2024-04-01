import { type Request, type Response, type NextFunction } from 'express'
import { decodeToken } from '../utils/jwtToken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | undefined => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const decodedToken = decodeToken(token)

  if (!decodedToken) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  next()
}
