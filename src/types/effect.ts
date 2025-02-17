import type { AnyFn } from './types'

export interface EffectOptions {
  scheduler?: AnyFn
  onStop?: AnyFn
}
