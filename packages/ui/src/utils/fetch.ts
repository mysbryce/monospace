declare global {
  interface Window {
    GetParentResourceName: () => string
  }
}

export async function fetchNui<T = unknown>(eventName: string, data?: unknown, mockData?: T): Promise<T> {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  }

  if (import.meta.env.DEV && mockData) return mockData
  const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : 'nui-frame-app'
  const resp = await fetch(`https://${resourceName}/${eventName}`, options)
  const respFormatted = await resp.json()

  return respFormatted
}
