import pino from 'pino'
import { env, isProd, isTest } from './env'

// Structured JSON logs to stdout in production; pretty in dev; silent in tests.
export const logger = pino({
  level: isTest ? 'silent' : env.LOG_LEVEL,
  ...(isProd || isTest
    ? {}
    : { transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss' } } }),
})
