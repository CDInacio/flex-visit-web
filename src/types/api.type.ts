import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiServiceErr = any

export type MutOpt<Response, T = unknown> = UseMutationOptions<
  Response,
  ApiServiceErr,
  T,
  unknown
>

export type QueryOpt<Response, T = unknown> = UseQueryOptions<
  Response,
  ApiServiceErr,
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any[]
>
