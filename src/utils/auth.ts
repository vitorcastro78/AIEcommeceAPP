// src/authUtils.ts

export type User = {
  id: string
  email: string
  passwordHash: string
  roles: string[]
  isActive: boolean
}

export type AuthToken = {
  token: string
  expiresAt: number
}

export type AuthError =
  | { type: 'InvalidCredentials' }
  | { type: 'InactiveUser' }
  | { type: 'TokenExpired' }
  | { type: 'Unauthorized' }
  | { type: 'InternalError'; message: string }

/**
 * Hashes a password using SHA-256.
 * @param password Plain text password
 * @returns Promise resolving to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Compares a plain password with a hash.
 * @param password Plain text password
 * @param hash Hashed password
 * @returns Promise resolving to boolean
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const hashed = await hashPassword(password)
  return hashed === hash
}

/**
 * Generates a JWT-like token.
 * @param userId User ID
 * @param secret Secret key
 * @param expiresIn Expiration in seconds
 * @returns AuthToken
 */
export const generateToken = (
  userId: string,
  secret: string,
  expiresIn: number
): AuthToken => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(
    JSON.stringify({
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    })
  )
  const signature = btoa(
    crypto
      .subtle
      .digest('SHA-256', new TextEncoder().encode(header + '.' + payload + secret))
      .then(buf =>
        Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      )
  )
  return {
    token: [header, payload, signature].join('.'),
    expiresAt: Math.floor(Date.now() / 1000) + expiresIn,
  }
}

/**
 * Validates a JWT-like token.
 * @param token Token string
 * @param secret Secret key
 * @returns Promise resolving to userId or AuthError
 */
export const validateToken = async (
  token: string,
  secret: string
): Promise<string | AuthError> => {
  const [header, payload, signature] = token.split('.')
  if (!header || !payload || !signature) return { type: 'Unauthorized' }
  const expectedSignature = await crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(header + '.' + payload + secret))
    .then(buf =>
      btoa(
        Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      )
    )
  if (signature !== expectedSignature) return { type: 'Unauthorized' }
  const payloadObj = JSON.parse(atob(payload))
  if (payloadObj.exp < Math.floor(Date.now() / 1000)) return { type: 'TokenExpired' }
  return payloadObj.sub
}

/**
 * Authenticates a user.
 * @param email User email
 * @param password User password
 * @param users User list
 * @returns Promise resolving to User or AuthError
 */
export const authenticateUser = async (
  email: string,
  password: string,
  users: User[]
): Promise<User | AuthError> => {
  const user = users.find(u => u.email === email)
  if (!user) return { type: 'InvalidCredentials' }
  if (!user.isActive) return { type: 'InactiveUser' }
  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) return { type: 'InvalidCredentials' }
  return user
}

/**
 * Checks if user has required role.
 * @param user User
 * @param role Required role
 * @returns boolean
 */
export const hasRole = (user: User, role: string): boolean =>
  user.roles.includes(role)

// src/authUtils.test.ts

import {
  hashPassword,
  verifyPassword,
  generateToken,
  validateToken,
  authenticateUser,
  hasRole,
  User,
} from './authUtils'

const users: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    passwordHash: '',
    roles: ['customer'],
    isActive: true,
  },
  {
    id: '2',
    email: 'admin@example.com',
    passwordHash: '',
    roles: ['admin'],
    isActive: false,
  },
]

test('hashPassword and verifyPassword', async () => {
  const password = 'secure123'
  const hash = await hashPassword(password)
  expect(await verifyPassword(password, hash)).toBe(true)
  expect(await verifyPassword('wrong', hash)).toBe(false)
})

test('authenticateUser success', async () => {
  users[0].passwordHash = await hashPassword('pass')
  const result = await authenticateUser('user@example.com', 'pass', users)
  expect(typeof result === 'object' && 'id' in result && result.id === '1').toBe(true)
})

test('authenticateUser invalid credentials', async () => {
  const result = await authenticateUser('user@example.com', 'wrong', users)
  expect(result).toEqual({ type: 'InvalidCredentials' })
})

test('authenticateUser inactive user', async () => {
  users[1].passwordHash = await hashPassword('adminpass')
  const result = await authenticateUser('admin@example.com', 'adminpass', users)
  expect(result).toEqual({ type: 'InactiveUser' })
})

test('generateToken and validateToken', async () => {
  const tokenObj = generateToken('1', 'secret', 10)
  const userId = await validateToken(tokenObj.token, 'secret')
  expect(userId).toBe('1')
})

test('validateToken expired', async () => {
  const tokenObj = generateToken('1', 'secret', -1)
  const result = await validateToken(tokenObj.token, 'secret')
  expect(result).toEqual({ type: 'TokenExpired' })
})

test('hasRole', () => {
  expect(hasRole(users[0], 'customer')).toBe(true)
  expect(hasRole(users[0], 'admin')).toBe(false)
})