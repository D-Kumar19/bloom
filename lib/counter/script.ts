import { COUNT_LIMITS } from './contract'

// Quotas, duplicate detection, and increment must execute as one Redis operation.
export const RECORD_SHARE_SCRIPT = `
local raw = redis.call('GET', KEYS[1])
local count = tonumber(raw or '0')
if (raw and raw ~= '0' and not string.match(raw, '^[1-9]%d*$')) or not count or count < 0 or count % 1 ~= 0 or count >= 9007199254740991 then
  return redis.error_reply('Invalid bouquet count')
end
local now = tonumber(redis.call('TIME')[1])
local retry = 0
local windows = {}
for i = 1, #ARGV, 2 do
  local seconds = tonumber(ARGV[i])
  local limit = tonumber(ARGV[i + 1])
  local bucket = math.floor(now / seconds)
  local key = KEYS[(i + 1) / 2 + 2]
  local rawQuota = redis.call('GET', key)
  local oldBucket, oldUsed = string.match(rawQuota or '', '^(%d+):(%d+)$')
  if rawQuota and not oldBucket then
    return redis.error_reply('Invalid counter quota')
  end
  local used = 0
  if tonumber(oldBucket) == bucket then used = tonumber(oldUsed) end
  local remaining = seconds - (now % seconds)
  if used >= limit then retry = math.max(retry, remaining) end
  table.insert(windows, {key, remaining, bucket, used})
end
if retry > 0 then return {'limited', retry} end
for _, window in ipairs(windows) do
  redis.call('SET', window[1], window[3] .. ':' .. (window[4] + 1), 'EX', window[2])
end
if redis.call('EXISTS', KEYS[2]) == 1 then return {'duplicate', count} end
redis.call('SET', KEYS[2], '1')
count = redis.pcall('INCR', KEYS[1])
if type(count) == 'table' and count.err then
  redis.call('DEL', KEYS[2])
  return redis.error_reply(count.err)
end
return {'counted', count}
`

export const SHARE_SCRIPT_ARGUMENTS = COUNT_LIMITS.flatMap(
  ({ seconds, requests }) => [String(seconds), String(requests)]
)
