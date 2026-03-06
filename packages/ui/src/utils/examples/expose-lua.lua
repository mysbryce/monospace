---@class ExposeRegistries
---@type table<string, fun(args: table, callback: fun(result: any, err: string|nil): nil): nil>
local registries = {}

---@type table<string, fun(result: any, err: string|nil): nil>
local pendingCallbacks = {}

local requestCounter = 0
local function generateRequestId()
  requestCounter = requestCounter + 1
  return tostring(requestCounter)
end

-- JS → Lua: register exposed keys
RegisterNUICallback('exposes', function(keys, cb)
  for _, key in ipairs(keys) do
    registries[key] = function(args, callback)
      local requestId = generateRequestId()
      pendingCallbacks[requestId] = callback

      SendNUIMessage({
        type = 'invokeExpose',
        data = {
          requestId = requestId,
          key = key,
          args = args or {}
        }
      })
    end
  end
  cb('ok')
end)

-- JS → Lua: return result back to caller
RegisterNUICallback('exposeResult', function(data, cb)
  local callback = pendingCallbacks[data.requestId]

  if callback then
    pendingCallbacks[data.requestId] = nil
    callback(data.result, data.error)
  end

  cb('ok')
end)

return registries