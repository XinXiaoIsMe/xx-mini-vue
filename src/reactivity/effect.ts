import { extend } from '../shared'
import type { EffectOptions } from '../types/effect'
import type { AnyFn } from '../types/types'

let activeEffect: ReactiveEffect | undefined
class ReactiveEffect {
  private _fn: AnyFn
  public deps: Set<ReactiveEffect>[] = []
  private _active: boolean = true;
  public onStop?: AnyFn
  constructor(_fn: AnyFn, public scheduler?: EffectOptions['scheduler']) {
    this._fn = _fn
  }

  run() {
    // eslint-disable-next-line ts/no-this-alias
    activeEffect = this
    return this._fn()
  }

  stop() {
    if (this._active) {
      cleanupEffect(this)
      this._active = false
      this.onStop?.()
    }
  }
}

function cleanupEffect (effect: ReactiveEffect) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  })
}

export function effect(fn: AnyFn, options?: EffectOptions) {
  const _effect = new ReactiveEffect(fn, options?.scheduler)
  extend(_effect, options)
  _effect.run()
  const runner: {
    (): void
    effect?: ReactiveEffect
  } = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner: any) {
  runner.effect.stop()
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
  activeEffect?.deps.push(dep)
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
