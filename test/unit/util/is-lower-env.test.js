import { isLowerEnv } from '../../../app/utils/is-lower-env.js'
import { DEV, SND, TEST, PRE, PRD } from '../../../app/constants/enviroments-codes.js'

describe('isLowerEnv', () => {
  test('should return true for DEV environment', () => {
    expect(isLowerEnv(DEV)).toBe(true)
  })

  test('should return true for SND environment', () => {
    expect(isLowerEnv(SND)).toBe(true)
  })

  test('should return true for TEST environment', () => {
    expect(isLowerEnv(TEST)).toBe(true)
  })

  test('should return false for PRE environment', () => {
    expect(isLowerEnv(PRE)).toBe(false)
  })

  test('should return false for PRD environment', () => {
    expect(isLowerEnv(PRD)).toBe(false)
  })

  test('should return false for an undefined environment', () => {
    expect(isLowerEnv(undefined)).toBe(false)
  })

  test('should return false for a null environment', () => {
    expect(isLowerEnv(null)).toBe(false)
  })
})
