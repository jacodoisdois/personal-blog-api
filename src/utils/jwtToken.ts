import jwt from 'jsonwebtoken'
import { addHours, format } from 'date-fns'

interface GenerateTokenInput {
  userId: string
}

interface DecodedToken {
  userId: string
  exp: string
}

export function generateToken (payload: GenerateTokenInput): {
  token: string
  expiresAt: string
  createdAt: string
} {
  const secretKey = process.env.JWT_SECRET

  if (!secretKey) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }

  const expirationDate = addHours(new Date(), 1)
  const expiration = format(expirationDate, 'yyyy-MM-dd HH:mm:ss')

  const creationTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss')

  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' })

  return {
    token,
    expiresAt: expiration,
    createdAt: creationTime
  }
}

export function decodeToken (token: string): DecodedToken | null {
  const secretKey = process.env.JWT_SECRET

  if (!secretKey) {
    throw new Error('JWT_SECRET environment variable is not defined')
  }

  try {
    const decoded = jwt.verify(token, secretKey) as unknown as DecodedToken

    if (decoded.exp && Date.now() >= Number(decoded.exp) * 1000) {
      return null
    }

    return {
      ...decoded,
      exp: format(new Date(Number(decoded.exp) * 1000), 'yyyy-MM-dd HH:mm:ss')
    }
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}
