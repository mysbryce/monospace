import z from 'zod'
import { fetchNui } from './fetch.js'
import { useEvent } from './useEvent.js'

export const exposeKeySchema = z.string()
export const exposeFunctionSchema = z.function({ input: z.array(z.unknown()), output: z.unknown() })
export const exposeSchema = z.record(exposeKeySchema, exposeFunctionSchema)

export type Expose = z.infer<typeof exposeSchema>
export type ExposeKey = z.infer<typeof exposeKeySchema>
export type ExposeFunction = (...args: unknown[]) => unknown

const registry = new Map<ExposeKey, ExposeFunction>()

const register = (exposes: Expose): void => {
  for (const [key, fn] of Object.entries(exposes)) {
    registry.set(key, fn as ExposeFunction)
  }
}

const invoke = (data: { key: ExposeKey; args: unknown[] }): unknown => {
  const fn = registry.get(data.key)

  if (!fn) {
    console.warn(`[expose] No function registered for key: "${data.key}"`)
    return
  }

  return fn(...data.args)
}

export const expose = (exposes: Expose): void => {
  const result = exposeSchema.safeParse(exposes)

  if (!result.success) {
    console.error('[expose] Validation failed:', result.error.issues)
    return
  }

  register(result.data)
  fetchNui('exposes', Object.keys(result.data))
}

export const initExposes = (): void => {
  useEvent('invokeExpose', invoke)
}

/**
 * 
 * And you must put this code in the client side (LUA)
 * 
 * ```lua
 * ---@type table<string, fun(...: any): nil>
 * local registries = {}
 * 
 * RegisterNUICallback('exposes', function(keys, cb)
 *  for _, key in ipairs(keys) do
 *   registries[key] = function(...)
 *    local args = { ... }
 *      SendNUIMessage({
 *        type = 'invokeExpose',
 *        data = {
 *         key = key,
 *         args = args
 *        }
 *      })
 *    end
 *  end
 * end
 * 
 * return registries
 * ```
 */