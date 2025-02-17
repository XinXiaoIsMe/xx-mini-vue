import { mutableHandler, readonlyHandler } from './baseHandler'

export function reactive<T extends object>(raw: T) {
  return new Proxy(raw, mutableHandler)
}

export function readonly<T extends object> (raw: T) {
  return new Proxy(raw, readonlyHandler)
}
