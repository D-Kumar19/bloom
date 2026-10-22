type CounterErrorCode =
  | 'redis_config_incomplete'
  | 'redis_url_invalid'
  | 'redis_token_invalid'
  | 'redis_config_missing'
  | 'redis_network_error'
  | 'redis_timeout'
  | 'redis_http_error'
  | 'redis_response_invalid'
  | 'redis_command_error'
  | 'counter_value_invalid'
  | 'client_ip_missing'
  | 'rate_limit_secret_invalid'
  | 'client_platform_unsupported'

export class CounterError extends Error {
  constructor(
    public readonly code: CounterErrorCode,
    message: string,
    public readonly httpStatus?: number
  ) {
    super(message)
    this.name = 'CounterError'
  }
}

export function logCounterFailure(
  operation: 'read' | 'recording',
  error: unknown
): void {
  const diagnostic =
    error instanceof CounterError
      ? {
          code: error.code,
          ...(error.httpStatus === undefined
            ? {}
            : { httpStatus: error.httpStatus }),
        }
      : { code: 'unexpected_counter_error' }
  // Never log upstream bodies, URLs, tokens, IPs, or arbitrary error messages.
  console.error(`Bouquet counter ${operation} failed.`, diagnostic)
}
