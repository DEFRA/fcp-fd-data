import { DEV, SND, TEST } from '../constants/enviroments-codes.js'

export const isLowerEnv = env => [SND, DEV, TEST].includes(env)
