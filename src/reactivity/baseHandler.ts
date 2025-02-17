import { track, trigger } from './effect';

const getter = createGetter()
const setter = createSetter()
const readonlyGetter = createGetter(true)

export const mutableHandler = {
  get: getter,
  set: setter
}

export const readonlyHandler = {
  get: readonlyGetter,
  set(target, key, value) {
    console.warn('[vue warn]: cannot set readonly variable')
    return true;
  }
}

function createGetter (isReadonly = false) {
  return function (target, key) {
    const result = Reflect.get(target, key)
    !isReadonly && track(target, key)
    return result
  }
}

function createSetter () {
  return function (target, key, value) {
    const result = Reflect.set(target, key, value)
    trigger(target, key)
    return result
  }
}