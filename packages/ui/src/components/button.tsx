import type { PropsWithChildren } from 'preact/compat'

// Example Button
export function Button({ children }: PropsWithChildren) {
  return (
    <button className="bg-zinc-200 text-zinc-800 font-medium px-4 py-1.5 rounded transition-all duration-500">
      {children}
    </button>
  )
}
