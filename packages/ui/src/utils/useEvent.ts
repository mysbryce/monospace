import { type RefObject, useEffect, useRef } from 'preact/compat'

interface NuiMessageData<T = unknown> {
  type: string
  data: T
}

type NuiHandlerSignature<T> = (data: T) => void

export const useEvent = <T = unknown>(type: string, handler: (data: T) => void) => {
  const savedHandler: RefObject<NuiHandlerSignature<T>> = useRef(() => {})

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const eventListener = (event: MessageEvent<NuiMessageData<T>>) => {
      const { type: eventAction, data } = event.data

      if (savedHandler.current) {
        if (eventAction === type) {
          savedHandler.current(data)
        }
      }
    }

    window.addEventListener('message', eventListener)
    return () => window.removeEventListener('message', eventListener)
  }, [type])
}
