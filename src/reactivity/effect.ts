import type { EffectOptions } from '../types/reactive'
import type { AnyFn } from '../types/types'

let activeEffect: ReactiveEffect | undefined
class ReactiveEffect {
  private _fn: AnyFn
  constructor(_fn: AnyFn, public scheduler?: EffectOptions['scheduler']) {
    this._fn = _fn
  }

  run() {
    // eslint-disable-next-line ts/no-this-alias
    activeEffect = this
    return this._fn()
  }
}

export function effect(fn: AnyFn, options?: EffectOptions) {
  const _effect = new ReactiveEffect(fn, options?.scheduler)
  _effect.run()
  return _effect.run.bind(_effect)
}

const targetMap = new Map()
export function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return

  const dep = depsMap.get(key)
  if (!dep)
    return

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    }
    else {
      effect.run()
    }
  }
}
