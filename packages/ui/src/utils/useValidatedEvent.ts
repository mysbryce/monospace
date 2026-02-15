import { treeifyError, z } from 'zod'
import { useEvent } from './useEvent.js'

interface ZodErrorTree {
  errors: string[]
  properties: Record<string, ZodErrorTree>
  items?: ZodErrorTree[]
}

const logErrorTree = (node: ZodErrorTree, path: string = '') => {
  if (node.errors && node.errors.length > 0) {
    node.errors.forEach((msg: string) => {
      console.log(`[Field: ${path || 'root'}] -> ${msg}`)
    })
  }

  if (node.properties) {
    for (const key in node.properties) {
      const currentPath = path ? `${path}.${key}` : key
      if (node.properties[key]) {
        logErrorTree(node.properties[key], currentPath)
      }
    }
  }

  if (node.items && Array.isArray(node.items)) {
    node.items.forEach((item: ZodErrorTree, index: number) => {
      const currentPath = `${path}[${index}]`
      logErrorTree(item, currentPath)
    })
  }
}

export function useValidatedEvent<T>(eventName: string, schema: z.ZodSchema<T>, handler: (data: T) => void) {
  useEvent<unknown>(eventName, (rawData: unknown) => {
    const result = schema.safeParse(rawData)

    if (result.success) {
      handler(result.data)
    } else {
      const errorResult = treeifyError(result.error) as ZodErrorTree

      console.log(`[Validation Failed] Event: "${eventName}"`)
      console.log('-------------------------------------------')

      if (errorResult.errors && errorResult.errors.length > 0) {
        errorResult.errors.forEach((err) => console.log(`[Root Error]: ${err}`))
      }

      logErrorTree(errorResult)

      console.log('-------------------------------------------')
    }
  })
}
