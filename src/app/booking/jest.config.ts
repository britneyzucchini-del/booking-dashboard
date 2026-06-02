import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default config