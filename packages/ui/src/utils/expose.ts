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

interface InvokePayload {
  requestId: string
  key: ExposeKey
  args: unknown[]
}

interface InvokeResult {
  requestId: string
  result?: unknown
  error?: string
}

const invoke = async ({ requestId, key, args }: InvokePayload): Promise<void> => {
  const fn = registry.get(key)

  if (!fn) {
    const error = `No function registered for key: "${key}"`
    console.warn(`[expose] ${error}`)
    fetchNui<InvokeResult>('exposeResult', { requestId, error })
    return
  }

  try {
    const result = await Promise.resolve(fn(...args))
    fetchNui<InvokeResult>('exposeResult', { requestId, result })
  } catch (e) {
    fetchNui<InvokeResult>('exposeResult', { requestId, error: String(e) })
  }
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