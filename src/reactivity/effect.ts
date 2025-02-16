type AnyFn = (...args: any[]) => any

let activeEffect: ReactiveEffect | undefined
class ReactiveEffect {
  private _fn: AnyFn
  constructor(_fn: AnyFn) {
    this._fn = _fn
  }

  run() {
    // eslint-disable-next-line ts/no-this-alias
    activeEffect = this
    this._fn()
  }
}

export function effect(fn: AnyFn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
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
    effect.run()
  }
}
